import Matrix4x4 from "../Base/Matrix4x4"
import Vector3 from "../Base/Vector3"
import Vector4 from "../Base/Vector4"
import { HasBit } from "../Utils/BitsExtensions"
import { MapToNumberArray, MapToStringArray, MapToVector3Array, MapToVector4Array } from "./ParseUtils"

export class CBone {
	public Parent: Nullable<CBone>
	public readonly Child: CBone[] = []
	public readonly BindPose: Matrix4x4
	public readonly InverseBindPose: Matrix4x4
	constructor(
		public readonly Name: string,
		public readonly SkinIndices: number[],
		Position: Vector3,
		Angle: Vector4,
	) {
		this.BindPose = Matrix4x4.CreateFromVector4(Angle)
			.Multiply(Matrix4x4.CreateTranslation(Position))
		this.InverseBindPose = this.BindPose.Clone().Invert()
	}
	public get CombinedInverseBindPose(): Matrix4x4 {
		return this.InverseBindPose.Clone().Multiply(this.Parent?.CombinedInverseBindPose ?? Matrix4x4.Identity)
	}
	public SetParent(parent: CBone): void {
		this.Parent = parent
	}
	public AddChild(child: CBone): void {
		this.Child.push(child)
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
		const boneRotations = MapToVector4Array(boneRotationsMap)

		this.AnimationTextureSize = boneNames.length !== 0 && remapTable.size !== 0
			? this.ComputeAnimationTextureSize(remapTable)
			: 0

		for (let i = 0; i < boneNames.length; i++) {
			if (!HasBit(boneFlags[i], 10))
				continue
			const bone = new CBone(
				boneNames[i] ?? "",
				remapTable.get(i) ?? [],
				bonePositions[i] ?? new Vector3(),
				boneRotations[i] ?? new Vector4(),
			)
			this.Bones.set(bone.Name, bone)
		}
		for (let i = 0; i < boneNames.length; i++) {
			if (boneParents[i] === -1 || !HasBit(boneFlags[i], 10))
				continue
			const child_name = boneNames[i]
			const parent_name = boneNames[boneParents[i]]
			if (child_name === undefined || parent_name === undefined)
				continue
			const child = this.Bones.get(child_name),
				parent = this.Bones.get(parent_name)
			if (child === undefined || parent === undefined)
				continue
			child.SetParent(parent)
			parent.AddChild(child)
		}
		this.FindRoots()
	}
	private ComputeAnimationTextureSize(remapTable: Map<number, number[]>): number {
		let max = 0
		remapTable.forEach(ar => max = ar.reduce((a, b) => Math.max(a, b), max))
		return max + 1
	}
	private FindRoots(): void {
		this.Bones.forEach(bone => {
			if (bone.Parent === undefined)
				this.Roots.push(bone)
		})
	}
}
