import Vector3 from "../Base/Vector3"
import Vector4 from "../Base/Vector4"
import { parseKVBlock } from "./ParseKV"
import { ParseResourceLayout } from "./ParseResource"
import { GetMapNumberProperty, GetMapStringProperty, MapToVector3, MapToVector4 } from "./ParseUtils"

export class CMeshAttachment {
	public readonly Name: string
	public readonly InfluenceNames: string[] = []
	public readonly InfluenceOffsets: Vector3[] = []
	public readonly InfluenceRotations: Vector4[] = []
	public readonly InfluenceWeights: number[] = []
	public readonly InfluenceRootTransforms: boolean[] = []
	public readonly IgnoreRotation: boolean
	constructor(kv: RecursiveMap) {
		this.Name = GetMapStringProperty(kv, "m_name")
		this.LoadInfluenceNames(kv)
		this.LoadInfluenceOffsets(kv)
		this.LoadInfluenceRotations(kv)
		this.LoadInfluenceWeights(kv)
		this.LoadInfluenceRootTransforms(kv)

		const Influences = GetMapNumberProperty(kv, "m_nInfluences")
		this.InfluenceNames = this.InfluenceNames.slice(0, Influences)
		this.InfluenceOffsets = this.InfluenceOffsets.slice(0, Influences)
		this.InfluenceRotations = this.InfluenceRotations.slice(0, Influences)
		this.InfluenceWeights = this.InfluenceWeights.slice(0, Influences)
		this.InfluenceRootTransforms = this.InfluenceRootTransforms.slice(0, Influences)

		const m_bIgnoreRotation = kv.get("m_bIgnoreRotation")
		this.IgnoreRotation = typeof m_bIgnoreRotation === "boolean"
			? m_bIgnoreRotation
			: false
	}

	private LoadInfluenceNames(kv: RecursiveMap): void {
		const influenceNames = kv.get("m_influenceNames")
		if (!(influenceNames instanceof Map))
			return
		influenceNames.forEach(name => {
			if (typeof name === "string")
				this.InfluenceNames.push(name)
		})
	}
	private LoadInfluenceOffsets(kv: RecursiveMap): void {
		const influenceOffsets = kv.get("m_vInfluenceOffsets")
		if (!(influenceOffsets instanceof Map))
			return
		influenceOffsets.forEach(offset => {
			if (offset instanceof Map)
				this.InfluenceOffsets.push(MapToVector3(offset))
		})
	}
	private LoadInfluenceRotations(kv: RecursiveMap): void {
		const influenceRotations = kv.get("m_vInfluenceRotations")
		if (!(influenceRotations instanceof Map))
			return
		influenceRotations.forEach(rotation => {
			if (rotation instanceof Map)
				this.InfluenceRotations.push(MapToVector4(rotation))
		})
	}
	private LoadInfluenceWeights(kv: RecursiveMap): void {
		const influenceWeights = kv.get("m_influenceWeights")
		if (!(influenceWeights instanceof Map))
			return
		influenceWeights.forEach(weight => {
			if (typeof weight === "number")
				this.InfluenceWeights.push(weight)
		})
	}
	private LoadInfluenceRootTransforms(kv: RecursiveMap): void {
		const influenceRootTransforms = kv.get("m_bInfluenceRootTransform")
		if (!(influenceRootTransforms instanceof Map))
			return
		influenceRootTransforms.forEach(rootTransform => {
			if (typeof rootTransform === "boolean")
				this.InfluenceRootTransforms.push(rootTransform)
		})
	}
}

export class CMesh {
	public readonly MinBounds: Vector3
	public readonly MaxBounds: Vector3
	public readonly Attachments = new Map<string, CMeshAttachment>()
	constructor(kv: RecursiveMap) {
		const [min, max] = this.ComputeBounds(kv)
		this.MinBounds = min
		this.MaxBounds = max
		this.LoadAttachments(kv)
		// TODO: do we need IsCompressedNormalTangent support without rendering?
	}
	private ComputeBounds(kv: RecursiveMap): [Vector3, Vector3] {
		let min = new Vector3(),
			max = new Vector3()
		const sceneObjects = kv.get("m_sceneObjects")
		if (sceneObjects instanceof Map)
			sceneObjects.forEach(sceneObject => {
				if (!(sceneObject instanceof Map))
					return
				const m_vMinBounds = sceneObject.get("m_vMinBounds"),
					m_vMaxBounds = sceneObject.get("m_vMaxBounds")
				if (m_vMinBounds instanceof Map && m_vMaxBounds instanceof Map) {
					min = MapToVector3(m_vMinBounds).Min(min)
					max = MapToVector3(m_vMaxBounds).Max(max)
				}
			})
		return [min, max]
	}
	private LoadAttachments(kv: RecursiveMap): void {
		const attachments = kv.get("m_attachments")
		if (attachments instanceof Map)
			attachments.forEach(attachment => {
				if (!(attachment instanceof Map))
					return
				const key = attachment.get("key")
				if (typeof key !== "string")
					return
				const value = attachment.get("value")
				if (!(value instanceof Map))
					return
				this.Attachments.set(key, new CMeshAttachment(value))
			})
	}
}

export function ParseEmbeddedMesh(
	data: Nullable<Uint8Array>,
	VBIB: Nullable<Uint8Array>,
): CMesh {
	const kv = parseKVBlock(data)
	if (kv === undefined)
		throw "Mesh without data"
	if (VBIB === undefined)
		throw "Mesh without VBIB"
	// TODO: do we need VBIB support without rendering?
	return new CMesh(kv)
}

export function ParseMesh(buf: Uint8Array): CMesh {
	const layout = ParseResourceLayout(buf)
	if (layout === undefined)
		throw "Mesh without resource layout"
	return ParseEmbeddedMesh(layout[0].get("DATA"), layout[0].get("VBIB"))
}
