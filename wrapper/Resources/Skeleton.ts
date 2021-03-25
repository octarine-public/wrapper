import Matrix4x4 from "../Base/Matrix4x4"
import Vector3 from "../Base/Vector3"
import Vector4 from "../Base/Vector4"
import { HasBit } from "../Utils/BitsExtensions"
import { MapToNumberArray, MapToStringArray, MapToVector3Array, MapToVector4Array } from "./ParseUtils"

export class CBone {
	public Parent: Nullable<CBone>
	public readonly Child: CBone[] = []
	public readonly BindPose: Matrix4x4
	constructor(
		public readonly Name: string,
		public readonly SkinIndices: number[],
		Position: Vector3,
		Angle: Vector4,
	) {
		this.BindPose = Matrix4x4.CreateTranslation(Position)
			.Multiply(Matrix4x4.CreateFromVector4(Angle))
	}
	public SetParent(parent: CBone): void {
		this.Parent = parent
	}
	public AddChild(child: CBone): void {
		this.Child.push(child)
	}
}

export class CSkeleton {
	public readonly Bones: CBone[] = []
	public readonly Roots: CBone[] = []
	public readonly AnimationTextureSize: number
	constructor(modelSkeleton: RecursiveMap, remapTable: Map<number, number[]>) {
		const boneNamesMap = modelSkeleton.get("m_boneName")
		if (!(boneNamesMap instanceof Map))
			throw "Skeleton without boneNames"
		const boneNames = MapToStringArray(boneNamesMap)
		const boneParentsMap = modelSkeleton.get("m_nParent")
		if (!(boneParentsMap instanceof Map))
			throw "Skeleton without boneParents"
		const boneParents = MapToNumberArray(boneParentsMap)
		const boneFlagsMap = modelSkeleton.get("m_nFlag")
		if (!(boneFlagsMap instanceof Map))
			throw "Skeleton without boneFlags"
		const boneFlags = MapToNumberArray(boneFlagsMap)
		const bonePositionsMap = modelSkeleton.get("m_bonePosParent")
		if (!(bonePositionsMap instanceof Map))
			throw "Skeleton without bonePositions"
		const bonePositions = MapToVector3Array(bonePositionsMap)
		const boneRotationsMap = modelSkeleton.get("m_bonePosParent")
		if (!(boneRotationsMap instanceof Map))
			throw "Skeleton without boneRotations"
		const boneRotations = MapToVector4Array(bonePositionsMap)

		this.AnimationTextureSize = boneNames.length !== 0 && remapTable.size !== 0
			? this.ComputeAnimationTextureSize(remapTable)
			: 0

		for (var i = 0; i < boneNames.length; i++) {
			if (!HasBit(boneFlags[i], 10))
				continue
			const bone = new CBone(
				boneNames[i] ?? "",
				remapTable.get(i) ?? [],
				bonePositions[i] ?? new Vector3(),
				boneRotations[i] ?? new Vector4(),
			)
			if (boneParents[i] !== -1) {
				bone.SetParent(this.Bones[boneParents[i]])
				this.Bones[boneParents[i]].AddChild(bone)
			}
			this.Bones.push(bone)
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
