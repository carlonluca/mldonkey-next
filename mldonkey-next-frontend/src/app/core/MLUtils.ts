export class MLUtils {
    /**
     * Returns a string containing the hex representation fo the provided
     * ArrayBuffer.
     * 
     * @param buffer 
     * @returns 
     */
    public static buf2hex(buffer: ArrayBuffer): string {
        return [...new Uint8Array(buffer)]
            .map(x => x.toString(16).padStart(2, '0'))
            .join('');
    }

    public static subviewFromRange(source: DataView, offset: number, length: number): DataView {
        const buffer = source.buffer
        const subBuffer = buffer.slice(offset, length)
        return new DataView(subBuffer)
    }

    public static concatArrayBuffers(...buffers: ArrayBuffer[]) {
        const totalLength = buffers.reduce((acc, buffer) => acc + buffer.byteLength, 0)
        const combinedBuffer = new ArrayBuffer(totalLength)
        const combinedUint8Array = new Uint8Array(combinedBuffer)

        let offset = 0
        for (const buffer of buffers) {
            const uint8Array = new Uint8Array(buffer)
            combinedUint8Array.set(uint8Array, offset)
            offset += buffer.byteLength
        }

        return combinedBuffer
    }

    public static stringToUtf8ArrayBuffer(input: string): ArrayBuffer {
        const encoder = new TextEncoder();
        return encoder.encode(input).buffer;
    }
}
