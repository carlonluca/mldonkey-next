#!/bin/bash

# This file is part of mldonkey-next.
#
# Copyright (c) 2025 Luca Carlon
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, version 3.
#
# This program is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#

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