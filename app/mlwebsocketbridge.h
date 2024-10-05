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

#ifndef MLWEBSOCKETBRIDGE_H
#define MLWEBSOCKETBRIDGE_H

#include <QObject>
#include <QWebSocketServer>
#include <QTcpSocket>

class QWebSocket;

class MLWebSocketBridge : public QObject
{
    Q_OBJECT
public:
    MLWebSocketBridge(QWebSocket* socket, QObject* parent = nullptr);
    virtual ~MLWebSocketBridge();

    QHostAddress peer();

signals:
    void socketDisconnected();

private:
    QWebSocket* m_socket;
    QTcpSocket* m_tcpSocket;
};

class MLWebSocketBridgeManager : public QObject
{
    Q_OBJECT
public:
    MLWebSocketBridgeManager(QObject* parent = nullptr);
    virtual ~MLWebSocketBridgeManager();

private:
    QSet<MLWebSocketBridge*> m_bridges;
    QWebSocketServer* m_server;
};

#endif // MLWEBSOCKETBRIDGE_H
