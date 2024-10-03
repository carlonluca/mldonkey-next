/*
 * This file is part of mldonkey-next.
 *
 * Copyright (c) 2024 Luca Carlon
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Author:  Luca Carlon
 * Company: -
 * Date:    2024.10.02
 */

import QtQuick
import QtWebEngine

Window {
    width: 640
    height: 480
    visible: true
    title: qsTr("Hello World")

    WebEngineView {
        anchors.fill: parent
        url: "qrc:/index.html"
        onJavaScriptConsoleMessage: function(level, message, lineNumber, sourceId) {
            switch (level) {
            case WebEngineView.InfoMessageLevel:
                console.info(sourceId, lineNumber, message)
                return
            case WebEngineView.WarningMessageLevel:
                console.warn(sourceId, lineNumber, message)
                return
            case WebEngineView.ErrorMessageLevel:
                console.error(sourceId, lineNumber, message)
                return
            }
        }
    }
}
