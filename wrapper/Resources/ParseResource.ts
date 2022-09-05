// https://github.com/SteamDatabase/ValveResourceFormat/blob/cdc150c810e124d6dfc4ec8911852a0278210835/ValveResourceFormat/Resource/Resource.cs#L161
export function ParseResourceLayout(stream_: ReadableBinaryStream): Nullable<[Map<string, ReadableBinaryStream>, ReadableBinaryStream[]]> {
	const starting_pos = stream_.pos,
		stream = stream_.CreateNestedStream(stream_.Remaining)
	stream_.pos = starting_pos
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

	const map = new Map<string, ReadableBinaryStream>(),
		blocks: ReadableBinaryStream[] = []
	for (let i = 0; i < block_count; i++) {
		const type = stream.ReadUtf8String(4),
			start = stream.pos + stream.ReadUint32(),
			size = stream.ReadUint32()
		const old_pos = stream.pos
		stream.pos = start
		const block = stream.CreateNestedStream(size)
		stream.pos = old_pos
		map.set(type, block)
		blocks.push(block)
	}
	return [map, blocks]
}
