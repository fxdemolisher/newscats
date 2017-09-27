import moment from 'moment'

import {Constants} from '/constants'

/**
 * Parsing function for Instagram's JSON format (/media/), returning a promise that resolves to a list of feed items.
 */
function parseFeedItems(jsonString) {
    const json = JSON.parse(jsonString)
    const feed = []
    json.items.forEach((item) => {
        let title = null
        if (item.caption) {
            title = item.caption.text
        }

        // Start by assuming we are getting images.
        let mediaType = Constants.Feed.MediaType.Image
        let mediaUrl = item.images.standard_resolution.url

        // If there is a video variant, use it instead of images as preview and media.
        if (item.videos) {
            mediaType = Constants.Feed.MediaType.VideoMp4
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

export const Instagram = {
    parseFeedItems,
}
