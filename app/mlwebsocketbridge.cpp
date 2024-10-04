#include <QWebSocket>

#include <lqtutils/lqtutils_qsl.h>

#include "mlwebsocketbridge.h"

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

    // TODO: Addr and port to UI
    connect(m_tcpSocket, &QTcpSocket::connected, this, [this] {
        qInfo() << "Connected to 192.168.0.2:4001";
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
    m_tcpSocket->connectToHost(QHostAddress("192.168.0.2"), 4001);
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
