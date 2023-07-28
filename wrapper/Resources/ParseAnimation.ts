import { Matrix3x4 } from "../Base/Matrix"
import { Vector3 } from "../Base/Vector3"
import { Vector4 } from "../Base/Vector4"
import { ViewBinaryStream } from "../Utils/ViewBinaryStream"
import {
	GetMapNumberProperty,
	GetMapStringProperty,
	MapToNumberArray,
	MapToStringArray,
	MapToVector3
} from "./ParseUtils"

export class CAnimationFrame {
	private readonly BonesPositions = new Map<string, Vector3>()
	private readonly BonesAngles = new Map<string, Vector4>()

	public SetAttribute(
		bone: string,
		attribute: string,
		data: Vector3 | Vector4
	) {
		if (bone === "") return
		switch (attribute) {
			case "Position":
				this.BonesPositions.set(bone, data as Vector3)
				break
			case "Angle":
				this.BonesAngles.set(bone, data as Vector4)
				break
			default:
				break
		}
	}
	public GetBoneBindPose(name: string): Nullable<Matrix3x4> {
		const angles = this.BonesAngles.get(name),
			position = this.BonesPositions.get(name)
		if (angles === undefined && position === undefined) return undefined
		return Matrix3x4.AngleMatrix(
			angles ?? new Vector4(0, 0, 0, 1),
			position ?? new Vector3()
		)
	}
}

export class CAnimationActivity {
	public readonly Name: string
	public readonly Activity: number
	public readonly Flags: number
	public readonly Weight: number
	constructor(kv: RecursiveMap) {
		this.Name = GetMapStringProperty(kv, "m_name")
		this.Activity = GetMapNumberProperty(kv, "m_nActivity")
		this.Flags = GetMapNumberProperty(kv, "m_nFlags")
		this.Weight = GetMapNumberProperty(kv, "m_nWeight")
	}
}

export class CAnimationMovement {
	public readonly EndFrame: string
	public readonly ActionFlags: number
	public readonly V0: number
	public readonly V1: number
	public readonly Angle: number
	public readonly Vector: Vector3
	public readonly Position: Vector3
	constructor(kv: RecursiveMap) {
		this.EndFrame = GetMapStringProperty(kv, "endframe")
		this.ActionFlags = GetMapNumberProperty(kv, "motionflags")
		this.V0 = GetMapNumberProperty(kv, "v0")
		this.V1 = GetMapNumberProperty(kv, "v1")
		this.Angle = GetMapNumberProperty(kv, "angle")

		const vector = kv.get("vector")
		this.Vector =
			vector instanceof Map || Array.isArray(vector)
				? MapToVector3(vector)
				: new Vector3()

		const position = kv.get("position")
		this.Position =
			position instanceof Map || Array.isArray(position)
				? MapToVector3(position)
				: new Vector3()
	}
}

export class CAnimationEvent {
	public readonly Name: string
	public readonly Frame: number
	public readonly Cycle: number
	public readonly Data: RecursiveMap
	public readonly Options: string
	constructor(kv: RecursiveMap) {
		this.Name = GetMapStringProperty(kv, "m_sEventName")
		this.Frame = GetMapNumberProperty(kv, "m_nFrame")
		this.Cycle = GetMapNumberProperty(kv, "m_flCycle")
		this.Options = GetMapStringProperty(kv, "m_sOptions")

		const eventData = kv.get("m_EventData")
		this.Data = eventData instanceof Map ? eventData : new Map()
	}
}

const converFloatUint32 = new Uint32Array(1)
const converFloatFloat32 = new Float32Array(converFloatUint32.buffer)
function ReadHalfFloat(stream: ReadableBinaryStream): number {
	const val = stream.ReadUint16()
	let rst: number
	let mantissa = val & 1023,
		exp = 0xfffffff2
	if ((val & -33792) === 0) {
		if (mantissa !== 0) {
			while ((mantissa & 1024) === 0) {
				exp--
				mantissa = mantissa << 1
			}

			mantissa &= 0xfffffbff
			rst = ((val & 0x8000) << 16) | ((exp + 127) << 23) | (mantissa << 13)
		} else rst = (val & 0x8000) << 16
	} else
		rst =
			((val & 0x8000) << 16) |
			((((val >> 10) & 0x1f) - 15 + 127) << 23) |
			(mantissa << 13)
	converFloatUint32[0] = rst
	return converFloatFloat32[0]
}

