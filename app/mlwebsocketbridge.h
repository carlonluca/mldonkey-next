#ifndef MLWEBSOCKETBRIDGE_H
#define MLWEBSOCKETBRIDGE_H

#include <QObject>
#include <QWebSocketServer>

class MLWebSocketBridge : public QObject
{
public:
    MLWebSocketBridge(QObject* parent = nullptr);

private:
    QWebSocketServer* m_server;
};

#endif // MLWEBSOCKETBRIDGE_H
