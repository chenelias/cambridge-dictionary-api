# [Cambridge Dictionary API](https://github.com/chenelias/cambridge-dictionary-api)

A simple API for Cambridge Dictionary, written in Node.js.

## Example

/api/dictionary/`english-chinese-traditional`/`dictionary`

```json
{
    "word": "hello",
    "pos": ["exclamation", "noun"],
    "pronunciation": [
        {
            "lang": "us",
            "url": "https://dictionary.cambridge.org/us/media/english-chinese-traditional/us_pron/h/hel/hello/hello.mp3",
            "pron": "/heˈloʊ/"
        },
        {
            "lang": "uk",
            "url": "https://dictionary.cambridge.org/us/media/english-chinese-traditional/uk_pron/u/ukh/ukhef/ukheft_029.mp3",
            "pron": "/heˈləʊ/"
        }
    ],
    "definition": [
        {
            "id": 0,
            "text": "used when meeting or greeting someone",
            "translation": "喂，你好（用於問候或打招呼）",
            "example": [
                {
                    "id": 0,
                    "text": "Hello, Paul. I haven't seen you for ages.",
                    "translation": "「你好，保羅。好久不見了。」"
                },
                {
                    "id": 1,
                    "text": "I know her vaguely - we've exchanged hellos a few times.",
                    "translation": "我對她不太熟悉——我們只有打過幾次招呼。"
                },
                {
                    "id": 2,
                    "text": "I just thought I'd call by and say hello.",
                    "translation": "我正好想要去順道拜訪問候一下。"
                },
                {
                    "id": 3,
                    "text": "And a big hello (= welcome) to all the parents who've come to see the show.",
                    "translation": "非常歡迎所有來看演出的家長。"
                }
            ]
        },
        {
            "id": 1,
            "text": "something that is said at the beginning of a phone conversation",
            "translation": "（打電話時的招呼語）你好，喂",
            "example": [
                {
                    "id": 4,
                    "text": "\"Hello, I'd like some information about flights to the US, please.\"",
                    "translation": "「你好，我想詢問一些你們飛往美國的航班資料。」"
                }
            ]
        },
        {
            "id": 2,
            "text": "something that is said to attract someone's attention",
            "translation": "（引起別人注意的招呼語）",
            "example": [
                {
                    "id": 5,
                    "text": "The front door was open so she walked inside and called out, \"Hello! Is there anybody in?\"",
                    "translation": "前門開著，於是她走進去喊道：「喂！有人在嗎?」"
                }
            ]
        },
        {
            "id": 3,
            "text": "said to someone who has just said or done something stupid, especially something that shows they are not noticing what is happening",
            "translation": "（表示認為某人言行愚蠢可笑，尤指對正在發生的事不注意）",
            "example": [
                {
                    "id": 6,
                    "text": "She asked me if I'd just arrived and I was like \"Hello, I've been here for an hour.\"",
                    "translation": "她問我是否剛剛到，我回答她說「嗨，我已經到這裡一個小時了。」"
                }
            ]
        },
        {
            "id": 4,
            "text": "an expression of surprise",
            "translation": "（表示驚訝）",
            "example": [
                {
                    "id": 7,
                    "text": "Hello, this is very strange - I know that man.",
                    "translation": "嘿，這可真奇怪——我認識那個人。"
                }
            ]
        }
    ]
}
```

## 📖 How to use it

/api/dictionary/`{language}`/`{word}`

-   language option: `english` | `english-chinese-simplified` | `english-chinese-traditional`

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

Then fetch `http://localhost:3000/api/dictionary/english/hello` to test it.
