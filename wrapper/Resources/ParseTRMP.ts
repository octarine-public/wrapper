import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { GetPositionHeight } from "../Native/WASM"

export function ParseTRMP(stream: ReadableBinaryStream): Vector3[] {
	{
		const magic = stream.ReadUint32(false)
		if (magic !== 0x74726d70) {
			// trmp
			console.log(`Invalid TRMP magic: 0x${magic.toString(16)}`)
			return []
		}
	}
	{
		const version = stream.ReadUint32()
		if (version !== 1) {
			console.log(`Unknown TRMP version: ${version}`)
			return []
		}
	}
	const dataOffset = stream.ReadUint32(),
		lumpNamesCount = stream.ReadUint32(),
		treeCount = stream.ReadUint32()
	stream.pos = dataOffset

	for (let i = 0; i < lumpNamesCount; i++) stream.ReadNullTerminatedUtf8String()

	const trees: Vector3[] = []
	for (let i = 0; i < treeCount; i++) {
		const x = stream.ReadInt32(),
			y = stream.ReadInt32()
		stream.RelativeSeek(4) // lump ID
		trees.push(new Vector3(x, y, GetPositionHeight(new Vector2(x, y))))
	}
	return trees
}
