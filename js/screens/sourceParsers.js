import moment from 'moment'

/**
 * The set of available feed parsers, effectively defining what kind of sources can be added to the app.
 */
export const Parsers = {
    Reddit: 'Reddit',
    Instagram: 'Instagram',
}

/**
 * Types of preview/detail media inside an item.
 */
export const ItemMediaType = {
    Image: 'Image',
    VideoMp4: 'VideoMp4',
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
export function toFeed(source, responseBody) {
    return ParserToFunction[source.parser](responseBody)
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
        const itemUrl = 'https://www.reddit.com' + entry.data.permalink

        // Extract main image and it's preview image at a reasonable resolution.
        let mediaType = ItemMediaType.Image
        let mediaUrl = preview.source.url
        let previewUrl = mediaUrl
        if (preview.resolutions.length > 0) {
            previewUrl = preview.resolutions[Math.min(4, preview.resolutions.length - 1)].url
        }

        // If there is a video variant, use it instead of images as preview and media.
        if (preview.variants && preview.variants.mp4) {
            const videoVariant = preview.variants.mp4
            mediaType = ItemMediaType.VideoMp4
            mediaUrl = videoVariant.source.url
            previewUrl = mediaUrl
            if (videoVariant.resolutions.length > 0) {
                previewUrl = videoVariant.resolutions[Math.min(4, videoVariant.resolutions.length - 1)].url
            }
        }

        const feedEntry = {
            key: 'reddit_' + entry.data.id,
            mediaType: mediaType,
            mediaUrl: mediaUrl,
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

        // Start by assuming we are getting images.
        let mediaType = ItemMediaType.Image
        let mediaUrl = item.images.standard_resolution.url

        // If there is a video variant, use it instead of images as preview and media.
        if (item.videos) {
            mediaType = ItemMediaType.VideoMp4
            mediaUrl = item.videos.standard_resolution.url
        }

        const feedEntry = {
            key: 'instagram_' + item.id,
            mediaType: mediaType,
            mediaUrl: mediaUrl,
            previewUrl: mediaUrl,
            timestamp: moment.utc(item.created_time * 1000),
            title: title,
            url: item.link,
        }

        feed.push(feedEntry)
    })

    return Promise.resolve(feed)
}
