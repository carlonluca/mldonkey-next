import QtQuick
import QtWebView

WebView {
    anchors.fill: parent
    url: qmlUtils.webappUrl()
    settings.allowFileAccess: true
    settings.javaScriptEnabled: true
    settings.localContentCanAccessFileUrls: true
    settings.localStorageEnabled: true
}
