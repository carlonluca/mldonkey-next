/*
 * This file is part of mldonket-next.
 *
 * Copyright (c) 2023 Luca Carlon
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
 * Date: 2023.08.14
 */

import { MLUtils } from '../core/MLUtils'

/**
 * Supported messages.
 */
export enum MLMessageTypeFrom {
    T_NONE                   = -1,
    T_CORE_PROTOCOL          = 0,
    T_OPTIONS_INFO           = 1,
    T_DEFINE_SEARCHES        = 3,
    T_RESULT_INFO            = 4,
    T_SEARCH_RESULT          = 5,
    T_SEARCH_WAITING         = 6,
    T_FILE_INFO_V1           = 7,
    T_FILE_DOWNLOADED_V1     = 8,
    T_FILE_UPDATE_AVAILABILITY = 9,
    T_FILE_ADD_SOURCE        = 10,
    T_SERVER_BUSY            = 11,
    T_SERVER_USER            = 12,
    T_SERVER_STATE           = 13,
    T_SERVER_INFO_V1         = 14,
    T_CLIENT_INFO            = 15,
    T_CLIENT_STATE           = 16,
    T_CLIENT_FRIEND          = 17,
    T_CLIENT_FILE            = 18,
    T_CONSOLE                = 19,
    T_NETWORK_INFO           = 20,
    T_USER_INFO              = 21,
    T_ROOM_INFO              = 22,
    T_ROOM_MESSAGE           = 23,
    T_ROOM_ADD_USER          = 24,
    T_CLIENT_STATS_V1        = 25,
    T_SERVER_INFO            = 26,
    T_MESSAGE_FROM_CLIENT    = 27,
    T_CONNECTED_SERVERS      = 28,
    T_DOWNLOAD_FILES_V1      = 29,
    T_DOWNLOAD_FILES_V2      = 30,
    T_ROOM_INFO_V2           = 31,
    T_ROOM_REMOVE_USER       = 32,
    T_SHARED_FILE_INFO_V1    = 33,
    T_SHARED_FILE_UPLOAD     = 34,
    T_SHARED_FILE_UNSHARED   = 35,
    T_ADD_SECTION_OPTION     = 36,
    T_CLIENT_STATS_V2        = 37,
    T_ADD_PLUGIN_OPTION      = 38,
    T_CLIENT_STATS_V3        = 39,
    T_FILE_INFO_V2           = 40,
    T_DOWNLOAD_FILES_V3      = 41,
    T_DOWNLOADED_FILES_V1    = 42,
    T_FILE_INFO_V3           = 43,
    T_DOWNLOAD_FILES_V4      = 44,
    T_DOWNLOADED_FILES_V2    = 45,
    T_FILE_DOWNLOADED        = 46,
    T_BAD_PASSWORD           = 47,
    T_SHARED_FILE_INFO       = 48,
    T_CLIENT_STATS           = 49,
    T_FILE_REMOVE_SOURCE     = 50,
    T_CLEAN_TABLES           = 51,
    T_FILE_INFO              = 52,
    T_DOWNLOAD_FILES         = 53,
    T_DOWNLOADED_FILES       = 54,
    T_UPLOAD_FILES           = 55,
    T_PENDING                = 56,
    T_SEARCH                 = 57,
    T_VERSION                = 58
}

