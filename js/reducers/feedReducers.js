import {Constants} from '/constants'

/**
 * The feed starts out as no initialized and empty.
 */
const initialFeedState = {
    status: Constants.Feed.Status.NotInitialized,
    contents: [],
}

/**
 * The main reducer for state.feed. Allows settings the feed status and contents in a single action (SetFeed).
 */
function feedReducer(state = initialFeedState, action) {
    switch (action.type) {
        case Constants.Feed.Action.Set:
            return {
                ...state,
                status: action.status,
                contents: action.contents,
            }
    }

    return state
}

/**
 * Reducer for state.seenKeys, allowing for adding new keys to the set of user seen item keys.
 */
function seenKeysReducer(state = {}, action) {
    switch (action.type) {
        case Constants.Feed.Action.MarkItemsSeen:
            const copy = {...state}
            action.keys.forEach((key) => {
                copy[key] = true
            })

            return copy
    }

    return state
}

/**
 * Previews starts uninitialized and empty.
 */
const initialPreviewState = {
    status: Constants.Feed.Status.NotInitialized,
    contents: [],
    requestedKey: null,
}

/**
 * The reducer for state.preview.
 */
function previewReducer(state = initialPreviewState, action) {
    switch (action.type) {
        case Constants.Feed.Action.SetPreview:
            return {
                ...state,
                status: action.status,
                contents: action.contents,
                requestedKey: action.requestedKey,
            }
    }

    return state
}

export const Feed = {
    Feed: feedReducer,
    Preview: previewReducer,
    SeenKeys: seenKeysReducer,
}
