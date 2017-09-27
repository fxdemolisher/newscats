import moment from 'moment'

import {Constants} from '/constants'

/**
 * Parsing function for reddit's JSON format, returns a Promise that resolves to the list of feed items.
 */
function parseFeedItems(jsonString) {
    const json = JSON.parse(jsonString)
    const feed = []
    json.data.children.forEach((entry) => {
        if (!entry.data.preview || !entry.data.preview.images || entry.data.preview.images.length == 0) {
            return
        }

        const preview = entry.data.preview.images[0]
        const itemUrl = 'https://www.reddit.com' + entry.data.permalink

        // Extract main image and its preview image at a reasonable resolution.
        let mediaType = Constants.Feed.MediaType.Image
        let mediaUrl = preview.source.url
        let previewUrl = mediaUrl
        if (preview.resolutions.length > 0) {
            previewUrl = preview.resolutions[Math.min(4, preview.resolutions.length - 1)].url
        }

        // If there is a video variant, use it instead of images as preview and media.
        if (preview.variants && preview.variants.mp4) {
            const videoVariant = preview.variants.mp4
            mediaType = Constants.Feed.MediaType.VideoMp4
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
 * Checks if the reddit integration is configured and authorized (connected). If it is, places an API call to
 * reddit's vote API to either upvote or toggle an item. We use this so that when reddit is connected we can
 * synchronize newscat's favorites with reddit votes.
 */
function vote(redditId, oauth, direction) {
    // Called when an access token is ready, places the actual API call.
    const voter = ({accessToken, customUserAgentString}) => {
        const headers = {
            'Authorization': 'bearer ' + accessToken,
        }

        if (customUserAgentString) {
            headers['User-Agent'] = customUserAgentString
        }

        const formData = new FormData()
        formData.append("id", redditId)
        formData.append("dir", "" + direction)

        const requestConfig = {
            method: 'POST',
            headers: headers,
            body: formData,
        }

        fetch('https://oauth.reddit.com/api/vote', requestConfig)
            .then((response) => {
                console.log('INFO: Completed reddit vote request: ', response.ok, response.status)
            })
            .catch((err) => {
                console.log("ERROR: ", err)
            })
    }

    // Called when the connection (authorization) check completes.
    // Either starts an access token retrieval or does nothing (if not authorized).
    const connectionCheck = (isConnected) => {
        if (!isConnected) {
            return
        }

        return oauth.getAccessToken('reddit')
            .then(voter)
            .catch((err) => {
                console.log("ERROR: ", err)
            })
    }

    // Trigger the vote by first checking if the reddit integration is enabled.
    oauth.isProviderConnected('reddit')
        .then(connectionCheck)
        .catch((err) => {
            console.log("ERROR: ", err)
        })
}

export const Reddit = {
    parseFeedItems,
    vote,
}
