import { logger } from "./MLLogger"
import { MLMessageFrom, MLMessageTypeFrom } from "./MLMsg"
import { MLUPdateable } from "./MLUpdateable"

export class MLMsgDownloadElement implements MLUPdateable<MLMsgDownloadElement> {
    constructor(public downloadId: number) {}
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    update(update: MLMsgDownloadElement): void {
        
    }
}

export class MLMsgFromDownload extends MLMessageFrom {
    constructor(public elemnts: Map<number, MLMsgDownloadElement>) {
        super(MLMessageTypeFrom.T_DOWNLOAD_FILES)
    }

    public static fromBuffer(buffer: ArrayBuffer): MLMsgFromDownload {
        let offset = 0
        const [elementCount] = this.readInt16(buffer, 0)
        offset += 2
        const elements: Map<number, MLMsgDownloadElement> = new Map()
        //for (let i = 0; i < elementCount; i++) {
            const [downloadId] = this.readInt32(buffer, offset)
            offset += 4
            const [netId] = this.readInt32(buffer, offset)
            offset += 4
            const [names, consumedStrings] = this.readStringList(buffer, offset)
            offset += consumedStrings
            const [md4, consumedMd4] = this.readMd4(buffer, offset)
            offset += consumedMd4
            const [size] = this.readInt64(buffer, offset)
            offset += 8
            const [downloaded] = this.readInt64(buffer, offset)
            offset += 8

            logger.debug("File:", downloadId, names, size)
        //}

        return new MLMsgFromDownload(new Map())
    }
}
