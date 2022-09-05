declare interface ReadableBinaryStream {
	pos: number
	readonly Remaining: number
	readonly Size: number
	readonly Offset: number

	RelativeSeek(s: number): void
	ReadUint8(): number
	ReadInt8(): number
	ReadVarUintAsNumber(): number
	ReadVarUint(): bigint
	ReadUint16(littleEndian?: boolean): number
	ReadInt16(littleEndian?: boolean): number
	ReadUint32(littleEndian?: boolean): number
	ReadInt32(littleEndian?: boolean): number
	ReadUint64(littleEndian?: boolean): bigint
	ReadInt64(littleEndian?: boolean): bigint
	ReadFloat32(littleEndian?: boolean): number
	ReadFloat64(littleEndian?: boolean): number
	ReadBoolean(): boolean
	ReadSliceTo(output: Uint8Array): void
	ReadSlice(size: number): Uint8Array
	ReadUtf8Char(size?: number): string
	ReadUtf16Char(): string
	ReadChar(): string
	SeekLine(): void
	ReadUtf8String(size: number): string
	ReadUtf16String(size: number): string
	ReadNullTerminatedString(): string
	ReadNullTerminatedUtf8String(): string
	ReadNullTerminatedUtf16String(): string
	// https://github.com/SteamDatabase/ValveResourceFormat/blob/cceba491d7bb60890a53236a90970b24d0a4aba9/ValveResourceFormat/Utils/StreamHelpers.cs#L43
	ReadOffsetString(): string
	ReadVarString(): string
	Empty(): boolean
	CreateNestedStream(size: number, detectEncoding?: boolean): ReadableBinaryStream
}
