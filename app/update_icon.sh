#!/bin/bash

set -e

wget "https://github.com/sterlp/svg2png/releases/download/v1.2.1/svg2png-1.2.1.jar"
java -jar svg2png-1.2.1.jar -f ../icon_full.svg -o android/res -c svg2png_android.json
#cp android/res/drawable-xxxhdpi/icon_24dp.png assets/icon_96.png
#cp ../icon.svg assets/

#java -jar svg2png-1.2.1.jar -f icon_notification.svg -o android/res -c svg2png_android.json

rm svg2png-1.2.1.jar
