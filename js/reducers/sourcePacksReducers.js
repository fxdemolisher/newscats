import {Actions} from '/actions'
import {Constants} from '/constants'
import {Assets} from '/assets'

/**
 * Initial state for state.sources. Contains the parsed version of sourcePacks.json included with the app.
 */
const initialSourcesState = Actions.SourcePacks.parse(Assets.sourcePacks).reduce(
    (result, pack) => {
        result[pack.key] = pack
        return result
    },
    {}
)

/**
 * Reducer for state.sources, allowing manipulation (toggling) of sources.
 */
function sourcesReducer(state = initialSourcesState, action) {
    switch(action.type) {
        case Constants.SourcePacks.Action.Toggle:
            return {
                ...state,
                [action.key]: {
                    ...state[action.key],
                    enabled: action.enabled,
                }
            }

        case Constants.SourcePacks.Action.Merge:
            const copy = {...state}
            Object.keys(action.newSourcePacksMap).forEach((key) => {
                const value = {...action.newSourcePacksMap[key]}
                if (state[key]) {
                    value.enabled = state[key].enabled
                }

                copy[key] = value
            })

            return copy
    }

    return state
}

/**
 * Initial state for state.sourcePacksDownload
 */
const initialSourcePacksDownloadState = {
    status: Constants.SourcePacks.DownloadStatus.Idle,
}

/**
 * Reducer for state.sourcePacksDownload, tracking the download status of source packs from github.
 */
function downloadReducer(state = initialSourcePacksDownloadState, action) {
    switch (action.type) {
        case Constants.SourcePacks.Action.SetDownloadStatus:
            return {
                ...state,
                status: action.status,
            }
    }

    return state
}

export const SourcePacks = {
    Download: downloadReducer,
    Sources: sourcesReducer,
}
