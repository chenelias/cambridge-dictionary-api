const cheerio = require("cheerio");
const request = require("request");
const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");

const fetchVerbs = (wiki) => {
  return new Promise((resolve, reject) => {
    axios
      .get(wiki)
      .then((response) => {
        const $$ = cheerio.load(response.data);
        const verbs = [];

        $$(".inflection-table tr td").each((index, cell) => {
          const cellElement = $$(cell);
          const cellText = cellElement.text().trim();

          if (!cellText || cellText === "") return;

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
              if (htmlContent.includes("<br>")) {
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

        resolve(verbs);
      })
      .catch((error) => {
        resolve();
      });
  });
};

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/dictionary/:language/:entry", (req, res, next) => {
  const entry = req.params.entry;
  const slugLanguage = req.params.language;
  let nation = "us";

  if (slugLanguage === "en") {
    language = "english";
  } else if (slugLanguage === "uk") {
    language = "english";
    nation = "uk";
  } else if (slugLanguage === "en-tw") {
    language = "english-chinese-traditional";
  } else if (slugLanguage === "en-cn") {
    language = "english-chinese-simplified";
  }

  const url = `https://dictionary.cambridge.org/${nation}/dictionary/${language}/${entry}`;
  request(url, async (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      const siteurl = "https://dictionary.cambridge.org";
      const wiki = `https://simple.wiktionary.org/wiki/${entry}`;

      // get verbs

      const verbs = await fetchVerbs(wiki);

      // basic

      const word = $(".hw.dhw").first().text();
      const getPos = $(".pos.dpos") // part of speech
        .map((index, element) => {
          return $(element).text();
        })
        .get();
      const pos = getPos.filter(
        (item, index) => getPos.indexOf(item) === index,
      );

      // Phonetics audios
      const audio = [];
      for (const s of $(".pos-header.dpos-h")) {
        const posNode = s.childNodes.find(
          (c) =>
            c.attribs && c.attribs.class && c.attribs.class.includes("dpos-g"),
        );
        if (!posNode || posNode.childNodes.length === 0) continue;
        const p = $(posNode.childNodes[0]).text();
        const nodes = s.childNodes.filter(
          (c) =>
            c.name === "span" &&
            c.attribs &&
            c.attribs.class &&
            c.attribs.class.includes("dpron-i"),
        );
        if (nodes.length === 0) continue;
        for (const node of nodes) {
          if (node.childNodes.length < 3) continue;
          const lang = $(node.childNodes[0]).text();
          const aud = node.childNodes[1].childNodes.find(
            (c) => c.name === "audio",
          );
          if (!aud) continue;
          const src = aud.childNodes.find((c) => c.name === "source");
          if (!src) continue;
          const url = siteurl + $(src).attr("src");
          const pron = $(node.childNodes[2]).text();
          audio.push({ pos: p, lang: lang, url: url, pron: pron });
        }
      }

      // definition & example
      const exampleCount = $(".def-body.ddef_b")
        .map((index, element) => {
          const exampleElements = $(element).find(".examp.dexamp");
          return exampleElements.length;
        })
        .get();
      for (let i = 0; i < exampleCount.length; i++) {
        if (i == 0) {
          exampleCount[i] = exampleCount[i];
        } else {
          exampleCount[i] = exampleCount[i] + exampleCount[i - 1];
        }
      }

      const exampletrans = $(
        ".examp.dexamp > .trans.dtrans.dtrans-se.hdb.break-cj",
      ); // translation of the example
      const example = $(".examp.dexamp > .eg.deg")
        .map((index, element) => {
          return {
            id: index,
            text: $(element).text(),
            translation: exampletrans.eq(index).text(),
          };
        })
        .get();

      const source = (element) => {
        const defElement = $(element);
        const parentElement = defElement.closest(".pr.dictionary");
        const dataId = parentElement.attr("data-id");
        return dataId;
      };

      const defPos = (element) => {
        const defElement = $(element);
        const partOfSpeech = defElement
          .closest(".pr.entry-body__el")
          .find(".pos.dpos")
          .first()
          .text(); // Get the part of speech
        return partOfSpeech;
      };

      const getExample = (element) => {
        const ex = $(element)
          .find(".def-body.ddef_b > .examp.dexamp")
          .map((index, element) => {
            return {
              id: index,
              text: $(element).find(".eg.deg").text(),
              translation: $(element).find(".trans.dtrans").text(),
            };
          });
        return ex.get();
      };

      const definition = $(".def-block.ddef_block")
        .map((index, element) => {
          return {
            id: index,
            pos: defPos(element),
            source: source(element),
            text: $(element).find(".def.ddef_d.db").text(),
            translation: $(element)
              .find(".def-body.ddef_b > span.trans.dtrans")
              .text(),
            example: getExample(element),
          };
        })
        .get();

      // api response

      if (word === "") {
        res.status(404).json({
          error: "word not found",
        });
      } else {
        res.status(200).json({
          word: word,
          pos: pos,
          verbs: verbs,
          pronunciation: audio,
          definition: definition,
        });
      }
    }
  });
});
module.exports = app;
