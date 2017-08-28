import moment from 'moment'

/**
 * The set of available feed parsers, effectively defining what kind of sources can be added to the app.
 */
export const Parsers = {
    Reddit: 'Reddit',
    Instagram: 'Instagram',
}

/**
 * A mapping between parser name and the function responsible for processing that feed.
 */
const ParserToFunction = {
    [Parsers.Reddit]: redditJsonToFeed,
    [Parsers.Instagram]: instagramJsonToFeed,
}

/**
 * Given a parser name and the response body (text) of the source, transforms the response to a list
 * of items that can be displayed in our feed.
 */
export function toFeed(parser, responseBody) {
    return ParserToFunction[parser](responseBody)
}

/**
 * Parsing function for reddit's JSON format.
 */
function redditJsonToFeed(jsonString) {
    const json = JSON.parse(jsonString)
    const feed = []
    json.data.children.forEach((entry) => {
        if (!entry.data.preview || !entry.data.preview.images || entry.data.preview.images.length == 0) {
            return
        }

        const preview = entry.data.preview.images[0]
        let previewUrl = preview.source.url
        if (preview.resolutions.length > 0) {
            previewUrl = preview.resolutions[Math.min(4, preview.resolutions.length - 1)].url
        }

        const itemUrl = 'https://www.reddit.com' + entry.data.permalink

        const feedEntry = {
            key: 'reddit_' + entry.data.id,
            previewUrl: previewUrl,
            timestamp: moment.utc(entry.data.created_utc * 1000),
            title: entry.data.title,
            url: itemUrl,
        }

        feed.push(feedEntry)
    })

    return Promise.resolve(feed)
}

/**
 * Parsing function for Instagram's JSON format (/media/).
 */
function instagramJsonToFeed(jsonString) {
    const json = JSON.parse(jsonString)
    const feed = []
    json.items.forEach((item) => {
        let title = null
        if (item.caption) {
            title = item.caption.text
        }

        const feedEntry = {
            key: 'instagram_' + item.id,
            previewUrl: item.images.standard_resolution.url,
            timestamp: moment.utc(item.created_time * 1000),
            title: title,
            url: item.link,
        }

        feed.push(feedEntry)
    })

    return Promise.resolve(feed)
}
