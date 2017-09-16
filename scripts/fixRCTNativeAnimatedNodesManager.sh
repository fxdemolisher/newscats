#!/bin/bash

set -e

# Fixes bad import statement in RN's RCTAnimation file.
sed 's/#import <RCTAnimation\/RCTValueAnimatedNode.h>/#import "RCTValueAnimatedNode.h"/' < ./node_modules/react-native/Libraries/NativeAnimation/RCTNativeAnimatedNodesManager.h > tmp.h && mv tmp.h ./node_modules/react-native/Libraries/NativeAnimation/RCTNativeAnimatedNodesManager.h
