/**
 * Source pack action types.
 */
const Action = {
    Merge: 'SourcePacks.Merge',
    SetDownloadStatus: 'SourcePacks.SetDownloadStatus',
    Toggle: 'SourcePacks.Toggle',
}

/**
 * Statuses that pack download can take (state.sourcePacksDownload.status).
 */
const DownloadStatus = {
    Idle: 'Idle',
    Downloading: 'Downloading',
    Error: 'Error',
}

export const SourcePacks = {
    Action,
    DownloadStatus,
}
