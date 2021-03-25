import { CAnimation, ParseAnimationGroup, ParseEmbeddedAnimation } from "./ParseAnimation"
import { parseKV, parseKVBlock } from "./ParseKV"
import { CMesh, ParseEmbeddedMesh, ParseMesh } from "./ParseMesh"
import { ParseResourceLayout } from "./ParseResource"
import { GetMapNumberProperty, GetMapStringProperty, MapToNumberArray } from "./ParseUtils"
import { CSkeleton } from "./Skeleton"

export class CModel {
	public readonly RefMeshes: CMesh[] = []
	public readonly EmbeddedMeshes: CMesh[] = []
	public readonly Animations: CAnimation[] = []
	public readonly MeshGroups: string[] = []
	public readonly MeshGroupsMasks: number[] = []
	public readonly DefaultMeshGroupsMask: number
	public readonly DefaultSkinMaterials: string[] = []
	public readonly LODGroupMasks: number[] = []
	public readonly SkinMaterials = new Map<string, Map<string, string>>()
	public readonly Skeletons: CSkeleton[] = []
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
		this.LoadRefAnimations(kv)

		const CTRL = parseKVBlock(layout[0].get("CTRL")) ?? new Map()
		this.LoadEmbeddedMeshes(CTRL, layout[1])
		this.LoadEmbeddedAnimation(CTRL, layout[1])
	}

	private LoadSkeletons(kv: RecursiveMap): void {
		const modelSkeleton = kv.get("m_modelSkeleton")
		if (!(modelSkeleton instanceof Map))
			return
		const remappingTableMap = kv.get("m_remappingTable")
		if (!(remappingTableMap instanceof Map))
			return
		const remappingTableStartsMap = kv.get("m_remappingTableStarts")
		if (!(remappingTableStartsMap instanceof Map))
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
		if (!(MeshGroups instanceof Map))
			return
		MeshGroups.forEach(group => {
			if (typeof group === "string")
				this.MeshGroups.push(group)
		})
	}
	private LoadMeshGroupsMasks(kv: RecursiveMap): void {
		const MeshGroupMasks = kv.get("m_refMeshGroupMasks")
		if (!(MeshGroupMasks instanceof Map))
			return
		this.MeshGroupsMasks.push(...MapToNumberArray(MeshGroupMasks))
	}
	private LoadLODGroupMasks(kv: RecursiveMap): number {
		const LODGroupMasks = kv.get("m_refLODGroupMasks")
		if (!(LODGroupMasks instanceof Map))
			return 0
		this.LODGroupMasks.push(...MapToNumberArray(LODGroupMasks))
		return GetMapNumberProperty(kv, "m_nDefaultMeshGroupMask")
	}
	private LoadMaterialGroups(kv: RecursiveMap): void {
		const m_materialGroups = kv.get("m_materialGroups")
		if (!(m_materialGroups instanceof Map))
			return
		m_materialGroups.forEach(group => {
			if (!(group instanceof Map))
				return
			const materials = group.get("m_materials")
			const materials_ar: string[] = []
			if (materials instanceof Map)
				materials.forEach(material => {
					if (typeof material === "string")
						materials_ar.push(material)
				})
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
		if (!(refMeshes instanceof Map))
			return
		refMeshes.forEach(mesh_path => {
			if (typeof mesh_path !== "string")
				return
			if (!mesh_path.endsWith("_c"))
				mesh_path += "_c"
			const buf = fread(mesh_path)
			if (buf !== undefined)
				this.RefMeshes.push(ParseMesh(new Uint8Array(buf)))
		})
	}
	private LoadEmbeddedMeshes(kv: RecursiveMap, blocks: Uint8Array[]): void {
		const embedded_meshes = kv.get("embedded_meshes")
		if (!(embedded_meshes instanceof Map))
			return
		embedded_meshes.forEach(embedded_mesh => {
			if (!(embedded_mesh instanceof Map))
				return
			const data_block = GetMapNumberProperty(embedded_mesh, "data_block"),
				vbib_block = GetMapNumberProperty(embedded_mesh, "vbib_block")
			this.EmbeddedMeshes.push(ParseEmbeddedMesh(blocks[data_block], blocks[vbib_block]))
		})
	}
	private LoadRefAnimations(kv: RecursiveMap): void {
		const refAnimGroups = kv.get("m_refAnimGroups")
		if (!(refAnimGroups instanceof Map))
			return
		refAnimGroups.forEach(animation_group_path => {
			if (typeof animation_group_path !== "string")
				return
			if (!animation_group_path.endsWith("_c"))
				animation_group_path += "_c"
			const buf = fread(animation_group_path)
			if (buf !== undefined)
				this.Animations.push(...ParseAnimationGroup(new Uint8Array(buf)))
		})
	}
	private LoadEmbeddedAnimation(kv: RecursiveMap, blocks: Uint8Array[]): void {
		const embedded_animation = kv.get("embedded_animation")
		if (!(embedded_animation instanceof Map))
			return
		const group_data_block = GetMapNumberProperty(embedded_animation, "group_data_block"),
			anim_data_block = GetMapNumberProperty(embedded_animation, "anim_data_block")
		this.Animations.push(...ParseEmbeddedAnimation(blocks[group_data_block], blocks[anim_data_block]))
	}
}

export function ParseModel(buf: Uint8Array): CModel {
	return new CModel(buf)
}
