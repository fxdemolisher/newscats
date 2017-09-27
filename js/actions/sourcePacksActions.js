import {Actions} from '/actions'
import {Constants} from '/constants'

import {Feed} from './feedActions'

/**
 * Returns an action (thunk) that sets the enabled status of a source with the given key and clears the feed.
 */
function toggle(key, enabled) {
    return (dispatch) => {
        dispatch({
            type: Constants.SourcePacks.Action.Toggle,
            key: key,
            enabled: enabled,
        })

        dispatch(Feed.refresh())
    }
}

/**
 * Triggers the download of the latest source packs from github, and merges them with the current sources
 * when ready. If an error occurs during download, nothing is done.
 */
function downloadLatest() {
    return (dispatch) => {
        dispatch({
            type: Constants.SourcePacks.Action.SetDownloadStatus,
            status: Constants.SourcePacks.DownloadStatus.Downloading,
        })

        const downloadUrl = 'https://raw.githubusercontent.com/fxdemolisher/newscats/master/js/assets/sourcePacks.json'
        const downloadedPacks = fetch(downloadUrl)
            .then((response) => (response.json()))
            .then((json) => {
                const downloadedPacks = parse(json)

                const newSourcePacksMap = {}
                downloadedPacks.forEach((pack) => {
                    newSourcePacksMap[pack.key] = pack
                })

                dispatch({
                    type: Constants.SourcePacks.Action.Merge,
                    newSourcePacksMap: newSourcePacksMap,
                })

                dispatch(Actions.Feed.refresh())

                dispatch({
                    type: Constants.SourcePacks.Action.SetDownloadStatus,
                    status: Constants.SourcePacks.DownloadStatus.Idle,
                })
            })
            .catch((err) => {
                dispatch({
                    type: Constants.SourcePacks.Action.SetDownloadStatus,
                    status: Constants.SourcePacks.DownloadStatus.Error,
                })

                console.log("ERROR: ", err)
            })
    }
}

/**
 * Coverts the source pack definition (see assets/sourcePacks.json) to pack definitions consumable by
 * reducers.sourceReducer and the rest of the app (mainly the feed). Works with either locally loaded json
 * data or the contents of a JSON file downloaded from the internet.
 */
function parse(sourcePacks) {
    switch (sourcePacks.formatVersion) {
        case 1:
            return parseVersionOne(sourcePacks.packs)

        default:
            throw 'Unknown source pack format: ' + sourcePacks.formatVersion
    }
}

/**
 * Converts source pack definition information into a list of source packs consumable by the rest of the app.
 *
 * The input format is:
 *   [
 *     {
 *       enabledByDefault: boolean
 *       key: string, uuid
 *       parser: one of sourceParsers.Parser
 *       title: string
 *       sources: [
 *         {
 *           title: string
 *           url: string
 *         }
 *       ]
 *     }
 *   ]
 *
 * The output format is:
 *   [
 *     {
 *       key: string, uuid
 *       enabled: boolean
 *       title: string,
 *       sources: [
 *         {
 *           parser: one of sourceParsers.Parser
 *           title: string
 *           url: string
 *         }
 *       ]
 *     }
 *   ]
 */
function parseVersionOne(sourcePacks) {
    return sourcePacks.map((pack) => (
        {
            enabled: pack.enabledByDefault,
            key: pack.key,
            title: pack.title,
            sources: pack.sources.map((source) => (
                {
                    parser: pack.parser,
                    title: source.title,
                    url: source.url,
                }
            ))
        }
    ))
}

export const SourcePacks = {
    downloadLatest,
    parse,
    toggle,
}
