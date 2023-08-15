import { MLCollectionModel } from "./MLCollectionModel"
import { MLMsgDownloadElement } from "./MLMsgDownload"

export class MLDownloadManager extends MLCollectionModel<number, MLMsgDownloadElement> {
    protected override keyFromValue(value: MLMsgDownloadElement): number {
        return value.downloadId
    }
}
