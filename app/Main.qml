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
import QtQuick.Controls
import QtWebEngine

Window {
    property bool configMode: configModeRequested || userSettings.mldonkeyHost.length <= 0
    property bool configModeRequested: false
    property int controlMargin: 10

    width: 720
    height: 1280
    visible: true
    title: "mldonkey-next " + Qt.application.version

    SystemPalette { id: myPalette; colorGroup: SystemPalette.Active }

    Loader {
        active: !configMode
        sourceComponent: webViewComponent
        anchors.fill: parent
    }

    Loader {
        active: configMode
        sourceComponent: configComponent
        anchors.fill: parent
    }

    Component {
        id: webViewComponent
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

    Component {
        id: configComponent
        Rectangle {
            color: myPalette.window
            anchors.fill: parent
            Column {
                anchors.centerIn: parent
                width: 720/3
                spacing: controlMargin
                Label {
                    font.bold: true
                    width: parent.width
                    color: myPalette.text
                    text: qsTr("mldonkey address")
                }
                TextField {
                    id: host
                    width: parent.width
                    placeholderText: qsTr("e.g. 192.168.0.2 or mldonkey.lan")
                }
                Label {
                    font.bold: true
                    width: parent.width
                    color: myPalette.text
                    text: qsTr("mldonkey port")
                }
                SpinBox {
                    id: port
                    width: parent.width
                    from: 0
                    to: 65535
                    value: 4001
                    editable: true
                }
                Button {
                    width: parent.width
                    text: qsTr("Save")
                    onClicked: {
                        userSettings.mldonkeyHost = host.text.trim()
                        userSettings.mldonkeyPort = port.value
                        configModeRequested = false
                    }
                }
            }
        }
    }
}
