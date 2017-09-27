import {Favorites} from './favoritesReducers'
import {Feed} from './feedReducers'
import {SourcePacks} from './sourcePacksReducers'

// Generalized No-op reducer that allows us to create an empty state for a state key.
const Noop = (state = {}) => (state)

export const Reducers = {
    Favorites,
    Feed,
    Noop,
    SourcePacks,
}
