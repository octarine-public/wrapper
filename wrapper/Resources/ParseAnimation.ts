import Vector3 from "../Base/Vector3"
import Vector4 from "../Base/Vector4"
import BinaryStream from "../Utils/BinaryStream"
import { parseKV, parseKVBlock, parseKVFile } from "./ParseKV"
import { GetMapNumberProperty, GetMapStringProperty, MapToNumberArray, MapToStringArray } from "./ParseUtils"

enum AnimDecoderType {
	Unknown,
	CCompressedReferenceFloat,
	CCompressedStaticFloat,
	CCompressedFullFloat,
	CCompressedReferenceVector3,
	CCompressedStaticVector3,
	CCompressedStaticFullVector3,
	CCompressedAnimVector3,
	CCompressedDeltaVector3,
	CCompressedFullVector3,
	CCompressedReferenceQuaternion,
	CCompressedStaticQuaternion,
	CCompressedAnimQuaternion,
	CCompressedFullQuaternion,
	CCompressedReferenceInt,
	CCompressedStaticChar,
	CCompressedFullChar,
	CCompressedStaticShort,
	CCompressedFullShort,
	CCompressedStaticInt,
	CCompressedFullInt,
	CCompressedReferenceBool,
	CCompressedStaticBool,
	CCompressedFullBool,
	CCompressedReferenceColor32,
	CCompressedStaticColor32,
	CCompressedFullColor32,
	CCompressedReferenceVector2D,
	CCompressedStaticVector2D,
	CCompressedFullVector2D,
	CCompressedReferenceVector4D,
	CCompressedStaticVector4D,
	CCompressedFullVector4D,
}

export class CAnimationFrame {
	public readonly BonesPositions = new Map<string, Vector3>()
	public readonly BonesAngles = new Map<string, Vector4>()
	public SetAttribute(bone: string, attribute: string, data: Vector3 | Vector4) {
		switch (attribute) {
			case "Position":
				this.BonesPositions.set(bone, data as Vector3)
				break
			case "Angle":
				this.BonesAngles.set(bone, data as Vector4)
				break
			case "data":
			default:
				break
		}
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
		this.Data = eventData instanceof Map
			? eventData
			: new Map()
	}
}

const converFloatUint32 = new Uint32Array(1)
const converFloatFloat32 = new Float32Array(converFloatUint32.buffer)
export class CAnimation {
	public readonly Name: string
	public readonly FPS: number
	public readonly Looping: boolean
	public readonly Activities: CAnimationActivity[] = []
	public readonly Events: CAnimationEvent[] = []
	public readonly FrameCount: number
	private readonly FrameBlockArray: [number, number, number[]][] = []
	private readonly SegmentArray: [Uint8Array, string[], number[], string][] = []
	private readonly BoneCount: number
	constructor(
		animationDesc: RecursiveMap,
		DecodeKey: RecursiveMap,
		private readonly DecoderArray: AnimDecoderType[],
		segmentArray: RecursiveMap[],
	) {
		this.Name = GetMapStringProperty(animationDesc, "m_name")
		this.FPS = GetMapNumberProperty(animationDesc, "fps")
		this.Looping = this.ComputeIsLooping(animationDesc)

		this.LoadActivities(animationDesc)
		this.LoadEvents(animationDesc)

		this.FrameCount = this.LoadFrameData(animationDesc)
		const dataChannelMap = DecodeKey.get("m_dataChannelArray")
		if (!(dataChannelMap instanceof Map || Array.isArray(dataChannelMap)))
			throw "decodeKey without dataChannelArray"
		const dataChannelArray = dataChannelMap instanceof Map
			? [...dataChannelMap.values()]
			: dataChannelMap
		segmentArray.forEach(segment => {
			const localChannel = GetMapNumberProperty(segment, "m_nLocalChannel")
			const dataChannel = dataChannelArray[localChannel]
			if (!(dataChannel instanceof Map))
				return
			const boneNamesMap = dataChannel.get("m_szElementNameArray")
			if (!(boneNamesMap instanceof Map || Array.isArray(boneNamesMap)))
				return
			const elementIndexArrayMap = dataChannel.get("m_nElementIndexArray")
			if (!(elementIndexArrayMap instanceof Map || Array.isArray(elementIndexArrayMap)))
				return
			let container = segment.get("m_container")
			if (container instanceof Map || Array.isArray(container))
				container = new Uint8Array(MapToNumberArray(container))
			if (!(container instanceof Uint8Array))
				return
			const boneNames = MapToStringArray(boneNamesMap),
				elementIndexArray = MapToNumberArray(elementIndexArrayMap),
				channelAttribute = GetMapStringProperty(dataChannel, "m_szVariableName")
			this.SegmentArray.push([container, boneNames, elementIndexArray, channelAttribute])
		})
		this.BoneCount = GetMapNumberProperty(DecodeKey, "m_nChannelElements")
	}

