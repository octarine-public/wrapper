import { Vector2 } from "../Base/Vector2"
import { ViewBinaryStream } from "../Utils/ViewBinaryStream"

export function ParseTRMP(
	stream: ViewBinaryStream
): [Map<string, [number, Vector2][]>, number] {
	{
		const magic = stream.ReadUint32(false)
		if (magic !== 0x74726d70) {
			// trmp
			console.log(`Invalid TRMP magic: 0x${magic.toString(16)}`)
			return [new Map(), 0]
		}
	}
	{
		const version = stream.ReadUint32()
		if (version !== 1) {
			console.log(`Unknown TRMP version: ${version}`)
			return [new Map(), 0]
		}
	}
	const dataOffset = stream.ReadUint32(),
		lumpNamesCount = stream.ReadUint32(),
		treeCount = stream.ReadUint32()
	stream.pos = dataOffset

	const lumps = new Map<string, [number, Vector2][]>(),
		lumpNames: string[] = []
	for (let i = 0; i < lumpNamesCount; i++) {
		let lumpName = stream.ReadNullTerminatedUtf8String()
		if (lumpName === "") {
			lumpName = "world_layer_base"
		}
		lumpNames.push(lumpName)
		lumps.set(lumpName, [])
	}

	for (let i = 0; i < treeCount; i++) {
		const x = stream.ReadInt32(),
			y = stream.ReadInt32(),
			lump = lumpNames[stream.ReadInt32()]
		lumps.get(lump)!.push([i, new Vector2(x, y)])
	}
	return [lumps, treeCount]
}
