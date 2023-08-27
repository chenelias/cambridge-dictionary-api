# [Cambridge Dictionary API](https://github.com/chenelias/cambridge-dictionary-api)

A simple API for Cambridge Dictionary, written in Node.js.

## Example
/api/dictionary/`english-chinese-traditional`/`dictionary`
```json
{
    "word": "dictionary",
    "pos": [
        "noun"
    ],
    "pronunciation": [
        {
            "lang": "us",
            "url": "https://dictionary.cambridge.org/us/media/english-chinese-traditional/us_pron/d/dic/dicti/dictionary.mp3",
            "pron": "/ˈdɪk.ʃən.er.i/"
        },
        {
            "lang": "uk",
            "url": "https://dictionary.cambridge.org/us/media/english-chinese-traditional/uk_pron/u/ukd/ukdia/ukdiaph030.mp3",
            "pron": "/ˈdɪk.ʃən.ər.i/"
        }
    ],
    "definition": [
        {
            "id": 0,
            "text": "a book that contains a list of words in alphabetical order and that explains their meanings, or gives a word for them in another language; a similar product for use on a computer",
            "translation": "字典，詞典",
            "example": [
                [
                    {
                        "id": 0,
                        "text": "a French-English/English-French dictionary",
                        "translation": "法英／英法詞典"
                    },
                    {
                        "id": 1,
                        "text": "a bilingual/monolingual dictionary",
                        "translation": "雙語／單語詞典"
                    },
                    {
                        "id": 2,
                        "text": "To check how a word is spelled, look it up in a dictionary.",
                        "translation": "要確定單詞的拼法就查詞典。"
                    }
                ]
            ]
        },
        {
            "id": 1,
            "text": "a book that gives information about a particular subject, in which the entries (= words or phrases) are given in alphabetical order",
            "translation": "專業詞典，專門詞典",
            "example": [
                [
                    {
                        "id": 3,
                        "text": "a biographical/science dictionary",
                        "translation": "人名／科技詞典"
                    },
                    {
                        "id": 4,
                        "text": "a dictionary of quotations",
                        "translation": "引語詞典"
                    }
                ]
            ]
        }
    ]
}
```

## 📖How to use it
/api/dictionary/`{language}`/`{word}`
- language option: `english` | `english-chinese-simplified` |  `english-chinese-traditional`

## 🌐Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/chenelias/cambridge-dictionary-api/)

## 💻Running Locally
After clone this repository, run the following commands in the repository floder:
```bash
# install dependencies
npm install
# run
npm run dev
```
Then fetch `http://localhost:3000/api/dictionary/english/hello` to test it.