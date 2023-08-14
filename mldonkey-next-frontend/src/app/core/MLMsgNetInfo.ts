import { MLMessageFrom, MLMessageTypeFrom } from "./MLMsg"

export enum MLNetworkFlags {
    NetworkHasServers = 0x0001,
    NetworkHasRooms = 0x0002,
    NetworkHasMultinet = 0x0004,
    VirtualNetwork = 0x0008,
    NetworkHasSearch = 0x0010,
    NetworkHasChat = 0x0020,
    NetworkHasSupernodes = 0x0040,
    NetworkHasUpload = 0x0080
}

export class MLMessageFromNetInfo extends MLMessageFrom {
    constructor(
        public netNum: number,
        public name: string,
        public enabled: boolean,
        public configFile: string,
        public uploaded: bigint,
        public downloaded: bigint,
        public connected: boolean,
        public flags: MLNetworkFlags
    ) {
        super(MLMessageTypeFrom.T_NET_INFO)
    }

    public static fromBuffer(buffer: ArrayBuffer): MLMessageFrom {
        let offset = 0
        const [nn] = this.readInt32(buffer, 0)
        offset += 4
        const [name, consumedName] = this.readString(buffer, offset)
        offset += consumedName
        const [enabled] = this.readInt8(buffer, offset)
        offset += 1
        const [configFile, consumedConfigFile] = this.readString(buffer, offset)
        offset += consumedConfigFile
        const [uploaded] = this.readInt64(buffer, offset)
        offset += 8
        const [downloaded] = this.readInt64(buffer, offset)
        offset += 8
        const [connected] = this.readInt8(buffer, offset)
        offset += 1
        const [flagCount] = this.readInt16(buffer, offset)
        offset += 2
        let flags = 0
        for (let i = 0; i < flagCount; i++) {
            const [j] = this.readInt16(buffer, offset)
            flags |= (1 << j) as MLNetworkFlags
            offset += 2
        }
        return new MLMessageFromNetInfo(nn, name, enabled != 0, configFile, uploaded, downloaded, connected != 0, flags as MLNetworkFlags)
    }
}