	public ReadFrame(frameNum: number): Nullable<CAnimationFrame> {
		if (this.FrameBlockArray === undefined || frameNum >= this.FrameCount)
			return undefined
		const frame = new CAnimationFrame()
		this.FrameBlockArray.forEach(([startFrame, endFrame, segmentIndexArray]) => {
			if (frameNum < startFrame || frameNum > endFrame)
				return
			segmentIndexArray.forEach(segmentIndex => this.ReadSegment(
				Math.max(Math.min(frameNum - startFrame, this.FrameCount - 1), 0),
				frame,
				this.SegmentArray[segmentIndex],
			))
		})
		return frame
	}

	private ComputeIsLooping(animationDesc: RecursiveMap): boolean {
		const flags = animationDesc.get("m_flags")
		if (!(flags instanceof Map))
			return false
		const looping = flags.get("m_bLooping")
		return typeof looping === "boolean"
			? looping
			: false
	}
	private LoadActivities(animationDesc: RecursiveMap): void {
		const activityArray = animationDesc.get("m_activityArray")
		if (activityArray instanceof Map || Array.isArray(activityArray))
			activityArray.forEach((activity: RecursiveMapValue) => {
				if (activity instanceof Map)
					this.Activities.push(new CAnimationActivity(activity))
			})
	}
	private LoadEvents(animationDesc: RecursiveMap): void {
		const eventArray = animationDesc.get("m_eventArray")
		if (eventArray instanceof Map || Array.isArray(eventArray))
			eventArray.forEach((event: RecursiveMapValue) => {
				if (event instanceof Map)
					this.Events.push(new CAnimationEvent(event))
			})
	}
	private LoadFrameData(animationDesc: RecursiveMap): number {
		let data = animationDesc.get("m_pData")
		if (data instanceof Map)
			data = data.get("0") ?? data
		else if (Array.isArray(data))
			data = data[0]
		if (!(data instanceof Map))
			return 0
		const frameBlockArray = data.get("m_frameblockArray")
		if (!(frameBlockArray instanceof Map || Array.isArray(frameBlockArray)))
			return 0
		frameBlockArray.forEach((frameBlock: RecursiveMapValue) => {
			if (!(frameBlock instanceof Map))
				return
			const startFrame = GetMapNumberProperty(frameBlock, "m_nStartFrame")
			const endFrame = GetMapNumberProperty(frameBlock, "m_nEndFrame")
			const segmentIndexArray = frameBlock.get("m_segmentIndexArray")
			if (!(segmentIndexArray instanceof Map || Array.isArray(segmentIndexArray)))
				return
			this.FrameBlockArray.push([
				startFrame,
				endFrame,
				MapToNumberArray(segmentIndexArray),
			])
		})
		return GetMapNumberProperty(data, "m_nFrames")
	}
	private GetAnimDecoderTypeSize(type: AnimDecoderType): number {
		switch (type) {
			case AnimDecoderType.CCompressedFullVector3:
				return 4 * 3
			case AnimDecoderType.CCompressedStaticVector3:
			case AnimDecoderType.CCompressedAnimVector3:
			case AnimDecoderType.CCompressedAnimQuaternion:
				return 2 * 3
			default:
				return 0
		}
	}
	private ReadSegment(
		frameNum: number,
		frame: CAnimationFrame,
		segment: [Uint8Array, string[], number[], string],
	): void {
		const [container, boneNames, elementIndexArray, channelAttribute] = segment
		const stream = new BinaryStream(new DataView(
			container.buffer,
			container.byteOffset,
			container.byteLength,
		))
		const decoder = this.DecoderArray[stream.ReadUint16()]
		stream.RelativeSeek(2) // cardinality?
		const numBones = stream.ReadUint16()
		stream.RelativeSeek(2) // totalLength?
		const bones: string[] = []
		const elementBones = new Array<number>(this.BoneCount).fill(0)
		elementIndexArray.forEach((elementIndex, i) => elementBones[elementIndex] = i)
		for (let i = 0; i < numBones; i++) {
			const id = stream.ReadUint16()
			bones.push(boneNames[elementBones[id]] ?? "")
		}
		stream.RelativeSeek(this.GetAnimDecoderTypeSize(decoder) * frameNum * numBones)
		if (stream.Empty())
			return
		bones.forEach(bone => {
			switch (decoder) {
				case AnimDecoderType.CCompressedStaticFullVector3:
				case AnimDecoderType.CCompressedFullVector3:
				case AnimDecoderType.CCompressedDeltaVector3:
					frame.SetAttribute(
						bone,
						channelAttribute,
						new Vector3(
							stream.ReadFloat32(),
							stream.ReadFloat32(),
							stream.ReadFloat32(),
						),
					)
					break
				case AnimDecoderType.CCompressedAnimVector3:
				case AnimDecoderType.CCompressedStaticVector3:
					frame.SetAttribute(
						bone,
						channelAttribute,
						new Vector3(
							this.ReadHalfFloat(stream),
							this.ReadHalfFloat(stream),
							this.ReadHalfFloat(stream),
						),
					)
					break
				case AnimDecoderType.CCompressedAnimQuaternion:
				case AnimDecoderType.CCompressedFullQuaternion:
				case AnimDecoderType.CCompressedStaticQuaternion:
					frame.SetAttribute(
						bone,
						channelAttribute,
						this.ReadVector4(stream),
					)
					break
				default:
					break
			}
		})
	}
	private ReadHalfFloat(stream: BinaryStream): number {
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
			} else
				rst = ((val & 0x8000) << 16)
		} else
			rst = ((val & 0x8000) << 16) | ((((val >> 10) & 0x1f) - 15 + 127) << 23) | (mantissa << 13)
		converFloatUint32[0] = rst
		return converFloatFloat32[0]
	}
	private ReadVector4(stream: BinaryStream): Vector4 {
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

		let w = Math.sqrt(1 - (x * x) - (y * y) - (z * z))

		// Apply sign 3
		if (s3 === 128)
			w *= -1

		// Apply sign 1 and 2
		if (s1 === 128)
			return s2 === 128 ? new Vector4(y, z, w, x) : new Vector4(z, w, x, y)

		return s2 === 128 ? new Vector4(w, x, y, z) : new Vector4(x, y, z, w)
	}
}

