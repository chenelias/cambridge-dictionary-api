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

### 🔎 search

> [!NOTE]
> have the problem with puppeteer running on vercel on search branch(but works fine on local env)

**use `/` to test it with UI**

## 🌐 Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/chenelias/cambridge-dictionary-api/)

## 💻 Running Locally

After clone this repository, run the following commands in the repository floder:

```bash
# install dependencies
npm install
# run
npm run dev
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
      "type": "Plain form",
      "text": "cook"
    },
    {
      "type": "Third-person singular",
      "text": "cooks"
    },
    {
      "type": "Past tense",
      "text": "cooked"
    },
    {
      "type": "Past participle",
      "text": "cooked"
    },
    {
      "type": "Present participle",
      "text": "cooking"
    },
    {
      "type": "Singular",
      "text": "cook"
    },
    {
      "type": "Plural",
      "text": "cooks"
    }
  ],
  "pronunciation": [
    {
      "lang": "us",
      "url": "https://dictionary.cambridge.org/us/media/english-chinese-traditional/us_pron/c/coo/cook_/cook.mp3",
      "pron": "/kʊk/"
    },
    {
      "lang": "uk",
      "url": "https://dictionary.cambridge.org/us/media/english-chinese-traditional/uk_pron/u/ukc/ukcon/ukconve028.mp3",
      "pron": "/kʊk/"
    }
  ],
  "definition": [
    {
      "id": 0,
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
      "text": "someone who prepares and cooks food",
      "translation": "廚師",
      "example": [
        {
          "id": 3,
          "text": "She's a wonderful cook.",
          "translation": "她是位很出色的廚師。"
        }
      ]
    }
  ]
}
```

/api/search/`wond` (search branch)

```json
{
  "suggestions": [
    "wonder",
    "wonder drug",
    "wonderful",
    "wonderfully",
    "wonderland",
    "wonderment",
    "wonders never cease"
  ]
}
```

Develop by Elias ❤️
