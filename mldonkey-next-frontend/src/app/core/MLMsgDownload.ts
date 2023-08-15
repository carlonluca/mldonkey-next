import { logger } from "./MLLogger"
import { MLMessageFrom, MLMessageTypeFrom } from "./MLMsg"
import { MLMsgReader } from "./MLMsgReader"
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
        const reader = new MLMsgReader(buffer)
        const elementCount = reader.takeInt16()
        const elements: Map<number, MLMsgDownloadElement> = new Map()
        //for (let i = 0; i < elementCount; i++) {
            const downloadId = reader.takeInt32()
            const netId = reader.takeInt32()
            const names = reader.takeStringList()
            const md4 = reader.takeMd4()
            const size = reader.takeInt64()
            const downloaded = reader.takeInt64()            

            logger.debug("File:", downloadId, names, size)
        //}

        return new MLMsgFromDownload(new Map())
    }
}
