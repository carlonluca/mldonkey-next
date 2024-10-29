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
 * Date:    2024.10.04
 */

#include <QWebSocket>

#include <lqtutils/lqtutils_qsl.h>

#include "mlwebsocketbridge.h"
#include "mlsettings.h"

MLWebSocketBridge::MLWebSocketBridge(QWebSocket* socket, QObject* parent) :
    QObject(parent),
    m_socket(socket),
    m_tcpSocket(new QTcpSocket)
{
    connect(m_socket, &QWebSocket::disconnected,
            this, &MLWebSocketBridge::socketDisconnected);
    connect(m_socket, &QWebSocket::destroyed,
            this, &MLWebSocketBridge::socketDisconnected);
    connect(m_socket, &QWebSocket::errorOccurred, this, [this] {
        qWarning() << "Socket failed:" << m_socket->errorString();
        emit socketDisconnected();
    });
    connect(m_socket, &QWebSocket::binaryMessageReceived, this, [this] (const QByteArray& msg) {
        qDebug() << "Sending data to mlnet core";
        m_tcpSocket->write(msg);
    });

    const QHostAddress mldonkeyHost(MLSettings::notifier().mldonkeyHost());
    const int mldonkeyPort = MLSettings::notifier().mldonkeyPort();
    connect(m_tcpSocket, &QTcpSocket::connected, this, [this, mldonkeyHost, mldonkeyPort] {
        qInfo() << "Connected to" << QString("%1:%2").arg(mldonkeyHost.toString()).arg(mldonkeyPort);
    });
    connect(m_tcpSocket, &QTcpSocket::readyRead, this, [this] {
        qDebug() << "Sending data to client";
        m_socket->sendBinaryMessage(m_tcpSocket->readAll());
    });
    connect(m_tcpSocket, &QTcpSocket::disconnected, this, [this] {
        qDebug() << "Connection closed";
        emit socketDisconnected();
    });
    connect(m_tcpSocket, &QTcpSocket::errorOccurred, this, [this] {
        qWarning() << "TCP connection failed:" << m_tcpSocket->errorString();
        emit socketDisconnected();
    });
    m_tcpSocket->connectToHost(mldonkeyHost, mldonkeyPort);
}

MLWebSocketBridge::~MLWebSocketBridge()
{
    if (m_socket) {
        m_socket->close();
        m_socket->deleteLater();
    }

    if (m_tcpSocket) {
        m_tcpSocket->close();
        m_tcpSocket->deleteLater();
    }
}

QHostAddress MLWebSocketBridge::peer()
{
    if (m_socket)
        return m_socket->peerAddress();
    return QHostAddress();
}

MLWebSocketBridgeManager::MLWebSocketBridgeManager(QObject* parent) :
    QObject(parent),
    m_server(new QWebSocketServer(QSL("mldonkey websocket bridge"), QWebSocketServer::NonSecureMode, this))
{
    if (!m_server->listen(QHostAddress::LocalHost, 4002)) {
        qWarning() << "Cannot start websocket server";
        return;
    }

    connect(m_server, &QWebSocketServer::newConnection, this, [this] {
        const auto ws = m_server->nextPendingConnection();
        qInfo() << "Client connected:" << ws->peerAddress();
        auto bridge = new MLWebSocketBridge(ws);
        connect(bridge, &MLWebSocketBridge::socketDisconnected, this, [this, bridge] {
            qInfo() << "Client disconnected:" << bridge->peer();
            QMutableSetIterator<MLWebSocketBridge*> it(m_bridges);
            while (it.hasNext()) {
                const auto existingBridge = it.next();
                if (existingBridge == bridge) {
                    bridge->deleteLater();
                    it.remove();
                }
            }
        });

        m_bridges.insert(bridge);
    });

    connect(m_server, &QWebSocketServer::serverError, this, [this] {
        qWarning() << "Failed to setup websocket connection";
        // TODO: UI
    });

    connect(m_server, &QWebSocketServer::acceptError, this, [this] {
        qWarning() << "Client failed to connect";
        // TODO: UI
    });
}

MLWebSocketBridgeManager::~MLWebSocketBridgeManager()
{
    qDeleteAll(m_bridges);
    m_bridges.clear();
}
