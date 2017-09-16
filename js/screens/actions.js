import {refreshSources} from './feedFetcher'
import {parseSourcePacks} from './packParsers'

/**
 * Various action types in the app.
 * Some can be used directly via dispatch, others should not be used directly but have convenience functions
 * in this module (e.g. addSource).
 */
export const Action = {
    SetFeed: 'SetFeed',
    ToggleSource: 'ToggleSource',
    MergeSources: 'MergeSources',
    AddFavorite: 'AddFavorite',
    RemoveFavorite: 'RemoveFavorite',
    MarkSeen: 'MarkSeen',
    SetSourcePacksDownloadStatus: 'SetSourcePacksDownloadStatus',
    SetPreview: 'SetPreview',
}

/**
 * Statuses that the feed can be in (state.feed.status).
 */
export const FeedStatus = {
    NotInitialized: 'NotInitialized',
    Refreshing: 'Refreshing',
    Ready: 'Ready',
}

/**
 * Statuses that pack download can take (state.sourcePacksDownload.status).
 */
export const SourcePacksDownloadStatus = {
    Idle: 'Idle',
    Downloading: 'Downloading',
    Error: 'Error',
}

/**
 * An action (thunk) that will start the refresh process for the feed if it not already in progress.
 */
export function refreshFeed() {
    return (dispatch, getState) => {
        const state = getState()
        if (state.feed.status == FeedStatus.Refreshing) {
            return
        }

        dispatch({
            type: Action.SetFeed,
            status: FeedStatus.Refreshing,
            contents: [],
        })

        const seenKeySet = new Set(Object.keys(state.seenKeys))
        const sourcePacks = Object.values(state.sources)
            .filter((pack) => (pack.enabled))

        refreshSources(sourcePacks, seenKeySet)
            .then((unseenItems) => {
                dispatch({
                    type: Action.SetFeed,
                    status: FeedStatus.Ready,
                    contents: unseenItems,
                })
            })
            .catch((err) => {
                console.log("ERROR: ", err)
            })
    }
}

/**
 * Returns an action (thunk) that sets the enabled status of a source with the given key and clears the feed.
 */
export function toggleSource(key, enabled) {
    return (dispatch) => {
        dispatch({
            type: Action.ToggleSource,
            key: key,
            enabled: enabled,
        })

        dispatch(refreshFeed())
    }
}

/**
 * Triggers the download of the latest source packs from github, and merges them with the current sources
 * when ready. If an error occurs during download, nothing is done.
 */
export function downloadLatestSourcePacks() {
    return (dispatch) => {
        dispatch({
            type: Action.SetSourcePacksDownloadStatus,
            status: SourcePacksDownloadStatus.Downloading,
        })

        const downloadUrl = 'https://raw.githubusercontent.com/fxdemolisher/newscats/master/js/assets/sourcePacks.json'
        const downloadedPacks = fetch(downloadUrl)
            .then((response) => (response.json()))
            .then((json) => {
                const downloadedPacks = parseSourcePacks(json)

                const newSourcePacksMap = {}
                downloadedPacks.forEach((pack) => {
                    newSourcePacksMap[pack.key] = pack
                })

                dispatch({
                    type: Action.MergeSources,
                    newSourcePacksMap: newSourcePacksMap,
                })

                dispatch(refreshFeed())

                dispatch({
                    type: Action.SetSourcePacksDownloadStatus,
                    status: SourcePacksDownloadStatus.Idle,
                })
            })
            .catch((err) => {
                dispatch({
                    type: Action.SetSourcePacksDownloadStatus,
                    status: SourcePacksDownloadStatus.Error,
                })

                console.log("ERROR: ", err)
            })
    }
}

/**
 * Returns an action (thunk) that adds the given item to the favorites set.
 */
export function addFavorite(item) {
    return (dispatch) => {
        dispatch({
            type: Action.AddFavorite,
            item: item,
        })
    }
}

/**
 * Returns an action (thunk) that removes a favorite from the favorites set.
 */
export function removeFavorite(item) {
    return (dispatch) => {
        dispatch({
            type: Action.RemoveFavorite,
            key: item.key,
        })
    }
}

/**
 * Returns an action (thunk) that marks a given item key as one that has been seen by the user.
 */
export function markSeen(keys) {
    return (dispatch) => {
        dispatch({
            type: Action.MarkSeen,
            keys: keys,
        })
    }
}

/**
 * An action (thunk) that will start the refresh process of a preview feed with the given source pack key.
 */
export function refreshPreview(sourcePackKey) {
    return (dispatch, getState) => {
        dispatch({
            type: Action.SetPreview,
            status: FeedStatus.Refreshing,
            contents: [],
            requestedKey: sourcePackKey,
        })

        const state = getState()
        const sourcePack = state.sources[sourcePackKey]

        refreshSources([sourcePack], new Set())
            .then((previewItems) => {
                if (getState().preview.requestedKey != sourcePackKey) {
                    return
                }

                dispatch({
                    type: Action.SetPreview,
                    status: FeedStatus.Ready,
                    contents: previewItems,
                    requestedKey: sourcePackKey,
                })
            })
            .catch((err) => {
                console.log("ERROR: ", err)
            })
    }
}
