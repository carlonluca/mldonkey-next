#!/bin/bash

SOURCE_ICON="icon.svg"
SOURCE_ICON_FULL="icon_full.svg"

# Android
inkscape $SOURCE_ICON_FULL --export-filename=app/android/res/drawable-ldpi/icon.png --export-width=36 --export-height=36 --export-type=png --export-dpi=300 --export-background-opacity=0
inkscape $SOURCE_ICON_FULL --export-filename=app/android/res/drawable-mdpi/icon.png --export-width=48 --export-height=48 --export-type=png --export-dpi=300 --export-background-opacity=0
inkscape $SOURCE_ICON_FULL --export-filename=app/android/res/drawable-hdpi/icon.png --export-width=72 --export-height=72 --export-type=png --export-dpi=300 --export-background-opacity=0
inkscape $SOURCE_ICON_FULL --export-filename=app/android/res/drawable-xhdpi/icon.png --export-width=96 --export-height=96 --export-type=png --export-dpi=300 --export-background-opacity=0
inkscape $SOURCE_ICON_FULL --export-filename=app/android/res/drawable-xxhdpi/icon.png --export-width=144 --export-height=144 --export-type=png --export-dpi=300 --export-background-opacity=0
inkscape $SOURCE_ICON_FULL --export-filename=app/android/res/drawable-xxxhdpi/icon.png --export-width=192 --export-height=192 --export-type=png --export-dpi=300 --export-background-opacity=0

# AppImage
inkscape $SOURCE_ICON --export-filename=app/appimage/ --export-width=256 --export-height=256 --export-type=png --export-dpi=300 --export-background-opacity=0

# Flatpak
inkscape $SOURCE_ICON --export-filename=app/flatpak/128/org.duckdns.bugfreeblog.mldonkeynext.png --export-width=128 --export-height=128 --export-type=png --export-dpi=300 --export-background-opacity=0
inkscape $SOURCE_ICON --export-filename=app/flatpak/256/org.duckdns.bugfreeblog.mldonkeynext.png --export-width=256 --export-height=256 --export-type=png --export-dpi=300 --export-background-opacity=0
inkscape $SOURCE_ICON --export-filename=app/flatpak/512/org.duckdns.bugfreeblog.mldonkeynext.png --export-width=512 --export-height=512 --export-type=png --export-dpi=300 --export-background-opacity=0
cp $SOURCE_ICON app/flatpak/org.duckdns.bugfreeblog.mldonkeynext.svg

# Webapp
inkscape $SOURCE_ICON --export-filename=mldonkey-next-frontend/src/assets/apple-touch-icon.png --export-width=180 --export-height=180 --export-type=png --export-dpi=300 --export-background-opacity=0
inkscape $SOURCE_ICON --export-filename=mldonkey-next-frontend/src/assets/favicon-16x16.png --export-width=16 --export-height=16 --export-type=png --export-dpi=300 --export-background-opacity=0
inkscape $SOURCE_ICON --export-filename=mldonkey-next-frontend/src/assets/favicon-32x32.png --export-width=32 --export-height=32 --export-type=png --export-dpi=300 --export-background-opacity=0
inkscape $SOURCE_ICON --export-filename=mldonkey-next-frontend/src/assets/favicon-48x48.png --export-width=48 --export-height=48 --export-type=png --export-dpi=300 --export-background-opacity=0
inkscape $SOURCE_ICON --export-filename=mldonkey-next-frontend/src/assets/favicon-256x256.png --export-width=256 --export-height=256 --export-type=png --export-dpi=300 --export-background-opacity=0
cp $SOURCE_ICON mldonkey-next-frontend/src/assets/icon.svg
magick mldonkey-next-frontend/src/assets/favicon-16x16.png mldonkey-next-frontend/src/assets/favicon-32x32.png mldonkey-next-frontend/src/assets/favicon-48x48.png mldonkey-next-frontend/src/assets/favicon-256x256.png mldonkey-next-frontend/src/assets/favicon.ico
