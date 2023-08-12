import { MLMessageFrom, MLMessageTypeFrom } from "./MLMsg"

export class MLMessageFromNetInfo extends MLMessageFrom {
    constructor(public netNum: number, public name: string) {
        super(MLMessageTypeFrom.T_NET_INFO)
        this.name = name
    }

    public static fromBuffer(buffer: ArrayBuffer): MLMessageFrom {
        const [nn] = this.readInt32(buffer, 0)
        const [name] = this.readString(buffer, 4)
        return new MLMessageFromNetInfo(nn, name)
    }
}
