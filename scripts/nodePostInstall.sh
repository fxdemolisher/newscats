#!/bin/bash

set -e

# NOTE: This script is meant to be run from the root of the project.

# Run all post install scripts after npm finishes (put this into package.json).
./scripts/fixRCTNativeAnimatedNodesManager.sh
./scripts/generateReactNativePhotoViewPodspec.sh

