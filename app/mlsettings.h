#ifndef MLSETTINGS_H
#define MLSETTINGS_H

#include <QObject>

#include <lqtutils_prop.h>
#include <lqtutils_settings.h>

Q_NAMESPACE

L_DECLARE_SETTINGS(MLSettings, new QSettings())
L_DEFINE_VALUE(QString, mldonkeyHost, QString())
L_DEFINE_VALUE(quint16, mldonkeyPort, 4001)
L_END_CLASS

#endif // MLSETTINGS_H
