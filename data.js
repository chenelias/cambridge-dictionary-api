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
            // pronunciation
            const usaudio = siteurl + $('.us.dpron-i audio source').first().attr('src')
            const uspron = $('.us.dpron-i .pron.dpron').first().text()
            const ukaudio = siteurl + $('.uk.dpron-i audio source').first().attr('src')
            const ukpron = $('.uk.dpron-i .pron.dpron').first().text()
            // definition
            // const definition = $('.def.ddef_d.db').text()
            // const definitiontrans =
                // $('.eg.deg').each((index, element) => {
                //     console.log($(element).text())
                // })
                // api response
                res.status(200).json({
                    word: word,
                    pronunciation: [
                        {
                            text: 'us',
                            url: usaudio,
                            pron: uspron,
                        },
                        {
                            text: 'uk',
                            url: ukaudio,
                            pron: ukpron,
                        },
                    ],
                })
        }
    })
})

module.exports = app
