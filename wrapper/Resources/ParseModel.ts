import { Vector3 } from "../Base/Vector3"
import { FileBinaryStream } from "../Utils/FileBinaryStream"
import {
	CAnimation,
	ParseAnimationGroup,
	ParseEmbeddedAnimation,
} from "./ParseAnimation"
import { CMesh, ParseEmbeddedMesh, ParseMesh } from "./ParseMesh"
import { ParseResourceLayout } from "./ParseResource"
import {
	GetMapNumberProperty,
	GetMapStringProperty,
	MapToNumberArray,
	MapToStringArray,
} from "./ParseUtils"
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
	public readonly FilesOpen: FileStream[] = []
	constructor(stream: ReadableBinaryStream) {
		const layout = ParseResourceLayout(stream)
		if (layout === undefined) throw "Model without resource format"
		const kv = stream.ParseKV()
		if (kv.size === 0) throw "Model without data"
		this.LoadSkeletons(kv)
		this.LoadMeshGroups(kv)
		this.LoadMeshGroupsMasks(kv)
		this.DefaultMeshGroupsMask = this.LoadLODGroupMasks(kv)
		this.LoadMaterialGroups(kv)
		this.LoadRefMeshes(kv)
		this.LoadRefAnimations(kv)

		const ctrl = layout[0].get("CTRL")?.ParseKVBlock() ?? new Map()
		this.LoadEmbeddedMeshes(ctrl, layout[1])
		this.LoadEmbeddedAnimation(
			ctrl,
			layout[1],
			layout[0].get("ASEQ")?.ParseKVBlock() ?? new Map()
		)

		const firstMesh = this.Meshes[0]
		if (firstMesh !== undefined) {
			this.MinBounds.CopyFrom(firstMesh.MinBounds)
			this.MaxBounds.CopyFrom(firstMesh.MaxBounds)
		}
	}

	private LoadSkeletons(kv: RecursiveMap): void {
		const modelSkeleton = kv.get("m_modelSkeleton")
		if (!(modelSkeleton instanceof Map)) return
		const remappingTableMap = kv.get("m_remappingTable")
		if (!(remappingTableMap instanceof Map || Array.isArray(remappingTableMap)))
			return
		const remappingTableStartsMap = kv.get("m_remappingTableStarts")
		if (
			!(
				remappingTableStartsMap instanceof Map ||
				Array.isArray(remappingTableStartsMap)
			)
		)
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
		const meshGroups = kv.get("m_meshGroups")
		if (meshGroups instanceof Map || Array.isArray(meshGroups))
			this.MeshGroups.push(...MapToStringArray(meshGroups))
	}
	private LoadMeshGroupsMasks(kv: RecursiveMap): void {
		const meshGroupMasks = kv.get("m_refMeshGroupMasks")
		if (meshGroupMasks instanceof Map || Array.isArray(meshGroupMasks))
			this.MeshGroupsMasks.push(...MapToNumberArray(meshGroupMasks))
	}
	private LoadLODGroupMasks(kv: RecursiveMap): number {
		const lodGroupMasks = kv.get("m_refLODGroupMasks")
		if (!(lodGroupMasks instanceof Map || Array.isArray(lodGroupMasks)))
			return 0
		this.LODGroupMasks.push(...MapToNumberArray(lodGroupMasks))
		return GetMapNumberProperty(kv, "m_nDefaultMeshGroupMask")
	}
	private LoadMaterialGroups(kv: RecursiveMap): void {
		const materialGroups = kv.get("m_materialGroups")
		if (!(materialGroups instanceof Map || Array.isArray(materialGroups)))
			return
		materialGroups.forEach((group: RecursiveMapValue) => {
			if (!(group instanceof Map)) return
			const materials = group.get("m_materials")
			const materialsAr =
				materials instanceof Map || Array.isArray(materials)
					? MapToStringArray(materials)
					: []
			if (this.DefaultSkinMaterials.length === 0) {
				materialsAr.forEach(material =>
					this.DefaultSkinMaterials.push(material)
				)
				return
			}
			const groupName = GetMapStringProperty(group, "m_name")
			const map = new Map<string, string>()
			this.SkinMaterials.set(groupName, map)
			this.DefaultSkinMaterials.forEach((defaultMat, i) => {
				if (i > materialsAr.length) return
				map.set(defaultMat, materialsAr[i])
			})
		})
	}
	private LoadRefMeshes(kv: RecursiveMap): void {
		const refMeshes = kv.get("m_refMeshes")
		if (refMeshes instanceof Map || Array.isArray(refMeshes))
			refMeshes.forEach((meshPath: RecursiveMapValue) => {
				if (typeof meshPath !== "string") return
				if (!meshPath.endsWith("_c")) meshPath += "_c"
				const buf = fopen(meshPath)
				if (buf !== undefined) {
					this.FilesOpen.push(buf)
					this.Meshes.push(ParseMesh(new FileBinaryStream(buf)))
				}
			})
	}
	private LoadEmbeddedMeshes(
		kv: RecursiveMap,
		blocks: ReadableBinaryStream[]
	): void {
		const embeddedMeshes = kv.get("embedded_meshes")
		if (!(embeddedMeshes instanceof Map || Array.isArray(embeddedMeshes)))
			return
		embeddedMeshes.forEach((embeddedMesh: RecursiveMapValue) => {
			if (!(embeddedMesh instanceof Map)) return
			const dataBlock = GetMapNumberProperty(embeddedMesh, "data_block"),
				vbibBlock = GetMapNumberProperty(embeddedMesh, "vbib_block")
			this.Meshes.push(ParseEmbeddedMesh(blocks[dataBlock], blocks[vbibBlock]))
		})
	}
	private LoadRefAnimations(kv: RecursiveMap): void {
		const refAnimGroups = kv.get("m_refAnimGroups")
		if (refAnimGroups instanceof Map || Array.isArray(refAnimGroups))
			refAnimGroups.forEach((animationGroupPath: RecursiveMapValue) => {
				if (typeof animationGroupPath !== "string") return
				if (!animationGroupPath.endsWith("_c")) animationGroupPath += "_c"
				const buf = fopen(animationGroupPath)
				if (buf !== undefined)
					try {
						this.Animations.push(
							...ParseAnimationGroup(new FileBinaryStream(buf))
						)
					} finally {
						buf.close()
					}
			})
	}
	private LoadEmbeddedAnimation(
		kv: RecursiveMap,
		blocks: ReadableBinaryStream[],
		hseq: RecursiveMap
	): void {
		const embeddedAnimation = kv.get("embedded_animation")
		if (!(embeddedAnimation instanceof Map)) return
		const groupDataBlock = GetMapNumberProperty(
				embeddedAnimation,
				"group_data_block"
			),
			animDataBlock = GetMapNumberProperty(embeddedAnimation, "anim_data_block")
		this.Animations.push(
			...ParseEmbeddedAnimation(
				blocks[groupDataBlock],
				blocks[animDataBlock],
				hseq
			)
		)
	}
}

export function ParseModel(stream: ReadableBinaryStream): CModel {
	return new CModel(stream)
}
