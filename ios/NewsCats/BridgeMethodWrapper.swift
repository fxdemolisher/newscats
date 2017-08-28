import React

/**
 * Defines various kind of wrapped performers we support with our BridgeMethodWrapper.
 */
enum BridgeMethodWrappedPerformer {
    // A call from JS to native, without a return value or callback.
    case oneWay((RCTBridge,  [Any]) throws -> Void)

    // A call from JS to native, providing a callback function to call on completion.
    // NOTE(gennadiy): The completion callback is expected to accept two parameters: error and result, in node.js style.
    case callback((RCTBridge, [Any], @escaping (Any?, Any?) -> Void) throws -> Void)
}

/**
 * A simple wrapper around swift functions and closures that can be exposed over an RN bridge.
 */
class BridgeMethodWrapper : NSObject, RCTBridgeMethod {
    private let name: String
    private let performer: BridgeMethodWrappedPerformer
    
    init(name: String, _ performer: BridgeMethodWrappedPerformer) {
        self.name = name
        self.performer = performer
    }
    
    public var jsMethodName: String! { return name }
    public var functionType: RCTFunctionType { return .normal }
    
    /**
     * Called by the RN bridge to invoke the native function wrapped by this instance.
     */
    public func invoke(with bridge: RCTBridge!, module: Any!, arguments: [Any]!) -> Any! {
        switch performer {
            // One way calls are simple passthroughs, with void returns.
            case let .oneWay(closure):
                try! closure(bridge, arguments)
                return Void()
            
            // Callback wrappers pass all except the last parameter to the native code, and wrap the last parameter
            // in a swift completion closure. The native code being executed should use that closure to communicate
            // results back to JS. By convention the resulting call should contains two arguments: error and result.
            case let .callback(closure):
                let closureArgs = Array<Any>(arguments.prefix(upTo: arguments.count - 1))
                
                let callbackClosure = { (error: Any?, result: Any?) -> Void in
                    let callbackId = arguments.last as! NSNumber
                    let errorActual = error ?? NSNull()
                    let resultActual = result ?? NSNull()
                    
                    bridge.enqueueCallback(callbackId, args: [errorActual, resultActual])
                }
            
                try! closure(bridge, closureArgs, callbackClosure)
                return Void()
        }
    }
}
