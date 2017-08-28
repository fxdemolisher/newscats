/**
 * Error thrown if an unexpected number of arguments, or arguments of the wrong type, are provided
 * to a briding function.
 */
struct InvalidBridgeArgumentError : Error {
    let message: String
    let arguments: [Any]
}
