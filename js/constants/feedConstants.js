/**
 * Feed action types.
 */
const Action = {
    Set: 'Feed.Set',
    MarkItemsSeen: 'Feed.MarkItemsSeen',
    SetPreview: 'Feed.SetPreview',
}

/**
 * Statuses that the feed can be in (state.feed.status).
 */
const Status = {
    NotInitialized: 'NotInitialized',
    Refreshing: 'Refreshing',
    Ready: 'Ready',
}

/**
 * The set of available feed parsers, effectively defining what kind of sources can be added to the app.
 */
const Parser = {
    Reddit: 'Reddit',
    Instagram: 'Instagram',
}

/**
 * Types of preview/detail media inside an item.
 */
const MediaType = {
    Image: 'Image',
    VideoMp4: 'VideoMp4',
}

export const Feed = {
    Action,
    MediaType,
    Parser,
    Status,
}
