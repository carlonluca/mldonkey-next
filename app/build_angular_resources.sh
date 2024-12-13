#!/bin/bash

rm -rf webapp
mkdir webapp
cd ..
cd mldonkey-next-frontend
npm i
npm run build
cd dist/mldonkey-next-frontend/browser
cp -r * ../../../../app/webapp
cd ../../../../app

BASE_DIR="webapp"
HASH_CMD="sha256sum"
HASH=$(find "$BASE_DIR" -type f -exec $HASH_CMD {} + | awk '{print $1}' | tr -d '\n' | $HASH_CMD | awk '{print $1}')

echo "$HASH" > webapp/index.txt

OUTPUT_FILE="resources_root.cmake"
cat <<EOL > "$OUTPUT_FILE"
qt_add_resources(mldonkey-next "webapp"
    PREFIX "/"
    BASE $BASE_DIR
    FILES
EOL
find "$BASE_DIR" -type f | while read -r file; do
    echo "        $file" >> "$OUTPUT_FILE"
done
echo ")" >> "$OUTPUT_FILE"

echo "CMake resource file generated at $OUTPUT_FILE"

OUTPUT_FILE="resources_subdir.cmake"
cat <<EOL > "$OUTPUT_FILE"
qt_add_resources(mldonkey-next "webapp"
    PREFIX "/"
    FILES
EOL
find "$BASE_DIR" -type f | while read -r file; do
    echo "        $file" >> "$OUTPUT_FILE"
done
echo ")" >> "$OUTPUT_FILE"

echo "CMake resource file generated at $OUTPUT_FILE"
