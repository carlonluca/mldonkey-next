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
 * Date:    2024.10.29
 */

import QtQuick
import QtWebView

WebView {
    anchors.fill: parent
    url: qmlUtils.webappUrl()
    settings.allowFileAccess: true
    settings.javaScriptEnabled: true
    settings.localContentCanAccessFileUrls: true
    settings.localStorageEnabled: true
    onUrlChanged: {
        if (qmlUtils.isSetupRequested(url))
            userSettings.mldonkeyHost = ""
    }
}
