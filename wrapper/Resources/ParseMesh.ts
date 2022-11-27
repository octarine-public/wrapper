import { Matrix3x4 } from "../Base/Matrix"
import { Vector3 } from "../Base/Vector3"
import { Vector4 } from "../Base/Vector4"
import { FileBinaryStream } from "../Utils/FileBinaryStream"
import { CMaterial, ParseMaterial } from "./ParseMaterial"
import { ParseResourceLayout } from "./ParseResource"
import {
	GetMapNumberProperty,
	GetMapStringProperty,
	MapToBooleanArray,
	MapToNumberArray,
	MapToQuaternionArray,
	MapToStringArray,
	MapToVector3,
	MapToVector3Array,
} from "./ParseUtils"
import { ParseVBIB, ParseVBIBFromKV, VBIB, VBIBBufferData } from "./ParseVBIB"

export class CMeshAttachment {
	public readonly Name: string
	public readonly InfluenceNames: string[] = []
	public readonly InfluenceBindPoses: Matrix3x4[] = []
	public readonly InfluenceWeights: number[] = []
	public readonly InfluenceRootTransforms: boolean[] = []
	public readonly IgnoreRotation: boolean
	constructor(kv: RecursiveMap) {
		this.Name = GetMapStringProperty(kv, "m_name")
		this.LoadInfluenceNames(kv)
		let influenceRotations = this.LoadInfluenceRotations(kv)
		let influenceOffsets = this.LoadInfluenceOffsets(kv)
		this.LoadInfluenceWeights(kv)
		this.LoadInfluenceRootTransforms(kv)

		const influences = GetMapNumberProperty(kv, "m_nInfluences")
		this.InfluenceNames = this.InfluenceNames.slice(0, influences)
		influenceOffsets = influenceOffsets.slice(0, influences)
		influenceRotations = influenceRotations.slice(0, influences)
		this.InfluenceWeights = this.InfluenceWeights.slice(0, influences)
		this.InfluenceRootTransforms = this.InfluenceRootTransforms.slice(
			0,
			influences
		)

		for (let i = 0; i < influences; i++) {
			const rotation = influenceRotations[i],
				offset = influenceOffsets[i]
			this.InfluenceBindPoses.push(
				Matrix3x4.AngleMatrix(
					rotation ?? new Vector4(0, 0, 0, 1),
					offset ?? new Vector3()
				)
			)
		}

		const bIgnoreRotation = kv.get("m_bIgnoreRotation")
		this.IgnoreRotation =
			typeof bIgnoreRotation === "boolean" ? bIgnoreRotation : false
	}

	private LoadInfluenceNames(kv: RecursiveMap): void {
		const influenceNames = kv.get("m_influenceNames")
		if (influenceNames instanceof Map || Array.isArray(influenceNames))
			this.InfluenceNames.push(...MapToStringArray(influenceNames))
	}
	private LoadInfluenceOffsets(kv: RecursiveMap): Vector3[] {
		const ar: Vector3[] = []
		const influenceOffsets = kv.get("m_vInfluenceOffsets")
		if (influenceOffsets instanceof Map || Array.isArray(influenceOffsets))
			ar.push(...MapToVector3Array(influenceOffsets))
		return ar
	}
	private LoadInfluenceRotations(kv: RecursiveMap): Vector4[] {
		const ar: Vector4[] = []
		const influenceRotations = kv.get("m_vInfluenceRotations")
		if (influenceRotations instanceof Map || Array.isArray(influenceRotations))
			ar.push(...MapToQuaternionArray(influenceRotations))
		return ar
	}
	private LoadInfluenceWeights(kv: RecursiveMap): void {
		const influenceWeights = kv.get("m_influenceWeights")
		if (influenceWeights instanceof Map || Array.isArray(influenceWeights))
			this.InfluenceWeights.push(...MapToNumberArray(influenceWeights))
	}
	private LoadInfluenceRootTransforms(kv: RecursiveMap): void {
		const influenceRootTransforms = kv.get("m_bInfluenceRootTransform")
		if (
			influenceRootTransforms instanceof Map ||
			Array.isArray(influenceRootTransforms)
		)
			this.InfluenceRootTransforms.push(
				...MapToBooleanArray(influenceRootTransforms)
			)
	}
}

export class CMeshDrawCall {
	constructor(
		public readonly VertexBuffer: VBIBBufferData,
		public readonly IndexBuffer: VBIBBufferData,
		public readonly Flags: number
	) {}
}

