/*
 * This file is part of mldonkey-next.
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
import prettyBytes from "pretty-bytes"

export type MLStringPair = [string, string]
export type MLStringPairList = MLStringPair[]

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

    /**
     * Prints a human readable size.
     * 
     * @param size 
     * @returns 
     */
    public static beautifySize(size: bigint | number): string {
        if (size > Number.MAX_SAFE_INTEGER)
            return "" + size
        return prettyBytes(Number(size))
    }

    public static prettyFormat(millis: number): string {
        const totalSeconds = Math.floor(millis / 1000)
        const seconds = totalSeconds % 60
        const totalMinutes = Math.floor(totalSeconds / 60)
        const minutes = totalMinutes % 60
        const totalHours = Math.floor(totalMinutes / 60)
        const hours = totalHours % 24
        const days = Math.floor(totalHours / 24)

        const parts = []
        if (days > 0)
            parts.push(`${days} ${days === 1 ? 'day' : 'days'}`)
        if (hours > 0)
            parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`)
        if (minutes > 0)
            parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`)
        if (seconds > 0)
            parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`)

        return parts.join(', ')
    }
}
