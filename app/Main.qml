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
import QtQuick.Controls.Material

Window {
    property bool configMode: configModeRequested || userSettings.mldonkeyHost.length <= 0
    property bool configModeRequested: false
    property int controlMargin: 10
    readonly property rect visibleArea: {
        Screen.orientation
        const visibleArea_ = qmlUtils.visibleDisplayFrame()
        if  (visibleArea_.width === 0)
            return Qt.rect(0, 0, width, height)
        return visibleArea_
    }

    id: mainWindow
    width: 720
    height: 1280
    visible: true
    title: "mldonkey-next " + Qt.application.version

    Material.theme: Material.Dark
    Material.accent: Material.Pink
    color: "#1d1d1d"

    SystemPalette { id: myPalette; colorGroup: SystemPalette.Active }

    Loader {
        active: !configMode
        anchors.fill: parent
        source: qmlUtils.extractWebApp() ? "qrc:/qt/qml/mldonkeynext/MLWebView.qml" : "qrc:/qt/qml/mldonkeynext/MLWebEngineView.qml"
        anchors.topMargin: {
            Screen.orientation
            return Math.max(qmlUtils.safeAreaTopInset(), visibleArea.y)
        }
        anchors.bottomMargin: {
            Screen.orientation
            return Math.max(qmlUtils.safeAreaBottomInset(),
                            parent.height - visibleArea.y - visibleArea.height)
        }
    }

    Loader {
        active: configMode
        sourceComponent: configComponent
        anchors.fill: parent
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
                    scale: 3
                    text: qsTr("mldonkey-next setup")
                    width: parent.width
                    horizontalAlignment: Text.AlignHCenter
                }
                Item {
                    width: parent.width
                    height: 20
                }
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
