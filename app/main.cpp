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

#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QTimer>
#include <QStandardPaths>
#ifdef ML_EXTRACT_WEBAPP
#include <QtWebView/QtWebView>
#else
#include <QtWebEngineQuick/qtwebenginequickglobal.h>
#endif

#include <lqtutils_qsl.h>
#include <lqtutils_string.h>
#include <lqtutils_data.h>
#ifdef Q_OS_ANDROID
#include <lqtutils_ui.h>
#endif

#include "mlwebsocketbridge.h"
#include "mlsettings.h"
#include "mlqmlutils.h"
#include "version.h"

#define COLORING_ENABLED
#define LOG_TAG "mldonkey-next"
#include <lightlogger/lc_logging.h>
lightlogger::custom_log_func lightlogger::global_log_func = log_to_default;

inline bool extract_files()
{
    const QString privDataPath = QStandardPaths::writableLocation(QStandardPaths::AppDataLocation);
    const QString webappPath = lqt::path_combine({
        privDataPath,
        QSL("webapp")
    });

    QDir webappDir(webappPath);
    if (!webappDir.removeRecursively())
        qWarning() << "Failed to remove previous webapp version";

    if (!QDir(privDataPath).mkpath(".")) {
        qWarning() << "Failed to create webapp directory";
        return false;
    }

    qInfo() << "Extract webapp to" << webappPath;
    return lqt::copy_path(QSL(":/webapp"), webappPath);
}

inline bool deploy_webapp()
{
    const QString privDataPath = QStandardPaths::writableLocation(QStandardPaths::AppDataLocation);
    const QString webappPath = lqt::path_combine({
        privDataPath,
        QSL("webapp")
    });

    if (!QDir(webappPath).exists()) {
        qInfo() << "Webapp data missing, extact...";
        return extract_files();
    }

    const QString indexPath = lqt::path_combine({
        webappPath,
        QSL("index.txt")
    });

    if (!QFile(indexPath).exists()) {
        qInfo() << "Index missing, extract...";
        return extract_files();
    };

    QFile expectedIndexFile(QSL(":/webapp/index.txt"));
    QFile currentIndexFile(indexPath);
    const QByteArray expectedHash = lqt::read_all(&expectedIndexFile);
    const QByteArray currentHash = lqt::read_all(&currentIndexFile);
    if (expectedHash == currentHash) {
        qDebug() << "Webapp already extracted";
        return true;
    }

    return extract_files();
}

void setup_env()
{
    if (!qEnvironmentVariableIsSet("APPDIR"))
        return;

    qInfo() << "Running AppImage format...";
    const QByteArray appDirData = qgetenv("APPDIR");
    const QString webengineResources = lqt::path_combine({
        appDirData,
        "/opt/qt/6.8.0/gcc_64/resources"
    });
    const QByteArray webengineResourcesData = webengineResources.toUtf8();
    const QString webengineProcPath = lqt::path_combine({
        appDirData,
        "/opt/qt/6.8.0/gcc_64/libexec/QtWebEngineProcess"
    });
    const QByteArray webengineProcData = webengineProcPath.toUtf8();
    const QString webengineLocalesPath = lqt::path_combine({
        appDirData,
        "/opt/qt/6.8.0/gcc_64/translations/qtwebengine_locales"
    });
    const QByteArray webengineLocalesData = webengineLocalesPath.toUtf8();

    qputenv("QTWEBENGINE_RESOURCES_PATH", webengineResourcesData);
    qputenv("QTWEBENGINEPROCESS_PATH", webengineProcData);
    qputenv("QTWEBENGINE_LOCALES_PATH", webengineLocalesData);
    qputenv("QT_QPA_PLATFORM", "xcb");
}

int main(int argc, char** argv)
{
    QCoreApplication::setAttribute(Qt::AA_ShareOpenGLContexts);
    qInstallMessageHandler(lightlogger::log_handler);

#ifdef Q_OS_LINUX
    setup_env();
#endif

#ifndef ML_EXTRACT_WEBAPP
    QtWebEngineQuick::initialize();
#else
    QtWebView::initialize();
#endif

    QGuiApplication app(argc, argv);
    app.setApplicationName(QSL("mldonkey-next"));
    app.setApplicationVersion(PROJECT_VERSION);

#ifdef Q_OS_ANDROID
    lqt::QmlUtils qmlUtils;
    qmlUtils.setBarColorLight(false, false);
    qmlUtils.setNavBarColor(QColor(32, 32, 32));
    qmlUtils.setStatusBarColor(QColor(32, 32, 32));
#endif

#ifdef ML_EXTRACT_WEBAPP
    deploy_webapp();
#endif

    MLWebSocketBridgeManager bridge;

    QQmlApplicationEngine engine;
    engine.rootContext()->setContextProperty("userSettings", &MLSettings::notifier());
    engine.rootContext()->setContextProperty("qmlUtils", new MLQmlUtils(qApp));
    QObject::connect(
        &engine,
        &QQmlApplicationEngine::objectCreationFailed,
        &app,
        []() { QCoreApplication::exit(-1); },
        Qt::QueuedConnection);
    engine.loadFromModule("mldonkeynext", "Main");

    return app.exec();
}
