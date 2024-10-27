import QtQuick
import QtWebEngine

WebEngineView {
    anchors.fill: parent
    url: qmlUtils.webappUrl()
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
    onLoadingChanged: function(info) {
        console.log("Error:", info.errorString)
    }
    onPermissionRequested: function(permission) {
        console.log("Permission:", permission.permissionType)
        permission.grant()
    }
}
