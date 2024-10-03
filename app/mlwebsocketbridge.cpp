#include <lqtutils/lqtutils_qsl.h>

#include "mlwebsocketbridge.h"

MLWebSocketBridge::MLWebSocketBridge(QObject* parent) :
    QObject(parent),
    m_server(new QWebSocketServer(QSL("mldonkey websocket bridge"), QWebSocketServer::NonSecureMode, this))
{

}
