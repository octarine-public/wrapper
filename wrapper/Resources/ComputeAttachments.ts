import Matrix4x4 from "../Base/Matrix4x4"
import Vector3 from "../Base/Vector3"
import Workers from "../Native/Workers"
import FileBinaryStream from "../Utils/FileBinaryStream"
import { CAnimationFrame } from "./ParseAnimation"
import { CMeshAttachment } from "./ParseMesh"
import { CModel, ParseModel } from "./ParseModel"
import { CBone, CSkeleton } from "./Skeleton"

export class ComputedAttachment {
	public readonly PositionsCompressed: Float32Array
	constructor(
		public readonly FPS: number,
		public readonly FrameCount: number,
	) {
		// using SharedArrayBuffer here makes 0-copy transfer while doing async stuff
		this.PositionsCompressed = new Float32Array(new SharedArrayBuffer(FrameCount * 3 * 4))
	}
	public SetPosition(frameNum: number, pos: Vector3): void {
		const start = frameNum * 3
		this.PositionsCompressed.set(pos.toArray(), start)
	}
	public GetPositionAtFrame(frameNum: number): Vector3 {
		const start = frameNum * 3
		return new Vector3(
			this.PositionsCompressed[start + 0],
			this.PositionsCompressed[start + 1],
			this.PositionsCompressed[start + 2],
		)
	}
	public GetPosition(time: number, angle: number, model_scale: number): Vector3 {
		while (time < 0)
			time += this.FrameCount / this.FPS
		const frameCur = Math.floor(time * this.FPS) % this.FrameCount
		const frameNext = (frameCur + 1) % this.FrameCount
		const frame1 = this.GetPositionAtFrame(frameCur),
			frame2 = this.GetPositionAtFrame(frameNext)
		return frame2.SubtractForThis(frame1).MultiplyScalarForThis(
			((time * this.FPS) - frameCur) % 1,
		).AddForThis(frame1).Rotated(angle).MultiplyScalarForThis(model_scale)
	}
}
export type ComputedAttachments = [Map<string, number>, Map<string, ComputedAttachment>][]

function ComputeBoneInverseBindPose(
	bone: CBone,
	skeleton: CSkeleton,
	frame?: CAnimationFrame,
): Matrix4x4 {
	const invBindPose = bone.Parent !== undefined
		? ComputeBoneInverseBindPose(bone.Parent, skeleton, frame)
		: Matrix4x4.Identity
	if (frame !== undefined)
		invBindPose.Multiply(frame.GetBoneInverseBindPose(bone.Name))
	else
		invBindPose.Multiply(bone.InverseBindPose)
	return invBindPose
}

function ComputeAttachmentPosition(
	skeleton: CSkeleton,
	attachmentData: CMeshAttachment,
	attachment: ComputedAttachment,
	frameNum = 0,
	frame?: CAnimationFrame,
): void {
	let bindPose = attachmentData.InfluenceBindPoses[0]?.Clone()
	if (bindPose === undefined)
		bindPose = Matrix4x4.Identity
	const bone = skeleton.Bones.get(attachmentData.InfluenceNames[0] ?? "")
	if (bone !== undefined)
		bindPose.Multiply(ComputeBoneInverseBindPose(bone, skeleton, frame).Invert())
	attachment.SetPosition(frameNum, bindPose.Translation)
}

