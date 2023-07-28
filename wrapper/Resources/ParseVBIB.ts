import { DecompressIndexBuffer, DecompressVertexBuffer } from "../Native/WASM"
import { ViewBinaryStream } from "../Utils/ViewBinaryStream"
import { GetMapNumberProperty, MapToNumberArray } from "./ParseUtils"

export enum RenderSlotType {
	RENDER_SLOT_INVALID = -1,
	RENDER_SLOT_PER_VERTEX = 0,
	RENDER_SLOT_PER_INSTANCE = 1
}

export class VBIBLayoutField {
	constructor(
		public readonly Name: string,
		public readonly Index: number,
		public readonly Format: number,
		public readonly Offset: number,
		public readonly Slot: number,
		public readonly SlotType: RenderSlotType,
		public readonly InstanceStepRate: number
	) {}
}

export class VBIBBufferData {
	private CheckedData = false
	constructor(
		public readonly ElementCount: number,
		public readonly ElementSize: number,
		public readonly InputLayout: VBIBLayoutField[],
		private Data_: Uint8Array,
		private readonly IsVertexBuffer: boolean
	) {}

	public get Data() {
		if (this.CheckedData) return this.Data_
		if (this.ElementCount * this.ElementSize !== this.Data_.byteLength)
			this.Data_ = this.IsVertexBuffer
				? DecompressVertexBuffer(
						this.Data_,
						this.ElementCount,
						this.ElementSize
				  )
				: DecompressIndexBuffer(this.Data_, this.ElementCount, this.ElementSize)
		this.CheckedData = true
		return this.Data_
	}
}

export class VBIB {
	constructor(
		public readonly VertexBuffers: VBIBBufferData[] = [],
		public readonly IndexBuffers: VBIBBufferData[] = []
	) {}
}

function ReadOnDiskBufferData(
	stream: ReadableBinaryStream,
	isVertexBuffer: boolean
): VBIBBufferData {
	const elementCount = stream.ReadUint32(),
		elementSize = stream.ReadUint32(),
		attributePosition = stream.pos + stream.ReadInt32(),
		attributeCount = stream.ReadUint32(),
		dataPosition = stream.pos + stream.ReadUint32(),
		dataSize = stream.ReadUint32(),
		headerEndPosition = stream.pos
	const fields: VBIBLayoutField[] = []
	stream.pos = attributePosition
	for (let i = 0; i < attributeCount; i++) {
		const startPos = stream.pos
		const name = stream.ReadNullTerminatedUtf8String()
		stream.pos = startPos + 32
		fields.push(
			new VBIBLayoutField(
				name,
				stream.ReadUint32(),
				stream.ReadUint32(),
				stream.ReadUint32(),
				stream.ReadInt32(),
				stream.ReadUint32(),
				stream.ReadInt32()
			)
		)
	}
	stream.pos = dataPosition
	const data = stream.ReadSliceNoCopy(dataSize)
	stream.pos = headerEndPosition
	return new VBIBBufferData(
		elementCount,
		elementSize,
		fields,
		data,
		isVertexBuffer
	)
}

export function ParseVBIB(stream: ReadableBinaryStream): VBIB {
	const vbib = new VBIB()
	const vertexBufferPosition = stream.pos + stream.ReadUint32(),
		vertexBufferCount = stream.ReadUint32(),
		indexBufferPosition = stream.pos + stream.ReadUint32(),
		indexBufferCount = stream.ReadUint32()
	stream.pos = vertexBufferPosition
	for (let i = 0; i < vertexBufferCount; i++)
		vbib.VertexBuffers.push(ReadOnDiskBufferData(stream, true))
	stream.pos = indexBufferPosition
	for (let i = 0; i < indexBufferCount; i++)
		vbib.IndexBuffers.push(ReadOnDiskBufferData(stream, false))
	return vbib
}

function ReadBufferDataFromKV(
	kv: RecursiveMap,
	isVertexBuffer: boolean
): VBIBBufferData {
	const elementCount = GetMapNumberProperty(kv, "m_nElementCount"),
		elementSize = GetMapNumberProperty(kv, "m_nElementSizeInBytes"),
		fieldsKV = kv.get("m_inputLayoutFields")
	const fields: VBIBLayoutField[] = []
	if (fieldsKV instanceof Map || Array.isArray(fieldsKV))
		fieldsKV.forEach((fieldKV: RecursiveMapValue) => {
			if (!(fieldKV instanceof Map)) return
			let nameArray = fieldKV.get("m_pSemanticName")
			if (nameArray instanceof Map || Array.isArray(nameArray))
				nameArray = new Uint8Array(MapToNumberArray(nameArray))
			if (!(nameArray instanceof Uint8Array)) nameArray = new Uint8Array()
			fields.push(
				new VBIBLayoutField(
					new ViewBinaryStream(
						new DataView(
							nameArray.buffer,
							nameArray.byteOffset,
							nameArray.byteLength
						)
					).ReadUtf8String(nameArray.byteLength),
					GetMapNumberProperty(fieldKV, "m_nSemanticIndex"),
					GetMapNumberProperty(fieldKV, "m_Format"),
					GetMapNumberProperty(fieldKV, "m_nOffset"),
					GetMapNumberProperty(fieldKV, "m_nSlot"),
					GetMapNumberProperty(fieldKV, "m_nSlotType"),
					GetMapNumberProperty(fieldKV, "m_nInstanceStepRate")
				)
			)
		})
	let dataKV = kv.get("m_pData")
	if (dataKV instanceof Map || Array.isArray(dataKV))
		dataKV = new Uint8Array(MapToNumberArray(dataKV))
	if (!(dataKV instanceof Uint8Array)) dataKV = new Uint8Array()
	return new VBIBBufferData(
		elementCount,
		elementSize,
		fields,
		dataKV,
		isVertexBuffer
	)
}

export function ParseVBIBFromKV(kv: RecursiveMap): VBIB {
	const vbib = new VBIB()
	const vertexBuffers = kv.get("m_vertexBuffers")
	if (vertexBuffers instanceof Map || Array.isArray(vertexBuffers))
		vertexBuffers.forEach((vb: RecursiveMapValue) => {
			if (vb instanceof Map)
				vbib.VertexBuffers.push(ReadBufferDataFromKV(vb, true))
		})
	const indexBuffers = kv.get("m_indexBuffers")
	if (indexBuffers instanceof Map || Array.isArray(indexBuffers))
		indexBuffers.forEach((ib: RecursiveMapValue) => {
			if (ib instanceof Map)
				vbib.IndexBuffers.push(ReadBufferDataFromKV(ib, false))
		})
	return vbib
}
