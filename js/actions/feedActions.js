import {Constants} from '/constants'
import {Integrations} from '/integrations'

/**
 * An action (thunk) that will start the refresh process for the feed if it not already in progress.
 */
function refresh() {
    return (dispatch, getState) => {
        const state = getState()
        if (state.feed.status == Constants.Feed.Status.Refreshing) {
            return
        }

        dispatch({
            type: Constants.Feed.Action.Set,
            status: Constants.Feed.Status.Refreshing,
            contents: [],
        })

        const seenKeySet = new Set(Object.keys(state.seenKeys))
        const sourcePacks = Object.values(state.sources)
            .filter((pack) => (pack.enabled))

        refreshSourcePacks(sourcePacks, seenKeySet)
            .then((unseenItems) => {
                dispatch({
                    type: Constants.Feed.Action.Set,
                    status: Constants.Feed.Status.Ready,
                    contents: unseenItems,
                })
            })
            .catch((err) => {
                console.log("ERROR: ", err)
            })
    }
}

/**
 * Starts the process of refreshing the feed for a list of source packs and a set of item keys that the user has already
 * seen. Returns a promise that once resolved contains a list (array) of feed items that the user has not yet seen.
 */
function refreshSourcePacks(sourcePacks, seenKeysSet) {
    const sourceFeeds = []
    sourcePacks.forEach((pack) => {
        pack.sources.forEach((source) => {
            const sourceFeed = sourcePackToFeed(pack, source)
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
function sourcePackToFeed(pack, source) {
    return fetch(source.url)
        .then((response) => (response.text()))
        .then((responseBody) => (toFeed(source, responseBody)))
        .then((feed) => (
            feed.map((item) => (
                {
                    ...item,
                    packTitle: pack.title,
                    sourceTitle: source.title,
                }
            ))
        ))
        .catch((err) => {
            console.log("ERROR: ", err)
        })
}

/**
 * Given a parser name and the response body (text) of the source, transforms the response to a list
 * of items that can be displayed in our feed.
 */
function toFeed(source, responseBody) {
    switch(source.parser) {
        case Constants.Feed.Parser.Reddit:
            return Integrations.Reddit.parseFeedItems(responseBody)

        case Constants.Feed.Parser.Instagram:
            return Integrations.Instagram.parseFeedItems(responseBody)

        default:
            return Promise.resolve([])
    }
}

/**
 * Returns an action (thunk) that marks a given item key as one that has been seen by the user.
 */
function markItemsSeen(keys) {
    return (dispatch) => {
        dispatch({
            type: Constants.Feed.Action.MarkItemsSeen,
            keys: keys,
        })
    }
}

/**
 * An action (thunk) that will start the refresh process of a preview feed with the given source pack key.
 */
function refreshPreview(sourcePackKey) {
    return (dispatch, getState) => {
        dispatch({
            type: Constants.Feed.Action.SetPreview,
            status: Constants.Feed.Status.Refreshing,
            contents: [],
            requestedKey: sourcePackKey,
        })

        const state = getState()
        const sourcePack = state.sources[sourcePackKey]

        refreshSourcePacks([sourcePack], new Set())
            .then((previewItems) => {
                if (getState().preview.requestedKey != sourcePackKey) {
                    return
                }

                dispatch({
                    type: Constants.Feed.Action.SetPreview,
                    status: Constants.Feed.Status.Ready,
                    contents: previewItems,
                    requestedKey: sourcePackKey,
                })
            })
            .catch((err) => {
                console.log("ERROR: ", err)
            })
    }
}

export const Feed = {
    markItemsSeen,
    refresh,
    refreshPreview,
}
