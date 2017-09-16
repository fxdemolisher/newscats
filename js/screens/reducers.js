import moment from 'moment'
import {REHYDRATE} from 'redux-persist/constants'

import {Assets} from '/assets'

import * as Actions from './actions'
import {parseSourcePacks} from './packParsers'

/**
 * The feed starts out as no initialized and empty.
 */
const initialFeedState = {
    status: Actions.FeedStatus.NotInitialized,
    contents: [],
}

/**
 * The main reducer for state.feed. Allows settings the feed status and contents in a single action (SetFeed).
 */
export function feedReducer(state = initialFeedState, action) {
    switch (action.type) {
        case Actions.Action.SetFeed:
            return {
                ...state,
                status: action.status,
                contents: action.contents,
            }
    }

    return state
}

/**
 * Helper function to merge the 'sources' states when updating from downloadable file.
 * NOTE: this does not merge with the raw file contents but with the parsed version (see packParsers).
 */
function mergeSourcePacks(previousMap = {}, currentMap) {
    const copy = {...previousMap}
    Object.keys(currentMap).forEach((key) => {
        const value = {...currentMap[key]}
        if (previousMap[key]) {
            value.enabled = previousMap[key].enabled
        }

        copy[key] = value
    })

    return copy
}

/**
 * Initial state for state.sources. Contains the parsed version of sourcePacks.json included with the app.
 */
const initialSourcesState = parseSourcePacks(Assets.sourcePacks).reduce(
    (result, pack) => {
        result[pack.key] = pack
        return result
    },
    {}
)

/**
 * Reducer for state.sources, allowing manipulation (toggling) of sources.
 */
export function sourcesReducer(state = initialSourcesState, action) {
    switch(action.type) {
        case Actions.Action.ToggleSource:
            return {
                ...state,
                [action.key]: {
                    ...state[action.key],
                    enabled: action.enabled,
                }
            }

        case Actions.Action.MergeSources:
            return mergeSourcePacks(state, action.newSourcePacksMap)
    }

    return state
}

/**
 * Reducer for state.favorites, allow manipulation (add, remove). Contains special logic for restoring
 * timestamps into moment instances during rehydration of the store.
 */
export function favoritesReducer(state = {}, action) {
    switch(action.type) {
        case REHYDRATE:
            const incoming = action.payload.favorites
            if (!incoming) {
                return state
            }

            const rehydrated = {...state}
            Object.keys(incoming).forEach((key) => {
                const item = incoming[key]
                item.timestamp = moment(item.timestamp)
                rehydrated[key] = item
            })

            return rehydrated

        case Actions.Action.AddFavorite:
            return {
                ...state,
                [action.item.key]: action.item,
            }

        case Actions.Action.RemoveFavorite:
            const copy = {...state}
            delete copy[action.key]
            return copy
    }

    return state
}

/**
 * Reducer for state.seenKeys, allowing for adding new keys to the set of user seen item keys.
 */
export function seenKeysReducer(state = {}, action) {
    switch (action.type) {
        case Actions.Action.MarkSeen:
            const copy = {...state}
            action.keys.forEach((key) => {
                copy[key] = true
            })

            return copy
    }

    return state
}

/**
 * Initial state for state.sourcePacksDownload
 */
const initialSourcePacksDownloadState = {
    status: Actions.SourcePacksDownloadStatus.Idle,
}

/**
 * Reducer for state.sourcePacksDownload, tracking the download status of source packs from github.
 */
export function sourcePacksDownloadReducer(state = initialSourcePacksDownloadState, action) {
    switch (action.type) {
        case Actions.Action.SetSourcePacksDownloadStatus:
            return {
                ...state,
                status: action.status,
            }
    }

    return state
}

/**
 * Previews starts uninitialized and empty.
 */
const initialPreviewState = {
    status: Actions.FeedStatus.NotInitialized,
    contents: [],
    requestedKey: null,
}

/**
 * The reducer for state.preview.
 */
export function previewReducer(state = initialPreviewState, action) {
    switch (action.type) {
        case Actions.Action.SetPreview:
            return {
                ...state,
                status: action.status,
                contents: action.contents,
                requestedKey: action.requestedKey,
            }
    }

    return state
}
