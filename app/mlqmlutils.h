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

#ifndef MLQMLUTILS_H
#define MLQMLUTILS_H

#include <QObject>
#include <QUrl>

class MLQmlUtils : public QObject
{
    Q_OBJECT
public:
    explicit MLQmlUtils(QObject *parent = nullptr);
    Q_INVOKABLE QUrl webappUrl();
    Q_INVOKABLE bool extractWebApp();
    Q_INVOKABLE bool isSetupRequested(const QUrl& url);
};

#endif // MLQMLUTILS_H