function ReadVector4(stream: ReadableBinaryStream): Vector4 {
	const bytes = stream.ReadSlice(6)

	// Values
	const i1 = bytes[0] + ((bytes[1] & 63) << 8)
	const i2 = bytes[2] + ((bytes[3] & 63) << 8)
	const i3 = bytes[4] + ((bytes[5] & 63) << 8)

	// Signs
	const s1 = bytes[1] & 128
	const s2 = bytes[3] & 128
	const s3 = bytes[5] & 128

	const c = Math.sin(Math.PI / 4) / 16384
	const x = (bytes[1] & 64) === 0 ? c * (i1 - 16384) : c * i1
	const y = (bytes[3] & 64) === 0 ? c * (i2 - 16384) : c * i2
	const z = (bytes[5] & 64) === 0 ? c * (i3 - 16384) : c * i3

	let w = Math.sqrt(1 - x * x - y * y - z * z)

	// Apply sign 3
	if (s3 === 128) w *= -1

	// Apply sign 1 and 2
	if (s1 === 128)
		return s2 === 128 ? new Vector4(y, z, w, x) : new Vector4(z, w, x, y)

	return s2 === 128 ? new Vector4(w, x, y, z) : new Vector4(x, y, z, w)
}

export class CAnimation {
	public readonly Name: string
	public readonly FPS: number
	public readonly Looping: boolean
	public readonly Activities: CAnimationActivity[]
	public readonly Movements: CAnimationMovement[] = []
	public readonly Events: CAnimationEvent[] = []
	public readonly FrameCount: number
	private readonly FrameBlockArray: [number, number, number[]][] = []
	constructor(
		animationDesc: RecursiveMap,
		private readonly DataChannelArray: Nullable<[string[], string]>[],
		private readonly SegmentArray: Nullable<
			[number, number[], string, ReadableBinaryStream]
		>[],
		hseq: Map<string, CAnimationActivity[]>
	) {
		this.Name = GetMapStringProperty(animationDesc, "m_name")
		this.FPS = GetMapNumberProperty(animationDesc, "fps")
		this.Looping = this.ComputeIsLooping(animationDesc)

		this.Activities =
			hseq.get(this.Name.substring(1)) ?? this.LoadActivities(animationDesc)
		this.LoadMovements(animationDesc)
		this.LoadEvents(animationDesc)

		this.FrameCount = this.LoadFrameData(animationDesc)
	}

	public ReadFrame(frameNum: number): Nullable<CAnimationFrame> {
		if (frameNum >= this.FrameCount) return undefined
		const frame = new CAnimationFrame()
		for (const [startFrame, endFrame, segmentIndexArray] of this
			.FrameBlockArray)
			if (frameNum >= startFrame && frameNum <= endFrame)
				for (const segmentIndex of segmentIndexArray)
					this.ReadSegment(
						Math.max(Math.min(frameNum - startFrame, this.FrameCount - 1), 0),
						frame,
						segmentIndex
					)
		return frame
	}

