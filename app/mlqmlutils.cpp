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
 * Date:    2024.10.24
 */

#include <QStandardPaths>

#include <lqtutils_qsl.h>
#include <lqtutils_string.h>

#include "mlqmlutils.h"

MLQmlUtils::MLQmlUtils(QObject *parent)
    : lqt::QmlUtils{parent}
{}

QUrl MLQmlUtils::webappUrl()
{
#ifdef ML_EXTRACT_WEBAPP
    const QString privDataPath = QStandardPaths::writableLocation(QStandardPaths::AppDataLocation);
    const QString webappPath = lqt::path_combine({
        privDataPath,
        QSL("webapp")
    });

    return QUrl::fromLocalFile(lqt::path_combine({
        webappPath,
        QSL("index.html")
    }));
#else
    return QUrl(QSL("qrc:/index.html"));
#endif
}

bool MLQmlUtils::extractWebApp()
{
#ifdef ML_EXTRACT_WEBAPP
    return true;
#else
    return false;
#endif
}

bool MLQmlUtils::isSetupRequested(const QUrl& url)
{
    return url.toString().contains(QSL("action=openSetup"));
}
