To Run the Applications

1. `npm install`
2. `chmod +x ./serve.sh` => Only in case of permissions problem
3. `./serve.sh sync`
4. Run Web App =>`./serve.sh web` 
5. Run Android App =>`./serve.sh android` => Then run button on Android Studio.
6. Run iOS App => `./serve.sh ios` => Then run button on xcode.
 If iOS didn't work/compile, then replace this :
```
post_install do |installer|
  assertDeploymentTarget(installer)
end
```
with this :
```
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      # Build for all architectures
      config.build_settings['ONLY_ACTIVE_ARCH'] = 'NO'
      # Exclude arm64 architecture for the iOS simulator
      config.build_settings['EXCLUDED_ARCHS[sdk=iphonesimulator*]'] = 'arm64'
    end
  end
end
```
and run `pod update` in the iOS App folder, the same place where the pod file exists), then run the iOS App by clicking the run button on Xcode.