	private ComputeIsLooping(animationDesc: RecursiveMap): boolean {
		const flags = animationDesc.get("m_flags")
		if (!(flags instanceof Map)) return false
		const looping = flags.get("m_bLooping")
		return typeof looping === "boolean" ? looping : false
	}
	private LoadActivities(animationDesc: RecursiveMap): CAnimationActivity[] {
		const ar: CAnimationActivity[] = []
		const activityArray = animationDesc.get("m_activityArray")
		if (activityArray instanceof Map || Array.isArray(activityArray))
			activityArray.forEach((activity: RecursiveMapValue) => {
				if (activity instanceof Map) ar.push(new CAnimationActivity(activity))
			})
		return ar
	}
	private LoadMovements(animationDesc: RecursiveMap): void {
		const movementArray = animationDesc.get("m_movementArray")
		if (movementArray instanceof Map || Array.isArray(movementArray))
			movementArray.forEach((movement: RecursiveMapValue) => {
				if (movement instanceof Map)
					this.Movements.push(new CAnimationMovement(movement))
			})
	}
	private LoadEvents(animationDesc: RecursiveMap): void {
		const eventArray = animationDesc.get("m_eventArray")
		if (eventArray instanceof Map || Array.isArray(eventArray))
			eventArray.forEach((event: RecursiveMapValue) => {
				if (event instanceof Map) this.Events.push(new CAnimationEvent(event))
			})
	}
	private LoadFrameData(animationDesc: RecursiveMap): number {
		let data = animationDesc.get("m_pData")
		if (data instanceof Map) data = data.get("0") ?? data
		else if (Array.isArray(data)) data = data[0]
		if (!(data instanceof Map)) return 0
		const frameBlockArray = data.get("m_frameblockArray")
		if (!(frameBlockArray instanceof Map || Array.isArray(frameBlockArray)))
			return 0
		frameBlockArray.forEach((frameBlock: RecursiveMapValue) => {
			if (!(frameBlock instanceof Map)) return
			const startFrame = GetMapNumberProperty(frameBlock, "m_nStartFrame")
			const endFrame = GetMapNumberProperty(frameBlock, "m_nEndFrame")
			const segmentIndexArray = frameBlock.get("m_segmentIndexArray")
			if (
				!(segmentIndexArray instanceof Map || Array.isArray(segmentIndexArray))
			)
				return
			this.FrameBlockArray.push([
				startFrame,
				endFrame,
				MapToNumberArray(segmentIndexArray)
			])
		})
		return GetMapNumberProperty(data, "m_nFrames")
	}
	private ReadSegment(
		frameNum: number,
		frame: CAnimationFrame,
		segmentIndex: number
	): void {
		if (frameNum < 0) return
		const segmentData = this.SegmentArray[segmentIndex]
		if (segmentData === undefined) return
		const [localChannel, bones, decoder, stream] = segmentData
		if (bones.length === 0) return
		const dataChannel = this.DataChannelArray[localChannel]
		if (dataChannel === undefined) return
		const [boneNames, channelAttribute] = dataChannel

		switch (decoder) {
			case "CCompressedStaticFullVector3": {
				stream.pos = 0
				if (stream.Empty()) return
				for (const boneID of bones)
					frame.SetAttribute(
						boneNames[boneID] ?? "",
						channelAttribute,
						new Vector3(
							stream.ReadFloat32(),
							stream.ReadFloat32(),
							stream.ReadFloat32()
						)
					)
				break
			}
			case "CCompressedFullVector3": {
				stream.pos = frameNum * bones.length * (3 * 4)
				if (stream.Empty()) return
				for (const boneID of bones)
					frame.SetAttribute(
						boneNames[boneID] ?? "",
						channelAttribute,
						new Vector3(
							stream.ReadFloat32(),
							stream.ReadFloat32(),
							stream.ReadFloat32()
						)
					)
				break
			}
			case "CCompressedDeltaVector3": {
				stream.pos = 0
				const baseStream = stream.CreateNestedStream(bones.length * (3 * 4))
				stream.pos += frameNum * bones.length * (3 * 2)
				if (stream.Empty()) return
				for (const boneID of bones)
					frame.SetAttribute(
						boneNames[boneID] ?? "",
						channelAttribute,
						new Vector3(
							baseStream.ReadFloat32() + ReadHalfFloat(stream),
							baseStream.ReadFloat32() + ReadHalfFloat(stream),
							baseStream.ReadFloat32() + ReadHalfFloat(stream)
						)
					)
				break
			}
			case "CCompressedStaticVector3": {
				stream.pos = 0
				if (stream.Empty()) return
				for (const boneID of bones)
					frame.SetAttribute(
						boneNames[boneID] ?? "",
						channelAttribute,
						new Vector3(
							ReadHalfFloat(stream),
							ReadHalfFloat(stream),
							ReadHalfFloat(stream)
						)
					)
				break
			}
			case "CCompressedAnimVector3": {
				stream.pos = frameNum * bones.length * (3 * 2)
				if (stream.Empty()) return
				for (const boneID of bones)
					frame.SetAttribute(
						boneNames[boneID] ?? "",
						channelAttribute,
						new Vector3(
							ReadHalfFloat(stream),
							ReadHalfFloat(stream),
							ReadHalfFloat(stream)
						)
					)
				break
			}
			case "CCompressedStaticQuaternion": {
				stream.pos = 0
				if (stream.Empty()) return
				for (const boneID of bones)
					frame.SetAttribute(
						boneNames[boneID] ?? "",
						channelAttribute,
						ReadVector4(stream)
					)
				break
			}
			case "CCompressedAnimQuaternion": {
				stream.pos = frameNum * bones.length * 6
				if (stream.Empty()) return
				for (const boneID of bones)
					frame.SetAttribute(
						boneNames[boneID] ?? "",
						channelAttribute,
						ReadVector4(stream)
					)
				break
			}
			case "CCompressedFullQuaternion": {
				stream.pos = frameNum * bones.length * (4 * 3)
				if (stream.Empty()) return
				for (const boneID of bones)
					frame.SetAttribute(
						boneNames[boneID] ?? "",
						channelAttribute,
						new Vector4(
							stream.ReadFloat32(),
							stream.ReadFloat32(),
							stream.ReadFloat32(),
							stream.ReadFloat32()
						)
					)
				break
			}
			default:
				break
		}
	}
}

