import Vector3 from "../Base/Vector3"
import { CAnimation } from "./ParseAnimation"
import { parseKV, parseKVBlock } from "./ParseKV"
import { CMesh, ParseEmbeddedMesh, ParseMesh } from "./ParseMesh"
import { ParseResourceLayout } from "./ParseResource"
import { GetMapNumberProperty, GetMapStringProperty, MapToNumberArray, MapToStringArray } from "./ParseUtils"
import { CSkeleton } from "./Skeleton"

export class CModel {
	public readonly Meshes: CMesh[] = []
	public readonly Animations: CAnimation[] = []
	public readonly MeshGroups: string[] = []
	public readonly MeshGroupsMasks: number[] = []
	public readonly DefaultMeshGroupsMask: number
	public readonly DefaultSkinMaterials: string[] = []
	public readonly LODGroupMasks: number[] = []
	public readonly SkinMaterials = new Map<string, Map<string, string>>()
	public readonly Skeletons: CSkeleton[] = []
	public readonly MinBounds = new Vector3()
	public readonly MaxBounds = new Vector3()
	constructor(buf: Uint8Array) {
		const layout = ParseResourceLayout(buf)
		if (layout === undefined)
			throw "Model without resource format"
		const kv = parseKV(buf)
		if (kv.size === 0)
			throw "Model without data"
		this.LoadSkeletons(kv)
		this.LoadMeshGroups(kv)
		this.LoadMeshGroupsMasks(kv)
		this.DefaultMeshGroupsMask = this.LoadLODGroupMasks(kv)
		this.LoadMaterialGroups(kv)
		this.LoadRefMeshes(kv)
		// this.LoadRefAnimations(kv)

		const CTRL = parseKVBlock(layout[0].get("CTRL")) ?? new Map()
		this.LoadEmbeddedMeshes(CTRL, layout[1])
		// this.LoadEmbeddedAnimation(CTRL, layout[1])

		const first_mesh = this.Meshes[0]
		if (first_mesh !== undefined) {
			this.MinBounds.CopyFrom(first_mesh.MinBounds)
			this.MaxBounds.CopyFrom(first_mesh.MaxBounds)
		}
	}

