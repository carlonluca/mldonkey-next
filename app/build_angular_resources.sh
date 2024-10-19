#!/bin/bash

rm -rf webapp
mkdir webapp
cd ..
cd mldonkey-next-frontend
ng build --output-hashing=none
cd dist/mldonkey-next-frontend/browser
cp -r * ../../../../app/webapp
cd ../../../../app

BASE_DIR="webapp"
OUTPUT_FILE="resources.cmake"
cat <<EOL > "$OUTPUT_FILE"
qt_add_resources(mldonkey-next "webapp"
    PREFIX "/"
    BASE $BASE_DIR
    FILES
EOL
for file in "$BASE_DIR"/*; do
    echo "        $file" >> "$OUTPUT_FILE"
done
echo ")" >> "$OUTPUT_FILE"
echo "CMake resource file generated at $OUTPUT_FILE"
