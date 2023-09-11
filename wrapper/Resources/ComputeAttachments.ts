import { Matrix3x4 } from "../Base/Matrix"
import { Vector3 } from "../Base/Vector3"
import { Workers } from "../Native/Workers"
import { FileBinaryStream } from "../Utils/FileBinaryStream"
import { CAnimationFrame } from "./ParseAnimation"
import { CMeshAttachment } from "./ParseMesh"
import { CModel, ParseModel } from "./ParseModel"
import { CBone, CSkeleton } from "./Skeleton"

export class ComputedAttachment {
	public readonly PositionsCompressed: Float32Array
	constructor(
		public readonly FPS: number,
		public readonly FrameCount: number
	) {
		// using SharedArrayBuffer here makes 0-copy transfer while doing async stuff
		this.PositionsCompressed = new Float32Array(
			new SharedArrayBuffer(FrameCount * 3 * 4)
		)
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
			this.PositionsCompressed[start + 2]
		)
	}
	public GetPosition(time: number, angle: number, modelScale: number): Vector3 {
		while (time < 0) time += this.FrameCount / this.FPS
		const frameCur = Math.floor(time * this.FPS) % this.FrameCount
		const frameNext = (frameCur + 1) % this.FrameCount
		const frame1 = this.GetPositionAtFrame(frameCur),
			frame2 = this.GetPositionAtFrame(frameNext)
		return frame2
			.SubtractForThis(frame1)
			.MultiplyScalarForThis((time * this.FPS - frameCur) % 1)
			.AddForThis(frame1)
			.Rotated(angle)
			.MultiplyScalarForThis(modelScale)
	}
}
export type ComputedAttachments = [
	Map<string, number>,
	Map<string, ComputedAttachment>
][]

function ComputeBoneBindPose(
	bone: CBone,
	skeleton: CSkeleton,
	frame?: CAnimationFrame
): Matrix3x4 {
	const boneTransform =
		frame?.GetBoneBindPose(bone.Name) ??
		Matrix3x4.AngleMatrix(bone.Angle, bone.Position)
	if (bone.Parent === undefined) return boneTransform
	const parentBindPose = ComputeBoneBindPose(bone.Parent, skeleton, frame)
	if (boneTransform === undefined) return parentBindPose
	return Matrix3x4.ConcatTransforms(parentBindPose, boneTransform)
}

function ComputeAttachmentPosition(
	skeleton: CSkeleton,
	attachmentData: CMeshAttachment,
	attachment: ComputedAttachment,
	frameNum = 0,
	frame?: CAnimationFrame
): void {
	const bone = skeleton.Bones.get(attachmentData.InfluenceNames[0] ?? "")

	const boneBindPose =
		bone !== undefined ? ComputeBoneBindPose(bone, skeleton, frame) : undefined
	const bindPose = attachmentData.InfluenceBindPoses[0]
	if (bindPose === undefined) {
		if (boneBindPose !== undefined)
			attachment.SetPosition(frameNum, boneBindPose.Translation)
		return
	}
	if (boneBindPose === undefined) {
		if (bindPose !== undefined)
			attachment.SetPosition(frameNum, bindPose.Translation)
		return
	}
	attachment.SetPosition(
		frameNum,
		Matrix3x4.ConcatTransforms(boneBindPose, bindPose).Translation
	)
}

