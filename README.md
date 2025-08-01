# Cambridge Dictionary API

A simple API for Cambridge Dictionary, built with Node.js.

## 🕹️ Manual

### 📚️ dictionary

api/dictionary/`{language}`/`{word}`

#### **language option:**

| option      |         description         |
| ----------- | :-------------------------: |
| **`en`**    |        english (us)         |
| **`uk`**    |        english (uk)         |
| **`en-cn`** | english-chinese-simplified  |
| **`en-tw`** | english-chinese-traditional |

**use `/` to test it with UI**

## 🌐 Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/chenelias/cambridge-dictionary-api/)

## 💻 Running Locally

After clone this repository, run the following commands in the repository floder:

```bash
# install dependencies
pnpm install
# run
pnpm run dev
```

Then fetch `http://localhost:3000/api/dictionary/english/hello` to test it
or use / to test it out with UI.

## 📖 Example

/api/dictionary/`en-tw`/`cook`

```json
{
  "word": "cook",
  "pos": ["verb", "noun"],
  "verbs": [
    {
      "id": 0,
      "type": "Plain form",
      "text": "cook"
    },
    {
      "id": 1,
      "type": "Third-person singular",
      "text": "cooks"
    },
    {
      "id": 2,
      "type": "Past tense",
      "text": "cooked"
    },
    {
      "id": 3,
      "type": "Past participle",
      "text": "cooked"
    },
    {
      "id": 4,
      "type": "Present participle",
      "text": "cooking"
    },
    {
      "id": 5,
      "type": "Singular",
      "text": "cook"
    },
    {
      "id": 6,
      "type": "Plural",
      "text": "cooks"
    }
  ],
  "pronunciation": [
    {
      "pos": "verb",
      "lang": "uk",
      "url": "https://dictionary.cambridge.org/us/media/english-chinese-traditional/uk_pron/u/ukc/ukcon/ukconve028.mp3",
      "pron": "/kʊk/"
    },
    {
      "pos": "verb",
      "lang": "us",
      "url": "https://dictionary.cambridge.org/us/media/english-chinese-traditional/us_pron/c/coo/cook_/cook.mp3",
      "pron": "/kʊk/"
    },
    {
      "pos": "noun",
      "lang": "uk",
      "url": "https://dictionary.cambridge.org/us/media/english-chinese-traditional/uk_pron/u/ukc/ukcon/ukconve028.mp3",
      "pron": "/kʊk/"
    },
    {
      "pos": "noun",
      "lang": "us",
      "url": "https://dictionary.cambridge.org/us/media/english-chinese-traditional/us_pron/c/coo/cook_/cook.mp3",
      "pron": "/kʊk/"
    }
  ],
  "definition": [
    {
      "id": 0,
      "pos": "verb",
      "text": "When you cook food, you prepare it to be eaten by heating it in a particular way, such as baking or boiling, and when food cooks, it is heated until it is ready to eat.",
      "translation": "做飯，烹調;燒，煮",
      "example": [
        {
          "id": 0,
          "text": "I don't cook meat very often.",
          "translation": "我不常煮肉吃。"
        },
        {
          "id": 1,
          "text": "He cooked us a huge dinner./He cooked a huge dinner for us.",
          "translation": "他給我們準備了一頓豐盛的飯菜。"
        },
        {
          "id": 2,
          "text": "Let the fish cook for half an hour before you add the wine.",
          "translation": "先把魚煮半個小時再加入酒。"
        }
      ]
    },
    {
      "id": 1,
      "pos": "noun",
      "text": "someone who prepares and cooks food",
      "translation": "廚師",
      "example": [
        {
          "id": 0,
          "text": "She's a wonderful cook.",
          "translation": "她是位很出色的廚師。"
        }
      ]
    }
  ]
}
```

## Special thanks 🎉
[bendangelo](https://github.com/bendangelo) built a ruby version of this API\
https://codeberg.org/bendangelo/cambridge_dict

## Support me 🎉
<a href="https://www.buymeacoffee.com/eliaschen" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## API Source

- Verbs from [wiktionary](https://www.wiktionary.org/)
- Other data from [Cambridge Dictionary](https://dictionary.cambridge.org/)

Develop by Elias ❤️ \
Contributions are welcome! 🎉
