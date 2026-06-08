require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'expo-usb-midi'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = 'GP Patch Lab'
  s.homepage       = 'https://github.com/example/expo-usb-midi'
  s.platform       = :ios, '13.4'
  s.swift_version  = '5.4'
  s.source         = { :git => 'https://github.com/example/expo-usb-midi.git', :tag => "v#{s.version}" }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.source_files = 'ios/**/*.{h,m,swift}'
  s.frameworks = 'CoreMIDI'
end
