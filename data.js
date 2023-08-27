const cheerio = require('cheerio')
const request = require('request')
const express = require('express')
const app = express()

app.get('/api/dictionary/:language/:entry', (req, res, next) => {
    const entry = req.params.entry
    const language = req.params.language
    const url = `https://dictionary.cambridge.org/us/dictionary/${language}/${entry}`

    request(url, (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html)
            const siteurl = 'https://dictionary.cambridge.org'

            // basic

            const word = $('.hw.dhw').first().text()
            const pos = $('.pos.dpos') // part of speech
                .map((index, element) => {
                    return $(element).text()
                })
                .get()

            // pronunciation

            const usaudio = siteurl + $('.us.dpron-i audio source').first().attr('src')
            const uspron = $('.us.dpron-i .pron.dpron').first().text()
            const ukaudio = siteurl + $('.uk.dpron-i audio source').first().attr('src')
            const ukpron = $('.uk.dpron-i .pron.dpron').first().text()

            // definition & example

            const exampleCount = $('.def-body.ddef_b')
                .map((index, element) => {
                    const exampleElements = $(element).find('.examp.dexamp')
                    return exampleElements.length
                })
                .get()
            for (let i = 0; i < exampleCount.length; i++) {
                if (i == 0) {
                    exampleCount[i] = exampleCount[i]
                } else {
                    exampleCount[i] = exampleCount[i] + exampleCount[i - 1]
                }
            }

            const exampletrans = $('.examp.dexamp > .trans.dtrans.dtrans-se.hdb.break-cj') // translation of the example
            const example = $('.examp.dexamp > .eg.deg')
                .map((index, element) => {
                    return {
                        id: index,
                        text: $(element).text(),
                        translation: exampletrans.eq(index).text(),
                    }
                })
                .get()

            const definitiontrans = $('.def-body.ddef_b > .trans.dtrans.dtrans-se.break-cj') // translation of the definition
            const definition = $('.def.ddef_d.db')
                .map((index, element) => {
                    return {
                        id: index,
                        text: $(element).text(),
                        translation: definitiontrans.eq(index).text(),
                        example: example.slice(exampleCount[index - 1], exampleCount[index]),
                    }
                })
                .get()

            // api response

            res.status(200).json({
                word: word,
                pos: pos,
                pronunciation: [
                    {
                        lang: 'us',
                        url: usaudio,
                        pron: uspron,
                    },
                    {
                        lang: 'uk',
                        url: ukaudio,
                        pron: ukpron,
                    },
                ],
                definition: definition,
            })
        }
    })
})

module.exports = app
