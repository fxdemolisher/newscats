
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
function parseVersionOneSourcePacks(sourcePacks) {
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

/**
 * Coverts the source pack definition (see assets/sourcePacks.json) to pack definitions consumable by
 * reducers.sourceReducer and the rest of the app (mainly the feed). Works with either locally loaded json
 * data or the contents of a JSON file downloaded from the internet.
 */
export function parseSourcePacks(sourcePacks) {
    switch (sourcePacks.formatVersion) {
        case 1:
            return parseVersionOneSourcePacks(sourcePacks.packs)

        default:
            throw 'Unknown source pack format: ' + sourcePacks.formatVersion
    }
}
