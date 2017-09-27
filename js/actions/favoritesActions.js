import {Constants} from '/constants'
import {Integrations} from '/integrations'

/**
 * Returns an action (thunk) that adds the given item to the favorites set.
 */
function add(item, oauth) {
    return (dispatch) => {
        dispatch({
            type: Constants.Favorites.Action.Add,
            item: item,
        })

        onItemFavorite(item, oauth)
    }
}

/**
 * Called when an item is being favorited, lets any necessary integrations know via API calls (e.g. reddit upvote).
 */
function onItemFavorite(item, oauth) {
    if (item.key.startsWith('reddit_')) {
        Integrations.Reddit.vote(item.key.replace('reddit_', 't3_'), oauth, 1 /* UP */)
        return
    }
}

/**
 * Returns an action (thunk) that removes a favorite from the favorites set.
 */
function remove(item, oauth) {
    return (dispatch) => {
        dispatch({
            type: Constants.Favorites.Action.Remove,
            key: item.key,
        })

        onItemUnfavorite(item, oauth)
    }
}

/**
 * Called when an item is being unfavorited, lets any necessary integrations know via API calls (e.g. reddit downvote).
 */
function onItemUnfavorite(item, oauth) {
    if (item.key.startsWith('reddit_')) {
        Integrations.Reddit.vote(item.key.replace('reddit_', 't3_'), oauth, 0 /* TOGGLE */)
        return
    }
}

export const Favorites = {
    add,
    remove,
}
