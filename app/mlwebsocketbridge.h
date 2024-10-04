#ifndef MLWEBSOCKETBRIDGE_H
#define MLWEBSOCKETBRIDGE_H

#include <QObject>
#include <QWebSocketServer>

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
