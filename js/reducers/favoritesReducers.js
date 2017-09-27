import moment from 'moment'
import {REHYDRATE} from 'redux-persist/constants'

import {Constants} from '/constants'

/**
 * Reducer for state.favorites, allow manipulation (add, remove). Contains special logic for restoring
 * timestamps into moment instances during rehydration of the store.
 */
function reducer(state = {}, action) {
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

        case Constants.Favorites.Action.Add:
            return {
                ...state,
                [action.item.key]: action.item,
            }

        case Constants.Favorites.Action.Remove:
            const copy = {...state}
            delete copy[action.key]
            return copy
    }

    return state
}

export const Favorites = reducer
