const express = require('express')
let Parser = require('rss-parser')

const app = express()
let parser = new Parser({
    headers: { 'User-Agent': 'Chrome' }
});

const bitcoinFeedUrl = 'https://soliq.uz/press-services/rss'

async function fetchRssFeed(feedUrl) {
    let feed = await parser.parseURL(feedUrl);
    return feed.items.map(item => {
        return {
            title: item.title,
            link: item.link,
            date: item.pubDate
        }
    });
}

app.get('/api/news', async (req, res) => {
    await fetchRssFeed(bitcoinFeedUrl)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                status: 'error',
                message: 'An error occurred when fetching news'
            })
        })
})

app.get('/api/ping', (req, res) => {
    var response = { answer: "pong" }
    res.status(200).json(response)
})

app.listen(80, () => {
    console.log("Server is running on port 4000")
})