function MakeDecoderArray(map: RecursiveMap | RecursiveMapValue[]): string[] {
	const ar: string[] = []
	map.forEach((decoder: RecursiveMapValue) => {
		if (!(decoder instanceof Map)) return
		const name = GetMapStringProperty(decoder, "m_szName")
		ar.push(name)
	})
	return ar
}

export function ParseAnimationsFromData(
	animationData: RecursiveMap,
	decodeKey: RecursiveMap,
	hseqData: RecursiveMap
): CAnimation[] {
	const dataChannelMap = decodeKey.get("m_dataChannelArray")
	if (!(dataChannelMap instanceof Map || Array.isArray(dataChannelMap)))
		throw "decodeKey without dataChannelArray"
	const boneCount = GetMapNumberProperty(decodeKey, "m_nChannelElements")
	const dataChannelArray = (
		dataChannelMap instanceof Map
			? [...dataChannelMap.values()]
			: dataChannelMap
	).map(dataChannel => {
		if (!(dataChannel instanceof Map)) return undefined
		const boneNamesMap = dataChannel.get("m_szElementNameArray")
		if (!(boneNamesMap instanceof Map || Array.isArray(boneNamesMap)))
			return undefined
		const elementIndexArrayMap = dataChannel.get("m_nElementIndexArray")
		if (
			!(
				elementIndexArrayMap instanceof Map ||
				Array.isArray(elementIndexArrayMap)
			)
		)
			return undefined
		const boneNames = MapToStringArray(boneNamesMap),
			elementIndexArray = MapToNumberArray(elementIndexArrayMap),
			channelAttribute = GetMapStringProperty(dataChannel, "m_szVariableName")
		const mappedBoneNames: string[] = []
		for (let i = 0; i < boneCount; i++) mappedBoneNames.push("")
		elementIndexArray.forEach(
			(elementIndex, i) => (mappedBoneNames[elementIndex] = boneNames[i])
		)
		return [mappedBoneNames, channelAttribute] as [string[], string]
	})

	const ar: CAnimation[] = []
	const decoderArrayMap = animationData.get("m_decoderArray")
	const decoderArray =
		decoderArrayMap instanceof Map || Array.isArray(decoderArrayMap)
			? MakeDecoderArray(decoderArrayMap)
			: []
	const animArrayMap = animationData.get("m_animArray")
	const segmentArrayMap = animationData.get("m_segmentArray")
	const segmentArray: Nullable<
		[number, number[], string, ReadableBinaryStream]
	>[] = []
	if (segmentArrayMap instanceof Map || Array.isArray(segmentArrayMap))
		segmentArrayMap.forEach((segment: RecursiveMapValue) => {
			if (!(segment instanceof Map)) {
				segmentArray.push(undefined)
				return
			}

			let container = segment.get("m_container")
			if (container === undefined) {
				segmentArray.push(undefined)
				return
			}

			if (container instanceof Map || Array.isArray(container))
				container = new Uint8Array(MapToNumberArray(container))
			if (!(container instanceof Uint8Array)) {
				segmentArray.push(undefined)
				return
			}

			const stream = new ViewBinaryStream(
				new DataView(
					container.buffer,
					container.byteOffset,
					container.byteLength
				)
			)
			const decoder = decoderArray[stream.ReadUint16()]
			stream.RelativeSeek(2) // cardinality?
			const numBones = stream.ReadUint16()
			stream.RelativeSeek(2) // totalLength?
			const bones: number[] = []
			for (let i = 0; i < numBones; i++) bones.push(stream.ReadUint16())

			segmentArray.push([
				GetMapNumberProperty(segment, "m_nLocalChannel"),
				bones,
				decoder,
				stream.CreateNestedStream(stream.Remaining)
			])
		})
	const hseq = new Map<string, CAnimationActivity[]>()
	const localS1SeqDescArray = hseqData.get("m_localS1SeqDescArray")
	if (localS1SeqDescArray instanceof Map || Array.isArray(localS1SeqDescArray))
		localS1SeqDescArray.forEach((el: RecursiveMapValue) => {
			if (!(el instanceof Map)) return
			const name = GetMapStringProperty(el, "m_sName")
			const activityArray = el.get("m_activityArray")
			const activities: CAnimationActivity[] = []
			if (activityArray instanceof Map || Array.isArray(activityArray))
				activityArray.forEach((activity: RecursiveMapValue) => {
					if (activity instanceof Map)
						activities.push(new CAnimationActivity(activity))
				})
			hseq.set(name, activities)
		})
	if (animArrayMap instanceof Map || Array.isArray(animArrayMap))
		animArrayMap.forEach((animationDesc: RecursiveMapValue) => {
			if (animationDesc instanceof Map)
				ar.push(
					new CAnimation(animationDesc, dataChannelArray, segmentArray, hseq)
				)
		})
	return ar
}

