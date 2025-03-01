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