export class CMesh {
	public readonly MinBounds: Vector3
	public readonly MaxBounds: Vector3
	public readonly Attachments = new Map<string, CMeshAttachment>()
	public readonly DrawCalls: CMeshDrawCall[] = []
	constructor(kv: RecursiveMap, vbib: VBIB) {
		const [min, max] = this.ComputeBounds(kv)
		this.MinBounds = min
		this.MaxBounds = max
		this.LoadAttachments(kv)
		this.LoadDrawCalls(kv, vbib)
		// TODO: do we need IsCompressedNormalTangent support without rendering?
	}
	private ComputeBounds(kv: RecursiveMap): [Vector3, Vector3] {
		let min = new Vector3(),
			max = new Vector3()
		const sceneObjects = kv.get("m_sceneObjects")
		if (sceneObjects instanceof Map || Array.isArray(sceneObjects))
			sceneObjects.forEach((sceneObject: RecursiveMapValue) => {
				if (!(sceneObject instanceof Map)) return
				const vMinBounds = sceneObject.get("m_vMinBounds"),
					vMaxBounds = sceneObject.get("m_vMaxBounds")
				if (vMinBounds instanceof Map || Array.isArray(vMinBounds))
					min = MapToVector3(vMinBounds).Min(min)
				if (vMaxBounds instanceof Map || Array.isArray(vMaxBounds))
					max = MapToVector3(vMaxBounds).Max(max)
			})
		return [min, max]
	}
	private LoadAttachments(kv: RecursiveMap): void {
		const attachments = kv.get("m_attachments")
		if (attachments instanceof Map || Array.isArray(attachments))
			attachments.forEach((attachment: RecursiveMapValue) => {
				if (!(attachment instanceof Map)) return
				const key = attachment.get("key")
				if (typeof key !== "string") return
				const value = attachment.get("value")
				if (!(value instanceof Map)) return
				this.Attachments.set(key, new CMeshAttachment(value))
			})
	}
	private LoadDrawCalls(kv: RecursiveMap, vbib: VBIB): void {
		const sceneObjects = kv.get("m_sceneObjects")
		if (!(sceneObjects instanceof Map || Array.isArray(sceneObjects))) return
		sceneObjects.forEach((sceneObject: RecursiveMapValue) => {
			if (!(sceneObject instanceof Map)) return
			const drawCalls = sceneObject.get("m_drawCalls")
			if (!(drawCalls instanceof Map || Array.isArray(drawCalls))) return
			drawCalls.forEach((drawCall: RecursiveMapValue) => {
				if (!(drawCall instanceof Map)) return
				const indexBufferData = drawCall.get("m_indexBuffer")
				if (!(indexBufferData instanceof Map)) return
				const indexBufferID = GetMapNumberProperty(indexBufferData, "m_hBuffer")
				let indexBufferOffset = GetMapNumberProperty(
					indexBufferData,
					"m_nBindOffsetBytes"
				)
				const indexBuffer = vbib.IndexBuffers[indexBufferID]
				if (indexBuffer === undefined) return
				let vertexBufferData = drawCall.get("m_vertexBuffers")
				if (
					!(vertexBufferData instanceof Map || Array.isArray(vertexBufferData))
				)
					return
				vertexBufferData =
					vertexBufferData instanceof Map
						? vertexBufferData.get("0") // TODO: Not just 1 VB
						: vertexBufferData[0]
				if (!(vertexBufferData instanceof Map)) return
				const vertexBufferID = GetMapNumberProperty(
					vertexBufferData,
					"m_hBuffer"
				)
				let vertexBufferOffset = GetMapNumberProperty(
					vertexBufferData,
					"m_nBindOffsetBytes"
				)
				const vertexBuffer = vbib.VertexBuffers[vertexBufferID]
				if (vertexBuffer === undefined) return
				vertexBufferOffset +=
					GetMapNumberProperty(drawCall, "m_nBaseVertex") *
					vertexBuffer.ElementSize
				indexBufferOffset +=
					GetMapNumberProperty(drawCall, "m_nStartIndex") *
					indexBuffer.ElementSize
				const vertexCount = Math.min(
					GetMapNumberProperty(drawCall, "m_nVertexCount"),
					Math.floor(
						(vertexBuffer.Data.byteLength - vertexBufferOffset) /
							vertexBuffer.ElementSize
					)
				)
				const indexCount = Math.min(
					GetMapNumberProperty(drawCall, "m_nIndexCount"),
					Math.floor(
						(indexBuffer.Data.byteLength - indexBufferOffset) /
							indexBuffer.ElementSize
					)
				)
				let materialPath = GetMapStringProperty(drawCall, "m_material")
				if (materialPath === "")
					materialPath = GetMapStringProperty(drawCall, "m_pMaterial")
				if (!materialPath.endsWith("_c")) materialPath += "_c"
				let material: CMaterial | undefined
				const materialBuf = fopen(materialPath)
				if (materialBuf !== undefined)
					try {
						material = ParseMaterial(new FileBinaryStream(materialBuf))
					} finally {
						materialBuf.close()
					}
				this.DrawCalls.push(
					new CMeshDrawCall(
						new VBIBBufferData(
							vertexCount,
							vertexBuffer.ElementSize,
							vertexBuffer.InputLayout,
							vertexBuffer.Data.subarray(
								vertexBufferOffset,
								vertexBufferOffset + vertexCount * vertexBuffer.ElementSize
							),
							true
						),
						new VBIBBufferData(
							indexCount,
							indexBuffer.ElementSize,
							indexBuffer.InputLayout,
							indexBuffer.Data.subarray(
								indexBufferOffset,
								indexBufferOffset + indexCount * indexBuffer.ElementSize
							),
							false
						),
						material?.Flags ?? 0
					)
				)
			})
		})
	}
}

export function ParseEmbeddedMesh(
	data: Nullable<ReadableBinaryStream>,
	vbibData: Nullable<ReadableBinaryStream>
): CMesh {
	const kv = data?.ParseKVBlock() ?? new Map()
	if (kv.size === 0) throw "Mesh without data"
	const vbib =
		vbibData !== undefined ? ParseVBIB(vbibData) : ParseVBIBFromKV(kv)
	return new CMesh(kv, vbib)
}

export function ParseMesh(stream: ReadableBinaryStream): CMesh {
	const layout = ParseResourceLayout(stream)
	if (layout === undefined) throw "Mesh without resource layout"
	return ParseEmbeddedMesh(layout[0].get("DATA"), layout[0].get("VBIB"))
}
