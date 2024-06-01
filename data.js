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
        const verb = $$("tr > td > p ").text();

        const lines = verb
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        const verbs = [];
        for (let i = 0; i < lines.length; i += 2) {
          const type = lines[i];
          const text = lines[i + 1];
          if (type && text) {
            verbs.push({ type, text });
          } else {
            verbs.push();
          }
        }

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

  if (slugLanguage === "en") {
    language = "english";
  } else if (slugLanguage === "en-tw") {
    language = "english-chinese-traditional";
  } else if (slugLanguage === "en-cn") {
    language = "english-chinese-simplified";
  }

  const url = `https://dictionary.cambridge.org/us/dictionary/${language}/${entry}`;
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

      const usaudio =
        siteurl + $(".us.dpron-i audio source").first().attr("src");
      const uspron = $(".us.dpron-i .pron.dpron").first().text();
      const ukaudio =
        siteurl + $(".uk.dpron-i audio source").first().attr("src");
      const ukpron = $(".uk.dpron-i .pron.dpron").first().text();

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

      const definitiontrans = $(
        ".def-body.ddef_b > .trans.dtrans.dtrans-se.break-cj",
      );

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

      // translation of the definition
      const definition = $(".def.ddef_d.db")
        .map((index, element) => {
          const parentPhraseBlock = $(element).closest(
            ".pr.phrase-block.dphrase-block",
          );
          if (parentPhraseBlock.length > 0) {
            return 0;
          } else {
            return {
              id: index,
              pos: defPos(element), // TODO: Implement defPos function
              source: source(element), // TODO: Implement source function
              text: $(element).text(),
              translation: definitiontrans.eq(index).text(),
              example: example.slice(
                exampleCount[index - 1],
                exampleCount[index],
              ),
            };
          }
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
          pronunciation: [
            {
              lang: "us",
              url: usaudio,
              pron: uspron,
            },
            {
              lang: "uk",
              url: ukaudio,
              pron: ukpron,
            },
          ],
          definition: definition,
        });
      }
    }
  });
});
module.exports = app;
