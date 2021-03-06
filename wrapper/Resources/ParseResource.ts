import BinaryStream from "../Utils/BinaryStream"

// https://github.com/SteamDatabase/ValveResourceFormat/blob/cdc150c810e124d6dfc4ec8911852a0278210835/ValveResourceFormat/Resource/Resource.cs#L161
export function ParseResourceLayout(buf: Uint8Array): Nullable<[Map<string, Uint8Array>, Uint8Array[]]> {
	const stream = new BinaryStream(new DataView(buf.buffer, buf.byteOffset, buf.byteLength))
	{
		const file_size = stream.ReadUint32()
		if (
			file_size === 0x55AA1234 // VPK magic
			|| file_size === 0x32736376 // compiled shader magic
			// || file_size != buf.byteLength // TODO: Some real files seem to have different file size
		) {
			console.log("Invalid resource file")
			return undefined
		}
	}
	{
		const header_version = stream.ReadUint16()
		if (header_version !== 12) {
			// console.log(`Unknown resource file version: ${header_version}`)
			return undefined
		}
	}
	stream.RelativeSeek(2) // version isn't used anywhere

	const block_offset = stream.ReadUint32(),
		block_count = stream.ReadUint32()
	stream.RelativeSeek(block_offset - 8)

	const map = new Map<string, Uint8Array>(),
		blocks: Uint8Array[] = []
	for (let i = 0; i < block_count; i++) {
		const type = stream.ReadUtf8String(4),
			start = stream.pos + stream.ReadUint32()
		const block = buf.subarray(start, start + stream.ReadUint32())
		map.set(type, block)
		blocks.push(block)
	}
	return [map, blocks]
}
