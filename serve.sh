#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 {web|android|ios|sync|update}"
  exit 1
fi

case $1 in
  "web")
    echo "Serving for web..."
    open -a "Google Chrome" "http://utest1.work:8100/home"
    ionic serve --address utest1.work --no-open
    ;;
  "android")
    echo "Opening Android project..."
    ionic cap open android
    ;;
  "ios")
    echo "Opening iOS project..."
    ionic cap open ios
    ;;
  "sync")
    echo "Sync  project..."
    ionic cap sync
    ;;
  "update")
    echo "Update plugin..."
    npm install utiq-sdk@latest
    ;;
  *)
    echo "Invalid option. Usage: $0 {web|android|ios|sync}"
    exit 1
    ;;
esac




