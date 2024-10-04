# This file is part of mldonkey-next.
#
# Copyright (c) 2024 Luca Carlon
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

# Author:  Luca Carlon
# Company: -
# Date:    2024.10.02

cmake_minimum_required(VERSION 3.16)

project(mldonkey-next-proj VERSION 0.1 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/../deps/lqtutils ${CMAKE_CURRENT_BINARY_DIR}/lqtutils)

find_package(Qt6 6.5
    REQUIRED COMPONENTS
        Quick
        WebEngineQuick
        WebSockets
)

qt_standard_project_setup(REQUIRES 6.5)

qt_add_executable(mldonkey-next
    main.cpp
)

qt_add_qml_module(mldonkey-next
    URI mldonkeynext
    VERSION 1.0
    QML_FILES
        Main.qml
    SOURCES
        mlwebsocketbridge.h mlwebsocketbridge.cpp
)

qt_add_resources(mldonkey-next "webapp"
    PREFIX "/"
    BASE ../mldonkey-next-frontend/dist/mldonkey-next-frontend/browser
    FILES
        ../mldonkey-next-frontend/dist/mldonkey-next-frontend/browser/chunk-COSFYJWR.js
        ../mldonkey-next-frontend/dist/mldonkey-next-frontend/browser/chunk-6Z6LXSWS.js
        ../mldonkey-next-frontend/dist/mldonkey-next-frontend/browser/favicon.ico
        ../mldonkey-next-frontend/dist/mldonkey-next-frontend/browser/index.html
        ../mldonkey-next-frontend/dist/mldonkey-next-frontend/browser/main.js
        ../mldonkey-next-frontend/dist/mldonkey-next-frontend/browser/polyfills.js
        ../mldonkey-next-frontend/dist/mldonkey-next-frontend/browser/styles.css
        ../mldonkey-next-frontend/dist/mldonkey-next-frontend/browser/assets/turtle.svg
)

# Qt for iOS sets MACOSX_BUNDLE_GUI_IDENTIFIER automatically since Qt 6.1.
# If you are developing for iOS or macOS you should consider setting an
# explicit, fixed bundle identifier manually though.
set_target_properties(mldonkey-next PROPERTIES
#    MACOSX_BUNDLE_GUI_IDENTIFIER com.example.appmldonkey-next
    MACOSX_BUNDLE_BUNDLE_VERSION ${PROJECT_VERSION}
    MACOSX_BUNDLE_SHORT_VERSION_STRING ${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}
    MACOSX_BUNDLE TRUE
    WIN32_EXECUTABLE TRUE
)

target_include_directories(mldonkey-next PRIVATE ../deps)
target_link_directories(mldonkey-next PRIVATE
    lqtutils_build
)
target_link_libraries(mldonkey-next
    PRIVATE
        Qt6::Quick
        Qt6::WebEngineQuick
        Qt6::WebSockets
        lqtutils
)

include(GNUInstallDirs)
install(TARGETS mldonkey-next
    BUNDLE DESTINATION .
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)
