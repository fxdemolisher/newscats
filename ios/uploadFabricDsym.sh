#!/bin/bash

echo "Starting Fabric dSym export/upload"

TEMP_API_KEY_FILE="${TEMP_DIR}/fabric.apikey"
if [ ! -f ${TEMP_API_KEY_FILE} ]; then
    echo "WARNING: No fabric api key file found, skipping dSym upload."
    exit 0
fi

TEMP_BUILD_SECRET_FILE="${TEMP_DIR}/fabric.buildsecret" 
if [ ! -f ${TEMP_BUILD_SECRET_FILE} ]; then
    echo "WARNING: No fabric build secret file found, skipping dSym upload."
    exit 0
fi

FABRIC_API_KEY=`cat "$TEMP_API_KEY_FILE"`
FABRIC_BUILD_SECRET=`cat "$TEMP_BUILD_SECRET_FILE"`

echo "Starting dSym upload with fabric API key: ${FABRIC_API_KEY}"
${PODS_ROOT}/Fabric/run ${FABRIC_API_KEY} ${FABRIC_BUILD_SECRET}