function MakeDecoderArray(map: RecursiveMap | RecursiveMapValue[]): AnimDecoderType[] {
	const ar: AnimDecoderType[] = []
	map.forEach((decoder: RecursiveMapValue) => {
		if (!(decoder instanceof Map))
			return
		const name = GetMapStringProperty(decoder, "m_szName")
		ar.push((AnimDecoderType as any)[name])
	})
	return ar
}

export function ParseAnimationsFromData(
	animationData: RecursiveMap,
	decodeKey: RecursiveMap,
): CAnimation[] {
	const ar: CAnimation[] = []
	const decoderArrayMap = animationData.get("m_decoderArray")
	const decoderArray = decoderArrayMap instanceof Map || Array.isArray(decoderArrayMap)
		? MakeDecoderArray(decoderArrayMap)
		: []
	const animArrayMap = animationData.get("m_animArray")
	const segmentArrayMap = animationData.get("m_segmentArray")
	const segmentArray: RecursiveMap[] = []
	if (segmentArrayMap instanceof Map || Array.isArray(segmentArrayMap))
		segmentArrayMap.forEach((segment: RecursiveMapValue) => {
			if (segment instanceof Map)
				segmentArray.push(segment)
		})
	if (animArrayMap instanceof Map || Array.isArray(animArrayMap))
		animArrayMap.forEach((animationDesc: RecursiveMapValue) => {
			if (animationDesc instanceof Map)
				ar.push(new CAnimation(
					animationDesc,
					decodeKey,
					decoderArray,
					segmentArray,
				))
		})
	return ar
}

export function ParseEmbeddedAnimation(
	group_data_block: Nullable<Uint8Array>,
	anim_data_block: Nullable<Uint8Array>,
): CAnimation[] {
	const groupData = parseKVBlock(group_data_block)
	if (groupData === undefined)
		throw "Animation without groupData"
	const animationData = parseKVBlock(anim_data_block)
	if (animationData === undefined)
		throw "Animation without animationData"
	const decodeKey = groupData.get("m_decodeKey")
	if (!(decodeKey instanceof Map))
		throw "Animation without decodeKey"
	return ParseAnimationsFromData(animationData, decodeKey)
}

export function ParseAnimationGroup(buf: Uint8Array): CAnimation[] {
	const ar: CAnimation[] = []
	const kv = parseKV(buf)
	const animArrayMap = kv.get("m_localHAnimArray")
	if (!(animArrayMap instanceof Map || Array.isArray(animArrayMap)))
		throw "Animation group without animArray"
	const decodeKey = kv.get("m_decodeKey")
	if (!(decodeKey instanceof Map))
		throw "Animation group without decodeKey"
	animArrayMap.forEach((path: RecursiveMapValue) => {
		if (typeof path !== "string")
			return
		if (!path.endsWith("_c"))
			path += "_c"
		ar.push(...ParseAnimationsFromData(parseKVFile(path), decodeKey))
	})
	return ar
}
