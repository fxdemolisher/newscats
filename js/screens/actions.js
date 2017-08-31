import {refreshSources} from './feedFetcher'

/**
 * Various action types in the app.
 * Some can be used directly via dispatch, others should not be used directly but have convenience functions
 * in this module (e.g. addSource).
 */
export const Action = {
    SetFeed: 'SetFeed',
    ToggleSource: 'ToggleSource',
    AddFavorite: 'AddFavorite',
    RemoveFavorite: 'RemoveFavorite',
    MarkSeen: 'MarkSeen',
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
