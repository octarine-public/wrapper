import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import RendererSDK from "../Native/RendererSDK"
import BinaryStream from "./BinaryStream"

export function ParseTRMP(buf: ArrayBuffer): Vector3[] {
	const stream = new BinaryStream(new DataView(buf))
	{
		const magic = stream.ReadUint32(false)
		if (magic !== 0x74726D70) { // trmp
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
	const data_offset = stream.ReadUint32(),
		lump_names_count = stream.ReadUint32(),
		tree_count = stream.ReadUint32()
	stream.pos = data_offset

	for (let i = 0; i < lump_names_count; i++)
		stream.ReadNullTerminatedUtf8String()

	const trees: Vector3[] = []
	for (let i = 0; i < tree_count; i++) {
		const x = stream.ReadInt32(),
			y = stream.ReadInt32()
		stream.RelativeSeek(4) // lump ID
		trees.push(new Vector3(x, y, RendererSDK.GetPositionHeight(new Vector2(x, y))))
	}
	return trees
}
