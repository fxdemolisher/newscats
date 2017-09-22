import {NativeModules, Platform} from 'react-native'

/**
 * Wrapper around actual OAuth implementation for integrations newscats supports.
 */
class OAuthManager {
    constructor() {
        NativeModules.env.current((err, jsonString) => {
            this.environment = JSON.parse(jsonString)

            NativeModules.env.globalConfig((err, jsonString) => {
                this.config = JSON.parse(jsonString)
                this.onReady()
            })
        })
    }

    onReady() {
        // Reddit.
        NativeModules.auth.isConfigured('reddit')
            .then((result) => {
                if (!result) {
                    this.configureRedditProvider()
                }
            })
    }

    configureRedditProvider() {
        const bundleId = this.environment.bundleId
        const version = this.environment.version
        const author = this.config.redditClientUsername

        NativeModules.auth
            .configure(
                'reddit',
                'https://www.reddit.com/api/v1/authorize',
                'https://www.reddit.com/api/v1/access_token',
                Platform.OS + ':' + bundleId + ':' + version + ' (by /u/' + author + ')'
            )
            .catch((err) => {
                console.log("ERROR: ", err)
            })
    }

    isProviderConnected(provider) {
        return NativeModules.auth
            .isAuthorized(provider)
            .catch((err) => {
                console.log("ERROR: ", err)
            })
    }

    disconnect(provider) {
        return NativeModules.auth
            .deauthorize(provider)
            .catch((err) => {
                console.log("ERROR: ", err)
            })
    }

    connect(provider) {
        let clientId = null
        let scopes = []
        let additionalParameters = {}
        switch (provider) {
            case 'reddit':
                clientId = this.config.redditClientId
                scopes.push('vote')
                additionalParameters.duration = 'permanent'
                break

            default:
                throw 'Unknown provider for authentication: ' + provider
        }

        return NativeModules.auth
            .authorize(provider, clientId, scopes, additionalParameters)
            .catch((err) => {
                console.log("ERROR: ", err)
            })
    }

    getAccessToken(provider) {
        return NativeModules.auth.getAccessToken(provider)
            .catch((err) => {
                console.log("ERROR: ", err)
            })
    }
}

export {
    OAuthManager,
}