export function ComputeAttachmentsAndBounds(
	modelName: string
): [ComputedAttachments, Vector3, Vector3] {
	const ar: ComputedAttachments = []
	if (modelName.length === 0) return [ar, new Vector3(), new Vector3()]
	if (!modelName.endsWith("_c")) modelName += "_c"
	const buf = fopen(modelName)
	if (buf === undefined) return [ar, new Vector3(), new Vector3()]
	let model: CModel
	try {
		model = ParseModel(new FileBinaryStream(buf), modelName)
	} finally {
		buf.close()
	}
	try {
		const mesh = model.Meshes[0]
		if (mesh === undefined) return [ar, new Vector3(), new Vector3()]
		const skeleton = model.Skeletons[0]
		if (skeleton === undefined) return [ar, model.MinBounds, model.MaxBounds]
		model.Animations.forEach(anim => {
			if (
				(anim.Activities.length === 0 && anim.Movements.length === 0) ||
				anim.Name.includes("showcase") // workaround for radiant towers
			)
				return
			const attachments = new Map<string, ComputedAttachment>()
			mesh.Attachments.forEach(meshAttachment =>
				attachments.set(
					meshAttachment.Name,
					new ComputedAttachment(anim.FPS, anim.FrameCount)
				)
			)
			for (let i = 0; i < anim.FrameCount; i++) {
				const frame = anim.ReadFrame(i)
				attachments.forEach((attachment, name) =>
					ComputeAttachmentPosition(
						skeleton,
						mesh.Attachments.get(name)!,
						attachment,
						i,
						frame
					)
				)
			}
			const activity2weight = new Map(
				anim.Activities.map(activity => [activity.Name, activity.Weight])
			)
			if (anim.Movements.length !== 0 && !activity2weight.has("ACT_DOTA_RUN"))
				activity2weight.set("ACT_DOTA_RUN", Number.EPSILON)
			ar.push([activity2weight, attachments])
		})
		if (!ar.some(el => el[0].has("ACT_DOTA_CONSTANT_LAYER"))) {
			const emptyAttachments = new Map<string, ComputedAttachment>()
			mesh.Attachments.forEach(meshAttachment => {
				const attachment = new ComputedAttachment(1, 1)
				ComputeAttachmentPosition(skeleton, meshAttachment, attachment)
				emptyAttachments.set(meshAttachment.Name, attachment)
			})
			ar.push([new Map([["ACT_DOTA_CONSTANT_LAYER", 1]]), emptyAttachments])
		}
		return [ar, model.MinBounds, model.MaxBounds]
	} catch (e) {
		throw new Error(
			modelName +
				" error: " +
				(e instanceof Error ? e.message + " " + e.stack : e)
		)
	} finally {
		model.FilesOpen.forEach(file => file.close())
	}
}

Workers.RegisterRPCEndPoint("ComputeAttachmentsAndBounds", data => {
	if (typeof data !== "string") throw "Data should be a string"
	const res = ComputeAttachmentsAndBounds(data)
	const serializedAr: [
		[string, number][],
		[ArrayBuffer, string, number, number][]
	][] = []
	res[0].forEach(anim =>
		serializedAr.push([
			[...anim[0].entries()],
			[...anim[1].entries()].map(
				([name, el]) =>
					[el.PositionsCompressed.buffer, name, el.FPS, el.FrameCount] as [
						ArrayBuffer,
						string,
						number,
						number
					]
			)
		])
	)
	return [serializedAr, res[1].toArray(), res[2].toArray()]
})

export async function ComputeAttachmentsAndBoundsAsync(
	modelName: string
): Promise<[ComputedAttachments, Vector3, Vector3]> {
	const data = await Workers.CallRPCEndPoint(
		"ComputeAttachmentsAndBounds",
		modelName
	)
	if (!Array.isArray(data)) throw "!Array.isArray(data)"
	const serializedAr = data[0],
		minBounds = data[1],
		maxBounds = data[2]
	if (!Array.isArray(serializedAr)) throw "!Array.isArray(serialized_ar)"
	if (!Array.isArray(minBounds)) throw "!Array.isArray(MinBounds)"
	if (!Array.isArray(maxBounds)) throw "!Array.isArray(MaxBounds)"
	const ar: ComputedAttachments = []
	serializedAr.forEach(anim => {
		if (!Array.isArray(anim)) throw "!Array.isArray(anim)"
		const activities = anim[0] as [string, number][]
		if (!Array.isArray(activities)) throw "!Array.isArray(activities)"
		const attachments = anim[1] as [ArrayBuffer, string, number, number][]
		if (!Array.isArray(attachments)) throw "!Array.isArray(attachments)"
		const deserializedMap = new Map<string, ComputedAttachment>()
		attachments.forEach(([buf, name, fps, frameCount]) => {
			const attachment = new ComputedAttachment(fps, frameCount)
			attachment.PositionsCompressed.set(new Float32Array(buf))
			deserializedMap.set(name, attachment)
		})
		ar.push([new Map(activities), deserializedMap])
	})
	return [
		ar,
		Vector3.fromArray(minBounds as number[]),
		Vector3.fromArray(maxBounds as number[])
	]
}
