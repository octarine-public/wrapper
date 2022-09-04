import { DecompressIndexBuffer, DecompressVertexBuffer } from "../Native/WASM"
import { isStream } from "../Utils/ReadableBinaryStreamUtils"
import ViewBinaryStream from "../Utils/ViewBinaryStream"
import { GetMapNumberProperty, MapToNumberArray } from "./ParseUtils"

export enum RenderSlotType {
	RENDER_SLOT_INVALID = -1,
	RENDER_SLOT_PER_VERTEX = 0,
	RENDER_SLOT_PER_INSTANCE = 1,
}

export class VBIBLayoutField {
	constructor(
		public readonly Name: string,
		public readonly Index: number,
		public readonly Format: number,
		public readonly Offset: number,
		public readonly Slot: number,
		public readonly SlotType: RenderSlotType,
		public readonly InstanceStepRate: number,
	) { }
}

export class VBIBBufferData {
	constructor(
		public readonly ElementCount: number,
		public readonly ElementSize: number,
		public readonly InputLayout: VBIBLayoutField[],
		private Data_: ReadableBinaryStream | Uint8Array,
		private readonly IsVertexBuffer: boolean,
	) { }

	public get Data() {
		if (this.Data_ instanceof Uint8Array)
			return this.Data_
		if (this.ElementCount * this.ElementSize !== this.Data_.Size)
			this.Data_ = this.IsVertexBuffer
				? DecompressVertexBuffer(this.Data_, this.ElementCount, this.ElementSize)
				: DecompressIndexBuffer(this.Data_, this.ElementCount, this.ElementSize)
		else
			this.Data_ = this.Data_.ReadSlice(this.Data_.Size)
		return this.Data_
	}
}

export class VBIB {
	constructor(
		public readonly VertexBuffers: VBIBBufferData[] = [],
		public readonly IndexBuffers: VBIBBufferData[] = [],
	) { }
}

function ReadOnDiskBufferData(stream: ReadableBinaryStream, isVertexBuffer: boolean): VBIBBufferData {
	const element_count = stream.ReadUint32(),
		element_size = stream.ReadUint32(),
		attribute_position = stream.pos + stream.ReadInt32(),
		attribute_count = stream.ReadUint32(),
		data_position = stream.pos + stream.ReadUint32(),
		data_size = stream.ReadUint32(),
		header_end_position = stream.pos
	const fields: VBIBLayoutField[] = []
	stream.pos = attribute_position
	for (let i = 0; i < attribute_count; i++) {
		const start_pos = stream.pos
		const name = stream.ReadNullTerminatedUtf8String()
		stream.pos = start_pos + 32
		fields.push(new VBIBLayoutField(
			name,
			stream.ReadUint32(),
			stream.ReadUint32(),
			stream.ReadUint32(),
			stream.ReadInt32(),
			stream.ReadUint32(),
			stream.ReadInt32(),
		))
	}
	stream.pos = data_position
	const data = stream.CreateNestedStream(data_size)
	stream.pos = header_end_position
	return new VBIBBufferData(
		element_count,
		element_size,
		fields,
		data,
		isVertexBuffer,
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

function ReadBufferDataFromKV(kv: RecursiveMap, isVertexBuffer: boolean): VBIBBufferData {
	const element_count = GetMapNumberProperty(kv, "m_nElementCount"),
		element_size = GetMapNumberProperty(kv, "m_nElementSizeInBytes"),
		fieldsKV = kv.get("m_inputLayoutFields")
	const fields: VBIBLayoutField[] = []
	if (fieldsKV instanceof Map || Array.isArray(fieldsKV))
		fieldsKV.forEach((fieldKV: RecursiveMapValue) => {
			if (!(fieldKV instanceof Map))
				return
			let name_array = fieldKV.get("m_pSemanticName")
			if (name_array instanceof Map || Array.isArray(name_array))
				name_array = new ViewBinaryStream(new DataView(new Uint8Array(MapToNumberArray(name_array)).buffer))
			if (!isStream(name_array))
				name_array = new ViewBinaryStream(new DataView(new ArrayBuffer(0)))
			fields.push(new VBIBLayoutField(
				name_array.ReadUtf8String(name_array.Size),
				GetMapNumberProperty(fieldKV, "m_nSemanticIndex"),
				GetMapNumberProperty(fieldKV, "m_Format"),
				GetMapNumberProperty(fieldKV, "m_nOffset"),
				GetMapNumberProperty(fieldKV, "m_nSlot"),
				GetMapNumberProperty(fieldKV, "m_nSlotType"),
				GetMapNumberProperty(fieldKV, "m_nInstanceStepRate"),
			))
		})
	let dataKV = kv.get("m_pData")
	if (dataKV instanceof Map || Array.isArray(dataKV))
		dataKV = new ViewBinaryStream(new DataView(new Uint8Array(MapToNumberArray(dataKV)).buffer))
	if (!isStream(dataKV))
		dataKV = new ViewBinaryStream(new DataView(new ArrayBuffer(0)))
	return new VBIBBufferData(
		element_count,
		element_size,
		fields,
		dataKV,
		isVertexBuffer,
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