export function ParseEmbeddedAnimation(
	groupDataBlock: Nullable<ReadableBinaryStream>,
	animDataBlock: Nullable<ReadableBinaryStream>,
	hseq: RecursiveMap
): CAnimation[] {
	const groupData = groupDataBlock?.ParseKVBlock() ?? new Map()
	if (groupData.size === 0) throw "Animation without groupData"
	const animationData = animDataBlock?.ParseKVBlock() ?? new Map()
	if (animationData.size === 0) throw "Animation without animationData"
	const decodeKey = groupData.get("m_decodeKey")
	if (!(decodeKey instanceof Map)) throw "Animation without decodeKey"
	return ParseAnimationsFromData(animationData, decodeKey, hseq)
}

export function ParseAnimationGroup(
	stream: ReadableBinaryStream
): CAnimation[] {
	const ar: CAnimation[] = []
	const kv = stream.ParseKV()
	const animArrayMap = kv.get("m_localHAnimArray")
	if (!(animArrayMap instanceof Map || Array.isArray(animArrayMap)))
		throw "Animation group without animArray"
	const decodeKey = kv.get("m_decodeKey")
	if (!(decodeKey instanceof Map)) throw "Animation group without decodeKey"
	let hseqPath = GetMapStringProperty(kv, "m_directHSeqGroup")
	if (hseqPath.length !== 0 && !hseqPath.endsWith("_c")) hseqPath += "_c"
	const hseq = hseqPath.length !== 0 ? parseKV(hseqPath) : new Map()
	animArrayMap.forEach((path: RecursiveMapValue) => {
		if (typeof path !== "string") return
		if (!path.endsWith("_c")) path += "_c"
		ar.push(...ParseAnimationsFromData(parseKV(path), decodeKey, hseq))
	})
	return ar
}
