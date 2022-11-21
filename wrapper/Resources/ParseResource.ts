// https://github.com/SteamDatabase/ValveResourceFormat/blob/cdc150c810e124d6dfc4ec8911852a0278210835/ValveResourceFormat/Resource/Resource.cs#L161
export function ParseResourceLayout(
	stream_: ReadableBinaryStream
): Nullable<[Map<string, ReadableBinaryStream>, ReadableBinaryStream[]]> {
	const startingPos = stream_.pos,
		stream = stream_.CreateNestedStream(stream_.Remaining)
	stream_.pos = startingPos
	{
		const fileSize = stream.ReadUint32()
		if (
			fileSize === 0x55aa1234 || // VPK magic
			fileSize === 0x32736376 // compiled shader magic
			// || file_size != buf.byteLength // TODO: Some real files seem to have different file size
		) {
			console.log("Invalid resource file")
			return undefined
		}
	}
	{
		const headerVersion = stream.ReadUint16()
		if (headerVersion !== 12) {
			// console.log(`Unknown resource file version: ${header_version}`)
			return undefined
		}
	}
	stream.RelativeSeek(2) // version isn't used anywhere

	const blockOffset = stream.ReadUint32(),
		blockCount = stream.ReadUint32()
	stream.RelativeSeek(blockOffset - 8)

	const map = new Map<string, ReadableBinaryStream>(),
		blocks: ReadableBinaryStream[] = []
	for (let i = 0; i < blockCount; i++) {
		const type = stream.ReadUtf8String(4),
			start = stream.pos + stream.ReadUint32(),
			size = stream.ReadUint32()
		const oldPos = stream.pos
		stream.pos = start
		const block = stream.CreateNestedStream(size)
		stream.pos = oldPos
		map.set(type, block)
		blocks.push(block)
	}
	return [map, blocks]
}
