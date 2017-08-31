import {toFeed} from './parsers'

/**
 * Starts the process of refreshing the feed for a list of source packs and a set of item keys that the user has already
 * seen. Returns a promise that once resolved contains a list (array) of feed items that the user has not yet seen.
 */
export function refreshSources(sourcePacks, seenKeysSet) {
    const sourceFeeds = []
    sourcePacks.forEach((pack) => {
        if (!pack.enabled) {
            return
        }

        pack.sources.forEach((source) => {
            const sourceFeed = sourceToFeed(source)
            sourceFeeds.push(sourceFeed)
        })
    })

    return Promise.all(sourceFeeds)
        .then((results) => {
            const fullFeed = [].concat(...results)
            fullFeed.sort((left, right) => {
                if (left.timestamp.isBefore(right.timestamp)) {
                    return 1
                }

                if (left.timestamp.isAfter(right.timestamp)) {
                    return -1
                }

                return 0
            })

            return fullFeed.filter((item) => (!seenKeysSet.has(item.key)))
        })
        .catch((err) => {
            console.log("ERROR: ", err)
        })
}

/**
 * Given a source, returns a promise that when resolved contains the list of items from that source.
 */
function sourceToFeed(source) {
    return fetch(source.url)
        .then((response) => (response.text()))
        .then((responseBody) => (toFeed(source, responseBody)))
        .catch((err) => {
            console.log("ERROR: ", err)
        })
}