export enum MLMessageTypeTo {
    T_NONE                   = -1,
    T_GUI_PROTOCOL           = 0,
    T_CONNECT_MORE_QUERY     = 1,
    T_CLEAN_OLD_SERVERS      = 2,
    T_KILL_SERVER            = 3,
    T_EXTENDED_SEARCH        = 4,
    T_PASSWORD_V1            = 5,
    T_SEARCH_QUERY_V1        = 6,
    T_DOWNLOAD_QUERY_V1      = 7,
    T_URL                    = 8,
    T_REMOVE_SERVER_QUERY    = 9,
    T_SAVE_OPTIONS_QUERY     = 10,
    T_REMOVE_DOWNLOAD_QUERY  = 11,
    T_SERVER_USERS_QUERY     = 12,
    T_SAVE_FILE              = 13,
    T_ADD_CLIENT_FRIEND      = 14,
    T_ADD_USER_FRIEND        = 15,
    T_REMOVE_FRIEND          = 16,
    T_REMOVE_ALL_FRIENDS     = 17,
    T_FIND_FRIEND            = 18,
    T_VIEW_USERS             = 19,
    T_CONNECT_ALL            = 20,
    T_CONNECT_SERVER         = 21,
    T_DISCONNECT_SERVER      = 22,
    T_SWITCH_DOWNLOAD        = 23,
    T_VERIFY_ALL_CHUNKS      = 24,
    T_QUERY_FORMAT           = 25,
    T_MODIFY_MP3_TAGS        = 26,
    T_FORGET_SEARCH          = 27,
    T_SET_OPTION             = 28,
    T_COMMAND                = 29,
    T_PREVIEW                = 30,
    T_CONNECT_FRIEND         = 31,
    T_GET_SERVER_USERS       = 32,
    T_GET_CLIENT_FILES       = 33,
    T_GET_FILE_LOCATIONS     = 34,
    T_GET_SERVER_INFO        = 35,
    T_GET_CLIENT_INFO        = 36,
    T_GET_FILE_INFO          = 37,
    T_GET_USER_INFO          = 38,
    T_SEND_MESSAGE           = 39,
    T_ENABLE_NETWORK         = 40,
    T_BROWSE_USER            = 41,
    T_SEARCH_QUERY           = 42,
    T_MESSAGE_TO_CLIENT      = 43,
    T_GET_CONNECTED_SERVERS  = 44,
    T_GET_DOWNLOAD_FILES     = 45,
    T_GET_DOWNLOADED_FILES   = 46,
    T_GUI_EXTENSIONS         = 47,
    T_SET_ROOM_STATE         = 48,
    T_REFRESH_UPLOAD_STATS   = 49,
    T_DOWNLOAD_QUERY         = 50,
    T_SET_FILE_PRIORITY      = 51,
    T_PASSWORD               = 52,
    T_CLOSE_SEARCH           = 53,
    T_ADD_SERVER_QUERY       = 54,
    T_MESSAGE_VERSIONS       = 55,
    T_RENAME_FILE            = 56,
    T_GET_UPLOADERS          = 57,
    T_GET_PENDING            = 58,
    T_GET_SEARCHES           = 59,
    T_GET_SEARCH             = 60,
    T_CONNECT_CLIENT         = 61,
    T_DISCONNECT_CLIENT      = 62,
    T_NETWORK_MESSAGE        = 63,
    T_INTERESTED_IN_SOURCES  = 64,
    T_GET_VERSION            = 65,
    T_SERVER_RENAME          = 66,
    T_SERVER_SET_PREFERRED   = 67
}


/**
 * Represent a generic messago to or from the mlnet core.
 */
export abstract class MLMsg {
    public opcode: number

    /**
     * Ctor.
     * 
     * @param type 
     */
    constructor(opcode: number) {
        this.opcode = opcode
    }

    /**
     * Embeds the buffer into a mldonkey envelope.
     * 
     * @param buffer 
     * @returns 
     */
    protected createEnvelope(buffer: ArrayBuffer): ArrayBuffer {
        let envelope = new ArrayBuffer(0)
        envelope = this.appendInt32(envelope, buffer.byteLength + 2)
        envelope = this.appendInt16(envelope, this.opcode)
        return MLUtils.concatArrayBuffers(envelope, buffer)
    }

    /**
     * Appends a string.
     * 
     * @param buffer 
     * @param s 
     */
    protected appendString(buffer: ArrayBuffer, s: string): ArrayBuffer {
        const sSize = s.length
        let ret = new ArrayBuffer(0)
        if (sSize >= 0xffff) {
            ret = this.appendInt16(ret, 0xffff)
            ret = this.appendInt32(ret, sSize)
        }
        else
            ret = this.appendInt16(ret, sSize)
        return MLUtils.concatArrayBuffers(buffer, ret, MLUtils.stringToUtf8ArrayBuffer(s))
    }

    /**
     * Appends a list of strings.
     * 
     * @param buffer 
     * @param strings 
     * @returns 
     */
    protected appendStringList(buffer: ArrayBuffer, strings: string[]): ArrayBuffer {
        let tmpBuff = new ArrayBuffer(0)
        tmpBuff = this.appendInt16(tmpBuff, strings.length)
        strings.forEach((s) => {
            tmpBuff = this.appendString(tmpBuff, s)
        })
        return tmpBuff
    }

