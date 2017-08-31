import moment from 'moment'
import {REHYDRATE} from 'redux-persist/constants'

import * as Actions from './actions'
import {defaultSourcePacks} from './defaultSources'

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
 * Initial state for state.sources. A remap of the defaultSources.defaultSourcePacks array.
 */
const initialSourcesState = defaultSourcePacks.reduce(
    (result, pack) => {
        result[pack.key] = {
            ...pack,
            enabled: true,
        }

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
