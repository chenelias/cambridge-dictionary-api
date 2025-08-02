const cheerio = require("cheerio");
const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");

const cache = new Map();
const CACHE_TTL = 1000 * 60 * 30;

const httpClient = axios.create({
  timeout: 10000, 
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
});

const getCacheKey = (url) => `cache_${url.replace(/[^a-zA-Z0-9]/g, '_')}`;

const getFromCache = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
  if (cache.size > 1000) {
    const now = Date.now();
    for (const [k, v] of cache.entries()) {
      if (now - v.timestamp > CACHE_TTL) {
        cache.delete(k);
      }
    }
  }
};

const fetchVerbs = async (wiki) => {
  const cacheKey = getCacheKey(wiki);
  const cached = getFromCache(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await httpClient.get(wiki);
    const $$ = cheerio.load(response.data);
    const verbs = [];

    $$(".inflection-table tr td").each((index, cell) => {
      const cellElement = $$(cell);
      const cellText = cellElement.text().trim();

      if (!cellText) return;

      const pElement = cellElement.find("p");
      if (pElement.length > 0) {
        const pText = pElement.text().trim();
        const parts = pText
          .split("\n")
          .map((p) => p.trim())
          .filter((p) => p);

        if (parts.length >= 2) {
          const type = parts[0];
          const text = parts[1];

          if (type && text) {
            verbs.push({ id: verbs.length, type, text });
          }
        } else {
          const htmlContent = pElement.html();
          if (htmlContent && htmlContent.includes("<br>")) {
            const htmlParts = htmlContent.split("<br>");
            if (htmlParts.length >= 2) {
              const type =
                $$(htmlParts[0]).text().trim() ||
                htmlParts[0].replace(/<[^>]*>/g, "").trim();
              const textPart = htmlParts[1];
              const text =
                $$(textPart).text().trim() ||
                textPart.replace(/<[^>]*>/g, "").trim();

              if (type && text) {
                verbs.push({ id: verbs.length, type, text });
              }
            }
          }
        }
      }
    });

    setCache(cacheKey, verbs);
    return verbs;
  } catch (error) {
    console.warn(`Failed to fetch verbs from ${wiki}:`, error.message);
    return [];
  }
};

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/dictionary/:language/:entry", async (req, res, next) => {
  try {
    const entry = req.params.entry;
    const slugLanguage = req.params.language;
    let language, nation = "us";

    if (slugLanguage === "en") {
      language = "english";
    } else if (slugLanguage === "uk") {
      language = "english";
      nation = "uk";
    } else if (slugLanguage === "en-tw") {
      language = "english-chinese-traditional";
    } else if (slugLanguage === "en-cn") {
      language = "english-chinese-simplified";
    } else {
      return res.status(400).json({ error: "Unsupported language" });
    }

    const url = `https://dictionary.cambridge.org/${nation}/dictionary/${language}/${entry}`;
    const wiki = `https://simple.wiktionary.org/wiki/${entry}`;
    
    const mainCacheKey = getCacheKey(url);
    const cachedResult = getFromCache(mainCacheKey);
    if (cachedResult) {
      return res.status(200).json(cachedResult);
    }

    const [dictionaryResponse, verbs] = await Promise.allSettled([
      httpClient.get(url),
      fetchVerbs(wiki)
    ]);

    if (dictionaryResponse.status === 'rejected' || dictionaryResponse.value.status !== 200) {
      return res.status(404).json({ error: "word not found" });
    }

    const $ = cheerio.load(dictionaryResponse.value.data);
    const siteurl = "https://dictionary.cambridge.org";

    const word = $(".hw.dhw").first().text();
    
    if (!word) {
      return res.status(404).json({ error: "word not found" });
    }

    const posElements = $(".pos.dpos");
    const pos = [...new Set(posElements.map((i, el) => $(el).text()).get())];

    // Phonetics audios
    const audio = [];
    $(".pos-header.dpos-h").each((i, s) => {
      const posNode = $(s).find(".dpos-g").first();
      if (!posNode.length) return;
      
      const p = posNode.text();
      $(s).find(".dpron-i").each((j, node) => {
        const $node = $(node);
        const lang = $node.find(".region.dreg").text();
        const audioSrc = $node.find("audio source").attr("src");
        const pron = $node.find(".pron.dpron").text();
        
        if (audioSrc && pron) {
          audio.push({ pos: p, lang: lang, url: siteurl + audioSrc, pron: pron });
        }
      });
    });

    // definition & example
    const definition = $(".def-block.ddef_block").map((index, element) => {
      const $element = $(element);
      const pos = $element.closest(".pr.entry-body__el").find(".pos.dpos").first().text();
      const source = $element.closest(".pr.dictionary").attr("data-id");
      const text = $element.find(".def.ddef_d.db").text();
      const translation = $element.find(".def-body.ddef_b > span.trans.dtrans").text();
      
      const example = $element.find(".def-body.ddef_b > .examp.dexamp").map((i, ex) => {
        const $ex = $(ex);
        return {
          id: i,
          text: $ex.find(".eg.deg").text(),
          translation: $ex.find(".trans.dtrans").text(),
        };
      }).get();

      return {
        id: index,
        pos: pos,
        source: source,
        text: text,
        translation: translation,
        example: example,
      };
    }).get();

    // api response
    const result = {
      word: word,
      pos: pos,
      verbs: verbs.status === 'fulfilled' ? verbs.value : [],
      pronunciation: audio,
      definition: definition,
    };

    setCache(mainCacheKey, result);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = app;
