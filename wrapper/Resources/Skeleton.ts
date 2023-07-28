import { Vector3 } from "../Base/Vector3"
import { Vector4 } from "../Base/Vector4"
import { HasBit } from "../Utils/BitsExtensions"
import {
	MapToNumberArray,
	MapToQuaternionArray,
	MapToStringArray,
	MapToVector3Array
} from "./ParseUtils"

export class CBone {
	public Parent: Nullable<CBone>
	constructor(
		public readonly Name: string,
		public readonly SkinIndices: number[],
		public readonly Position: Vector3,
		public readonly Angle: Vector4
	) {}
	public SetParent(parent: CBone): void {
		this.Parent = parent
	}
}

export class CSkeleton {
	public readonly Bones = new Map<string, CBone>()
	public readonly Roots: CBone[] = []
	public readonly AnimationTextureSize: number
	constructor(modelSkeleton: RecursiveMap, remapTable: Map<number, number[]>) {
		const boneNamesMap = modelSkeleton.get("m_boneName")
		if (!(boneNamesMap instanceof Map || Array.isArray(boneNamesMap)))
			throw "Skeleton without boneNames"
		const boneNames = MapToStringArray(boneNamesMap)
		const boneParentsMap = modelSkeleton.get("m_nParent")
		if (!(boneParentsMap instanceof Map || Array.isArray(boneParentsMap)))
			throw "Skeleton without boneParents"
		const boneParents = MapToNumberArray(boneParentsMap)
		const boneFlagsMap = modelSkeleton.get("m_nFlag")
		if (!(boneFlagsMap instanceof Map || Array.isArray(boneFlagsMap)))
			throw "Skeleton without boneFlags"
		const boneFlags = MapToNumberArray(boneFlagsMap)
		const bonePositionsMap = modelSkeleton.get("m_bonePosParent")
		if (!(bonePositionsMap instanceof Map || Array.isArray(bonePositionsMap)))
			throw "Skeleton without bonePositions"
		const bonePositions = MapToVector3Array(bonePositionsMap)
		const boneRotationsMap = modelSkeleton.get("m_boneRotParent")
		if (!(boneRotationsMap instanceof Map || Array.isArray(boneRotationsMap)))
			throw "Skeleton without boneRotations"
		const boneRotations = MapToQuaternionArray(boneRotationsMap)

		this.AnimationTextureSize =
			boneNames.length !== 0 && remapTable.size !== 0
				? this.ComputeAnimationTextureSize(remapTable)
				: 0

		for (let i = 0; i < boneNames.length; i++) {
			if (!HasBit(boneFlags[i], 10)) continue
			const bone = new CBone(
				boneNames[i] ?? "",
				remapTable.get(i) ?? [],
				bonePositions[i] ?? new Vector3(),
				boneRotations[i] ?? new Vector4(0, 0, 0, 1)
			)
			this.Bones.set(bone.Name, bone)
		}
		for (let i = 0; i < boneNames.length; i++) {
			if (boneParents[i] === -1 || !HasBit(boneFlags[i], 10)) continue
			const childName = boneNames[i]
			const parentName = boneNames[boneParents[i]]
			if (childName === undefined || parentName === undefined) continue
			const child = this.Bones.get(childName),
				parent = this.Bones.get(parentName)
			if (child === undefined || parent === undefined) continue
			child.SetParent(parent)
		}
		this.FindRoots()
	}
	private ComputeAnimationTextureSize(
		remapTable: Map<number, number[]>
	): number {
		let max = 0
		remapTable.forEach(ar => (max = ar.reduce((a, b) => Math.max(a, b), max)))
		return max + 1
	}
	private FindRoots(): void {
		this.Bones.forEach(bone => {
			if (bone.Parent === undefined) this.Roots.push(bone)
		})
	}
}
