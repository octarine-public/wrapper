import Matrix4x4 from "../Base/Matrix4x4"
import Vector3 from "../Base/Vector3"
import Vector4 from "../Base/Vector4"
import { GameActivity_t } from "../Enums/GameActivity_t"
import { CAnimationFrame } from "./ParseAnimation"
import { CMeshAttachment } from "./ParseMesh"
import { ParseModel } from "./ParseModel"
import { CSkeleton } from "./Skeleton"

export class ComputedAttachment {
	private readonly MatrixesCompressed: Float32Array
	constructor(
		public readonly Name: string,
		public readonly FPS: number,
		public readonly FrameCount: number,
	) {
		this.MatrixesCompressed = new Float32Array(FrameCount * 4 * 16)
	}
	public SetMatrix(frameNum: number, mat: Matrix4x4): void {
		const start = frameNum * 4 * 16
		this.MatrixesCompressed.set(mat.toArray(), start)
	}
	public GetMatrix(frameNum: number): Matrix4x4 {
		const start = frameNum * 4 * 16
		return new Matrix4x4(this.MatrixesCompressed.subarray(start, start + 4 * 16))
	}
	public GetPosition(real_time: number, angle: number): Vector3 {
		const anim_time = real_time % (this.FrameCount / this.FPS)
		const frameNum = Math.floor(anim_time * this.FPS)
		const frameNext = frameNum !== this.FrameCount - 1
			? frameNum + 1
			: 0
		const frame1 = this.GetMatrix(frameNum).Decompose().Position.Rotated(angle),
			frame2 = this.GetMatrix(frameNext).Decompose().Position.Rotated(angle)
		return frame1.AddForThis(frame2.Subtract(frame1).MultiplyScalarForThis(
			(anim_time * this.FPS) % 1,
		))
	}
}
export type ComputedAttachments = Map<GameActivity_t, ComputedAttachment[]>

function ComputeBoneMatrix(
	name: string,
	skeleton: CSkeleton,
	frame?: CAnimationFrame,
): Nullable<Matrix4x4> {
	const bone = skeleton.Bones.find(bone_ => bone_.Name === name)
	if (bone === undefined)
		return undefined
	let parent_mat = Matrix4x4.Identity
	if (bone.Parent !== undefined)
		parent_mat = ComputeBoneMatrix(bone.Parent.Name, skeleton, frame)!
	const frame_pos = frame?.BonesPositions?.get(name)
	const frame_ang = frame?.BonesAngles?.get(name) ?? new Vector4()
	const transformed = frame_pos !== undefined
		? Matrix4x4.CreateTranslation(frame_pos)
			.Multiply(Matrix4x4.CreateFromVector4(frame_ang))
		: bone.BindPose.Clone()
	transformed.Multiply(parent_mat)
	return transformed
}

function ComputeAttachmentPosition(
	skeleton: CSkeleton,
	attachmentData: CMeshAttachment,
	attachment: ComputedAttachment,
	frameNum = 0,
	frame?: CAnimationFrame,
): void {
	const bone_name = attachmentData.InfluenceNames[0] ?? ""
	const bone_offset = attachmentData.InfluenceOffsets[0]
	const bone_rotation = attachmentData.InfluenceRotations[0] ?? new Vector4()
	const bone_mat = ComputeBoneMatrix(bone_name, skeleton, frame) ?? Matrix4x4.Identity
	if (bone_offset !== undefined)
		bone_mat.Multiply(
			Matrix4x4.CreateTranslation(bone_offset)
				.Multiply(Matrix4x4.CreateFromVector4(bone_rotation)),
		)
	attachment.SetMatrix(frameNum, bone_mat)
}

export function ComputeAttachmentsAndBounds(model_name: string): [ComputedAttachments, Vector3, Vector3] {
	const map: ComputedAttachments = new Map()
	if (model_name.length === 0)
		return [map, new Vector3(), new Vector3()]
	if (!model_name.endsWith("_c"))
		model_name += "_c"
	const buf = fread(model_name)
	if (buf === undefined)
		return [map, new Vector3(), new Vector3()]
	const model = ParseModel(buf)
	const mesh = model.RefMeshes[0] ?? model.EmbeddedMeshes[0]
	if (mesh === undefined)
		return [map, new Vector3(), new Vector3()]
	const skeleton = model.Skeletons[0]
	if (skeleton === undefined)
		return [map, model.MinBounds, model.MaxBounds]
	model.Animations.forEach(anim => {
		if (anim.Activities.length === 0)
			return
		const attachments: ComputedAttachment[] = []
		mesh.Attachments.forEach((_, name) => attachments.push(new ComputedAttachment(
			name,
			anim.FPS,
			anim.FrameCount,
		)))
		for (let i = 0; i < anim.FrameCount; i++) {
			const frame = anim.ReadFrame(i)
			attachments.forEach(attachment => ComputeAttachmentPosition(
				skeleton,
				mesh.Attachments.get(attachment.Name)!,
				attachment,
				i,
				frame,
			))
		}
		anim.Activities.forEach(activity => {
			const key = (GameActivity_t as any)[activity.Name]
			if (key !== undefined)
				map.set(key, attachments)
		})
	})
	if (!map.has(GameActivity_t.ACT_DOTA_IDLE)) {
		const empty_attachments: ComputedAttachment[] = []
		mesh.Attachments.forEach((attachmentData, name) => {
			const attachment = new ComputedAttachment(name, 1, 1)
			ComputeAttachmentPosition(
				skeleton,
				attachmentData,
				attachment,
			)
			empty_attachments.push(attachment)
		})
		map.set(GameActivity_t.ACT_DOTA_IDLE, empty_attachments)
	}
	return [map, model.MinBounds, model.MaxBounds]
}