    /**
     * Appends a 8 bit integer.
     * 
     * @param buffer 
     * @param i 
     * @returns 
     */
    protected appendInt8(buffer: ArrayBuffer, i: number): ArrayBuffer {
        const tmpBuff = new DataView(new ArrayBuffer(1))
        tmpBuff.setInt8(0, i)
        return MLUtils.concatArrayBuffers(buffer, tmpBuff.buffer)
    }

    /**
     * Appends a 16 bit integer.
     * 
     * @param buffer 
     * @param i 
     * @returns 
     */
    protected appendInt16(buffer: ArrayBuffer, i: number): ArrayBuffer {
        const tmpBuff = new DataView(new ArrayBuffer(2))
        tmpBuff.setInt16(0, i, true)
        return MLUtils.concatArrayBuffers(buffer, tmpBuff.buffer)
    }

    /**
     * Appends a 32 bit integer.
     * 
     * @param buffer 
     * @param i 
     * @returns 
     */
    protected appendInt32(buffer: ArrayBuffer, i: number): ArrayBuffer {
        const tmpBuff = new DataView(new ArrayBuffer(4))
        tmpBuff.setInt32(0, i, true)
        return MLUtils.concatArrayBuffers(buffer, tmpBuff.buffer)
    }
}

/**
 * Represents the CoreProtocol message.
 */
export abstract class MLMsgFrom extends MLMsg {
    /**
     * Ctor.
     */
    constructor(public type: MLMessageTypeFrom) {
        super(type)
    }
}

export abstract class MLMsgTo extends MLMsg {
    /**
     * Ctor.
     */
    constructor(public type: MLMessageTypeTo) {
        super(type)
    }

    /**
     * Not supposed to be sent to the server.
     * 
     * @returns 
     */
    public abstract toBuffer(): ArrayBuffer
}

export class MLMsgFromNone extends MLMsgFrom {
    constructor() { super(MLMessageTypeFrom.T_NONE) }
}

/**
 * Core protocol message.
 */
export class MLMessageCoreProtocol extends MLMsgFrom {
    public version: number

    /**
     * Ctor.
     */
    constructor(version: number) {
        super(MLMessageTypeFrom.T_CORE_PROTOCOL)
        this.version = version
    }

    public static fromBuffer(buffer: ArrayBuffer): MLMessageCoreProtocol {
        return new MLMessageCoreProtocol(new DataView(buffer).getInt32(2, true))
    }
}

/**
 * Bad password message.
 */
export class MLMessageBadPassword extends MLMsgFrom {
    constructor() { super(MLMessageTypeFrom.T_BAD_PASSWORD) }
}

export class MLMessageGuiProtocol extends MLMsgTo {
    public version: number
    constructor(version: number) {
        super(MLMessageTypeTo.T_GUI_PROTOCOL)
        this.version = version
    }
    public toBuffer(): ArrayBuffer {
        let ret = this.appendInt32(new ArrayBuffer(0), this.version)
        ret = this.createEnvelope(ret)
        return ret
    }
}

/**
 * Represents the Password message.
 */
export class MLMessageToPassword extends MLMsgTo {
    public user: string
    public passwd: string

    /**
     * Ctor.
     * 
     * @param user
     * @param passwd 
     */
    constructor(user: string, passwd: string) {
        super(MLMessageTypeTo.T_PASSWORD)
        this.user = user
        this.passwd = passwd
    }

    /**
     * Serialize.
     */
    public toBuffer(): ArrayBuffer {
        let ret = new ArrayBuffer(0)
        ret = this.appendString(ret, this.passwd)
        ret = this.appendString(ret, this.user)
        return this.createEnvelope(ret)
    }
}

export class MLMsgToGetDownload extends MLMsgTo {
    constructor() {
        super(MLMessageTypeTo.T_GET_DOWNLOAD_FILES)
    }

    public toBuffer(): ArrayBuffer {
        let ret = new ArrayBuffer(0)
        ret = this.createEnvelope(ret)
        return ret
    }
}