export function ComputeAttachmentsAndBounds(model_name: string): [ComputedAttachments, Vector3, Vector3] {
	const ar: ComputedAttachments = []
	if (model_name.length === 0)
		return [ar, new Vector3(), new Vector3()]
	if (!model_name.endsWith("_c"))
		model_name += "_c"
	const buf = fopen(model_name)
	if (buf === undefined)
		return [ar, new Vector3(), new Vector3()]
	let model: CModel
	try {
		model = ParseModel(new FileBinaryStream(buf))
	} finally {
		buf.close()
	}
	try {
		const mesh = model.Meshes[0]
		if (mesh === undefined)
			return [ar, new Vector3(), new Vector3()]
		const skeleton = model.Skeletons[0]
		if (skeleton === undefined)
			return [ar, model.MinBounds, model.MaxBounds]
		model.Animations.forEach(anim => {
			if (
				(anim.Activities.length === 0 && anim.Movements.length === 0)
				|| anim.Name.includes("showcase") // workaround for radiant towers
			)
				return
			const attachments = new Map<string, ComputedAttachment>()
			mesh.Attachments.forEach(mesh_attachment => attachments.set(
				mesh_attachment.Name,
				new ComputedAttachment(
					anim.FPS,
					anim.FrameCount,
				),
			))
			for (let i = 0; i < anim.FrameCount; i++) {
				const frame = anim.ReadFrame(i)
				attachments.forEach((attachment, name) => ComputeAttachmentPosition(
					skeleton,
					mesh.Attachments.get(name)!,
					attachment,
					i,
					frame,
				))
			}
			const activity2weight = new Map(anim.Activities.map(activity => [activity.Name, activity.Weight]))
			if (anim.Movements.length !== 0 && !activity2weight.has("ACT_DOTA_RUN"))
				activity2weight.set("ACT_DOTA_RUN", Number.EPSILON)
			ar.push([activity2weight, attachments])
		})
		if (!ar.some(el => el[0].has("ACT_DOTA_CONSTANT_LAYER"))) {
			const empty_attachments = new Map<string, ComputedAttachment>()
			mesh.Attachments.forEach(mesh_attachment => {
				const attachment = new ComputedAttachment(1, 1)
				ComputeAttachmentPosition(
					skeleton,
					mesh_attachment,
					attachment,
				)
				empty_attachments.set(mesh_attachment.Name, attachment)
			})
			ar.push([new Map([["ACT_DOTA_CONSTANT_LAYER", 1]]), empty_attachments])
		}
		return [ar, model.MinBounds, model.MaxBounds]
	} finally {
		model.FilesOpen.forEach(file => file.close())
	}
}

Workers.RegisterRPCEndPoint("ComputeAttachmentsAndBounds", data => {
	if (typeof data !== "string")
		throw "Data should be a string"
	const res = ComputeAttachmentsAndBounds(data)
	const serialized_ar: [[string, number][], [ArrayBuffer, string, number, number][]][] = []
	res[0].forEach(anim => serialized_ar.push([
		[...anim[0].entries()],
		[...anim[1].entries()].map(([name, el]) => [
			el.PositionsCompressed.buffer,
			name,
			el.FPS,
			el.FrameCount,
		] as [ArrayBuffer, string, number, number]),
	]))
	return [serialized_ar, res[1].toArray(), res[2].toArray()]
})

export async function ComputeAttachmentsAndBoundsAsync(
	model_name: string,
): Promise<[ComputedAttachments, Vector3, Vector3]> {
	const data = await Workers.CallRPCEndPoint(
		"ComputeAttachmentsAndBounds",
		model_name,
	)
	if (!Array.isArray(data))
		throw "!Array.isArray(data)"
	const serialized_ar = data[0],
		MinBounds = data[1],
		MaxBounds = data[2]
	if (!Array.isArray(serialized_ar))
		throw "!Array.isArray(serialized_ar)"
	if (!Array.isArray(MinBounds))
		throw "!Array.isArray(MinBounds)"
	if (!Array.isArray(MaxBounds))
		throw "!Array.isArray(MaxBounds)"
	const ar: ComputedAttachments = []
	serialized_ar.forEach(anim => {
		if (!Array.isArray(anim))
			throw "!Array.isArray(anim)"
		const activities = anim[0] as [string, number][]
		if (!Array.isArray(activities))
			throw "!Array.isArray(activities)"
		const attachments = anim[1] as [ArrayBuffer, string, number, number][]
		if (!Array.isArray(attachments))
			throw "!Array.isArray(attachments)"
		const deserialized_map = new Map<string, ComputedAttachment>()
		attachments.forEach(([buf, name, fps, frame_count]) => {
			const attachment = new ComputedAttachment(
				fps,
				frame_count,
			)
			attachment.PositionsCompressed.set(new Float32Array(buf))
			deserialized_map.set(name, attachment)
		})
		ar.push([new Map(activities), deserialized_map])
	})
	return [
		ar,
		Vector3.fromArray(MinBounds as number[]),
		Vector3.fromArray(MaxBounds as number[]),
	]
}
