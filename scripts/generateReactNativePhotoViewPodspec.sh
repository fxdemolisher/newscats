#!/bin/bash

set -e

# Generats the missing podspec for the react-native-photo-view package.
cat << EOF > "./node_modules/react-native-photo-view/react-native-photo-view.podspec"

require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-photo-view"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.author       = package["author"]["name"]

  s.homepage     = package["homepage"]

  s.license      = package["license"]

  s.ios.deployment_target = "7.0"
  s.tvos.deployment_target = "9.0"

  s.source       = { :git => package["repository"]["url"], :tag => "#{s.version}" }

  s.source_files  = "ios/*.{h,m}"

  s.dependency "React"
end

EOF
