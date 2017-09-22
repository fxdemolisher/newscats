/**
 * Called when an item is being favorited, lets any necessary integrations know via API calls (e.g. reddit upvote).
 */
export function onItemFavorite(item, oauth) {
    if (item.key.startsWith('reddit_')) {
        voteRedditItem(item.key.replace('reddit_', 't3_'), oauth, 1 /* UP */)
        return
    }
}

/**
 * Called when an item is being unfavorited, lets any necessary integrations know via API calls (e.g. reddit downvote).
 */
export function onItemUnfavorite(item, oauth) {
    if (item.key.startsWith('reddit_')) {
        voteRedditItem(item.key.replace('reddit_', 't3_'), oauth, 0 /* TOGGLE */)
        return
    }
}

/**
 * Checks if the reddit integration is configured and authorized (connected). If it is, places an API call to
 * reddit's vote API to either upvote or toggle an item. We use this so that when reddit is connected we can
 * synchronize newscat's favorites with reddit votes.
 */
function voteRedditItem(redditId, oauth, direction) {
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