	private LoadSkeletons(kv: RecursiveMap): void {
		const modelSkeleton = kv.get("m_modelSkeleton")
		if (!(modelSkeleton instanceof Map))
			return
		const remappingTableMap = kv.get("m_remappingTable")
		if (!(remappingTableMap instanceof Map || Array.isArray(remappingTableMap)))
			return
		const remappingTableStartsMap = kv.get("m_remappingTableStarts")
		if (!(remappingTableStartsMap instanceof Map || Array.isArray(remappingTableStartsMap)))
			return
		const remappingTable = MapToNumberArray(remappingTableMap),
			remappingTableStarts = MapToNumberArray(remappingTableStartsMap)
		remappingTableStarts.forEach((start, i) => {
			const end = remappingTableStarts[i + 1] ?? remappingTable.length
			const mapTable = remappingTable.slice(start, end)
			const invMapTable = new Map<number, number[]>()
			mapTable.forEach((val, key) => {
				let ar = invMapTable.get(val)
				if (ar === undefined) {
					ar = []
					invMapTable.set(val, ar)
				}
				ar.push(key)
			})
			this.Skeletons.push(new CSkeleton(modelSkeleton, invMapTable))
		})
	}
	private LoadMeshGroups(kv: RecursiveMap): void {
		const MeshGroups = kv.get("m_meshGroups")
		if (MeshGroups instanceof Map || Array.isArray(MeshGroups))
			this.MeshGroups.push(...MapToStringArray(MeshGroups))
	}
	private LoadMeshGroupsMasks(kv: RecursiveMap): void {
		const MeshGroups = kv.get("m_refMeshGroupMasks")
		if (MeshGroups instanceof Map || Array.isArray(MeshGroups))
			this.MeshGroupsMasks.push(...MapToNumberArray(MeshGroups))
	}
	private LoadLODGroupMasks(kv: RecursiveMap): number {
		const LODGroupMasks = kv.get("m_refLODGroupMasks")
		if (!(LODGroupMasks instanceof Map || Array.isArray(LODGroupMasks)))
			return 0
		this.LODGroupMasks.push(...MapToNumberArray(LODGroupMasks))
		return GetMapNumberProperty(kv, "m_nDefaultMeshGroupMask")
	}
	private LoadMaterialGroups(kv: RecursiveMap): void {
		const m_materialGroups = kv.get("m_materialGroups")
		if (!(m_materialGroups instanceof Map || Array.isArray(m_materialGroups)))
			return
		m_materialGroups.forEach((group: RecursiveMapValue) => {
			if (!(group instanceof Map))
				return
			const materials = group.get("m_materials")
			const materials_ar = materials instanceof Map || Array.isArray(materials)
				? MapToStringArray(materials)
				: []
			if (this.DefaultSkinMaterials.length === 0) {
				materials_ar.forEach(material => this.DefaultSkinMaterials.push(material))
				return
			}
			const group_name = GetMapStringProperty(group, "m_name")
			const map = new Map<string, string>()
			this.SkinMaterials.set(group_name, map)
			this.DefaultSkinMaterials.forEach((default_mat, i) => {
				if (i > materials_ar.length)
					return
				map.set(default_mat, materials_ar[i])
			})
		})
	}
	private LoadRefMeshes(kv: RecursiveMap): void {
		const refMeshes = kv.get("m_refMeshes")
		if (refMeshes instanceof Map || Array.isArray(refMeshes))
			refMeshes.forEach((mesh_path: RecursiveMapValue) => {
				if (typeof mesh_path !== "string")
					return
				if (!mesh_path.endsWith("_c"))
					mesh_path += "_c"
				const buf = fread(mesh_path)
				if (buf !== undefined)
					this.Meshes.push(ParseMesh(buf))
			})
	}
	private LoadEmbeddedMeshes(kv: RecursiveMap, blocks: Uint8Array[]): void {
		const embedded_meshes = kv.get("embedded_meshes")
		if (!(embedded_meshes instanceof Map || Array.isArray(embedded_meshes)))
			return
		embedded_meshes.forEach((embedded_mesh: RecursiveMapValue) => {
			if (!(embedded_mesh instanceof Map))
				return
			const data_block = GetMapNumberProperty(embedded_mesh, "data_block"),
				vbib_block = GetMapNumberProperty(embedded_mesh, "vbib_block")
			this.Meshes.push(ParseEmbeddedMesh(blocks[data_block], blocks[vbib_block]))
		})
	}
	// private LoadRefAnimations(kv: RecursiveMap): void {
	// 	const refAnimGroups = kv.get("m_refAnimGroups")
	// 	if (refAnimGroups instanceof Map || Array.isArray(refAnimGroups))
	// 		refAnimGroups.forEach((animation_group_path: RecursiveMapValue) => {
	// 			if (typeof animation_group_path !== "string")
	// 				return
	// 			if (!animation_group_path.endsWith("_c"))
	// 				animation_group_path += "_c"
	// 			const buf = fread(animation_group_path)
	// 			if (buf !== undefined)
	// 				this.Animations.push(...ParseAnimationGroup(buf))
	// 		})
	// }
	// private LoadEmbeddedAnimation(kv: RecursiveMap, blocks: Uint8Array[]): void {
	// 	const embedded_animation = kv.get("embedded_animation")
	// 	if (!(embedded_animation instanceof Map))
	// 		return
	// 	const group_data_block = GetMapNumberProperty(embedded_animation, "group_data_block"),
	// 		anim_data_block = GetMapNumberProperty(embedded_animation, "anim_data_block")
	// 	this.Animations.push(...ParseEmbeddedAnimation(blocks[group_data_block], blocks[anim_data_block]))
	// }
}

export function ParseModel(buf: Uint8Array): CModel {
	return new CModel(buf)
}
