import QtQuick
import QtWebEngine

Window {
    width: 640
    height: 480
    visible: true
    title: qsTr("Hello World")

    WebEngineView {
        anchors.fill: parent
        url: "http://bugfreeblog.duckdns.org"
    }
}
