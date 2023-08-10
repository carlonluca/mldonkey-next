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
}
