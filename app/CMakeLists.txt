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

set(CMAKE_POLICY_DEFAULT_CMP0077 NEW)
project(mldonkey-next-proj VERSION 0.14.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/../deps/lqtutils ${CMAKE_CURRENT_BINARY_DIR}/lqtutils)

if(${CMAKE_SYSTEM_NAME} STREQUAL "Darwin" OR ${CMAKE_SYSTEM_NAME} STREQUAL "Linux" OR WIN32)
    set(ML_EXTRACT_WEBAPP false)
else()
    add_compile_definitions(ML_EXTRACT_WEBAPP)
    set(ML_EXTRACT_WEBAPP true)
endif()

find_package(Qt6 OPTIONAL_COMPONENTS DBus)
find_package(Qt6
    REQUIRED COMPONENTS
        Core
        Quick
        StateMachine
        WebView
        WebSockets
)
if (NOT ML_EXTRACT_WEBAPP)
    find_package(Qt6 REQUIRED COMPONENTS WebEngineQuick)
else()
    find_package(Qt6 REQUIRED COMPONENTS WebView)
endif()

configure_file(
    "${CMAKE_CURRENT_SOURCE_DIR}/version.h.in"
    "${CMAKE_CURRENT_BINARY_DIR}/version.h"
)

qt_standard_project_setup(REQUIRES 6.8)

qt_add_executable(mldonkey-next
    main.cpp
)

qt_add_qml_module(mldonkey-next
    URI mldonkeynext
    VERSION 1.0
    QML_FILES
        Main.qml
        MLWebEngineView.qml
        MLWebView.qml
    SOURCES
        mlwebsocketbridge.h mlwebsocketbridge.cpp
        mlsettings.h mlsettings.cpp
        mlqmlutils.h mlqmlutils.cpp
    RESOURCES
        android/AndroidManifest.xml
        android/build.gradle
        android/res/values/libs.xml
        android/res/xml/qtprovider_paths.xml
        android/gradle/wrapper/gradle-wrapper.jar
        android/gradle/wrapper/gradle-wrapper.properties
        android/gradle.properties
        android/gradlew
        android/gradlew.bat
        RESOURCES android/res/values/styles.xml
        RESOURCES android/res/values/colors.xml
)

# Build this file using the build_angular_resources.sh script.
if (NOT ML_EXTRACT_WEBAPP)
    include(resources_root.cmake)
else()
    include(resources_subdir.cmake)
endif()

# Qt for iOS sets MACOSX_BUNDLE_GUI_IDENTIFIER automatically since Qt 6.1.
# If you are developing for iOS or macOS you should consider setting an
# explicit, fixed bundle identifier manually though.
set_target_properties(mldonkey-next PROPERTIES
#    MACOSX_BUNDLE_GUI_IDENTIFIER com.example.appmldonkey-next
    MACOSX_BUNDLE_BUNDLE_VERSION ${PROJECT_VERSION}
    MACOSX_BUNDLE_SHORT_VERSION_STRING ${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}
    MACOSX_BUNDLE TRUE
    WIN32_EXECUTABLE TRUE

    QT_ANDROID_PACKAGE_SOURCE_DIR "${CMAKE_CURRENT_LIST_DIR}/android"
    QT_ANDROID_PACKAGE_NAME "luke.mldonkeynext"
    QT_ANDROID_VERSION_CODE 001400
    QT_ANDROID_VERSION_NAME "0.14.0"
)

target_include_directories(mldonkey-next PRIVATE
    ../deps
    "${CMAKE_CURRENT_BINARY_DIR}"
)
target_link_libraries(mldonkey-next PRIVATE
    Qt6::Core
    Qt6::Quick
    Qt6::StateMachine
    Qt6::CorePrivate
    Qt6::WebSockets
    lqtutils
)
if (Qt6DBus_FOUND)
    target_link_libraries(mldonkey-next PRIVATE Qt6::DBus)
endif()
if(NOT ML_EXTRACT_WEBAPP)
    target_link_libraries(mldonkey-next PRIVATE Qt6::WebEngineQuick)
else()
    target_link_libraries(mldonkey-next PRIVATE Qt6::WebView)
endif()

include(GNUInstallDirs)
install(TARGETS mldonkey-next
    BUNDLE DESTINATION .
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)
