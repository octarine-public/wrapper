import { AABB } from "../Base/AABB"
import { QAngle } from "../Base/QAngle"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { fread } from "../Utils/fread"
import { DegreesToRadian } from "../Utils/Math"
import { tryFindFile } from "../Utils/readFile"

export class CHeightMap {
	constructor(
		private readonly MinMapCoords_: Vector2,
		private readonly MapSize_: Vector2
	) {}

	public get MinMapCoords(): Vector2 {
		return this.MinMapCoords_.Clone()
	}

	public get MapSize(): Vector2 {
		return this.MapSize_.Clone()
	}

	public get MaxMapCoords(): Vector2 {
		return this.MinMapCoords_.Add(this.MapSize_)
	}

	public Contains(pos: Vector2 | Vector3): boolean {
		return (
			pos.x >= this.MinMapCoords_.x &&
			pos.x <= this.MinMapCoords_.x + this.MapSize_.x &&
			pos.y >= this.MinMapCoords_.y &&
			pos.y <= this.MinMapCoords_.y + this.MapSize_.y
		)
	}
}
export let HeightMap: Nullable<CHeightMap>

enum HeightMapParseError {
	NONE = 0,
	INVALID_MAGIC = 1,
	UNKNOWN_VERSION = 2,
	ALLOCATION_ERROR = 3
}

function TryLoadWASMModule(path: string): WebAssembly.Module {
	const realPath = tryFindFile(path, 1)
	if (realPath === undefined) throw `${path} not found`
	const wasmFile = fread(realPath)
	if (wasmFile === undefined) throw `Coudln't read ${realPath}`

	return new WebAssembly.Module(wasmFile)
}

function GetWASMModule(): WebAssembly.Module {
	try {
		return TryLoadWASMModule("wrapper_simd.wasm")
	} catch {
		return TryLoadWASMModule("wrapper.wasm")
	}
}

const wasiESUCCESS = 0
const wasiENOSYS = 52
const wasm = new WebAssembly.Instance(GetWASMModule(), {
	env: {
		emscripten_notify_memory_growth: emscriptenNotifyMemoryGrowth
	},
	wasi_snapshot_preview1: {
		proc_exit: () => {
			return wasiENOSYS
		},
		args_get: () => {
			return wasiESUCCESS
		},
		args_sizes_get: (argc: number, argvBufSize: number) => {
			const view = new DataView(wasm.memory.buffer)
			view.setUint32(argc, 0)
			view.setUint32(argvBufSize, 0)
			return wasiESUCCESS
		},
		fd_read: () => {
			throw new Error("fd_read is unimplemented")
		},
		fd_write: () => {
			throw new Error("fd_write is unimplemented")
		},
		fd_seek: () => {
			throw new Error("fdSeek is unimplemented")
		},
		fd_close: () => {
			throw new Error("fdClose is unimplemented")
		},
		environ_sizes_get: () => {
			throw new Error("environ_sizes_get is unimplemented")
		},
		environ_get: () => {
			throw new Error("environ_get is unimplemented")
		}
	}
}).exports as any as {
	Start: () => void
	GetIOBuffer: () => number
	memory: WebAssembly.Memory
	ScreenToWorld: () => void
	WorldToScreen: () => number
	ParseVHCG: (ptr: number, size: number) => HeightMapParseError
	GetHeightForLocation: () => void
	IsPointUnderWater: () => number
	GetLocationAverageHeight: () => void
	GetCursorRay: () => void
	ScreenToWorldFar: () => void
	malloc: (size: number) => number
	free: (ptr: number) => void
	CloneWorldToProjection: () => void
	WorldToScreenNew: () => number
	DecompressVertexBuffer: (
		ptr: number,
		size: number,
		elemCount: number,
		elemSize: number
	) => number
	DecompressIndexBuffer: (
		ptr: number,
		size: number,
		elemCount: number,
		elemSize: number
	) => number
	ResetWorld: () => void
	LoadWorldMesh: (
		id: number,
		vertexPtr: number,
		vertexSize: number,
		vertex_elemSize: number,
		indexPtr: number,
		indexSize: number,
		index_elemSize: number,
		flags: number,
		pathID: number
	) => void
	LoadWorldMeshCached: (
		id: number,
		trianglesPtr: number,
		trianglesSize: number,
		nodesPtr: number,
		nodesSize: number,
		indicesPtr: number,
		indicesSize: number,
		flags: number,
		pathID: number
	) => void
	SpawnWorldMesh: (id: number) => void
	FinishWorld: (
		nodesPtr: number,
		nodesSize: number,
		indicesPtr: number,
		indicesSize: number
	) => void
	ExtractWorldBVH: () => void
	ExtractMeshData: (id: number) => void
	BatchCheckRayBox: () => void
}
declare global {
	var wasm_: typeof wasm
}
globalThis.wasm_ = wasm
// wasm.Start() // calls proc_exit => unreachable code

export let WASMIOBuffer: Float32Array
export let WASMIOBufferBU64: BigUint64Array
export let WASMIOBufferU32: Uint32Array
export let WASMIOBufferView: DataView
function emscriptenNotifyMemoryGrowth(_memoryIndex: number) {
	const off = wasm.GetIOBuffer()
	WASMIOBuffer = new Float32Array(wasm.memory.buffer, off)
	WASMIOBufferBU64 = new BigUint64Array(wasm.memory.buffer, off)
	WASMIOBufferU32 = new Uint32Array(wasm.memory.buffer, off)
	WASMIOBufferView = new DataView(wasm.memory.buffer, off)
}
emscriptenNotifyMemoryGrowth(0)

export function GetEyeVector(cameraAngles: QAngle): Vector3 {
	// TODO: should we use Math.cos(DegreesToRadian(cameraAngles.y))?
	return new Vector3(
		0,
		Math.cos(
			DegreesToRadian(cameraAngles.x) -
				Math.cos(DegreesToRadian(cameraAngles.y))
		),
		-Math.sin(DegreesToRadian(cameraAngles.x))
	)
}

let cameraOffset = 0,
	cameraOffsetUpdated = 0
export function GetCameraPosition(
	cameraPosition: Vector2,
	cameraDistance: number,
	cameraAngles: QAngle
): Vector3 {
	const dist = 96 * 1.5,
		count = 8,
		t = hrtime(),
		eyeVector = GetEyeVector(cameraAngles)
	if (cameraOffsetUpdated + 100 < t) {
		cameraOffset = GetLocationAverageHeight(
			cameraPosition
				.Clone()
				.AddScalarX(eyeVector.x * cameraDistance)
				.AddScalarY(eyeVector.y * cameraDistance),
			count,
			dist
		)
		cameraOffsetUpdated = t
	}
	return Vector3.FromVector2(cameraPosition).SetZ(
		cameraOffset - eyeVector.z * cameraDistance + 50
	)
}

export function GetCursorRay(
	screen: Vector2,
	windowSize: Vector2,
	cameraAngles: QAngle,
	fov: number
): Vector3 {
	WASMIOBuffer[0] = windowSize.x
	WASMIOBuffer[1] = windowSize.y

	WASMIOBuffer[2] = cameraAngles.x
	WASMIOBuffer[3] = cameraAngles.y
	WASMIOBuffer[4] = cameraAngles.z

	WASMIOBuffer[5] = fov

	WASMIOBuffer[6] = screen.x
	WASMIOBuffer[7] = screen.y

	wasm.GetCursorRay()
	return new Vector3(WASMIOBuffer[0], WASMIOBuffer[1], WASMIOBuffer[2])
}

const ioBufferSize = 128,
	maxScreens = (ioBufferSize - 11) / 2
export function ScreenToWorldFar(
	screens: Vector2[],
	windowSize: Vector2,
	cameraPosition: Vector3,
	cameraDistance: number,
	cameraAngles: QAngle,
	fov: number
): Vector3[] {
	if (screens.length > maxScreens) {
		let res: Vector3[] = []
		for (let i = 0; i < screens.length; i += maxScreens) {
			res = [
				...res,
				...ScreenToWorldFar(
					screens.slice(i, i + maxScreens),
					windowSize,
					cameraPosition,
					cameraDistance,
					cameraAngles,
					fov
				)
			]
		}
		return res
	}
	WASMIOBuffer[0] = windowSize.x
	WASMIOBuffer[1] = windowSize.y

	WASMIOBuffer[2] = cameraPosition.x
	WASMIOBuffer[3] = cameraPosition.y
	WASMIOBuffer[4] = cameraPosition.z

	WASMIOBuffer[5] = cameraAngles.x
	WASMIOBuffer[6] = cameraAngles.y
	WASMIOBuffer[7] = cameraAngles.z

	WASMIOBuffer[8] = cameraDistance

	WASMIOBuffer[9] = fov

	WASMIOBuffer[10] = screens.length

	screens.forEach((screen, i) => {
		WASMIOBuffer[11 + i * 2 + 0] = screen.x
		WASMIOBuffer[11 + i * 2 + 1] = screen.y
	})

	wasm.ScreenToWorldFar()
	return screens.map(
		(_, i) =>
			new Vector3(
				WASMIOBuffer[i * 3 + 0],
				WASMIOBuffer[i * 3 + 1],
				WASMIOBuffer[i * 3 + 2]
			)
	)
}

export function WorldToScreen(
	position: Vector3,
	cameraPosition: Vector3,
	cameraDistance: number,
	cameraAngles: QAngle,
	windowSize: Vector2
): Nullable<Vector2> {
	WASMIOBuffer[0] = position.x
	WASMIOBuffer[1] = position.y
	WASMIOBuffer[2] = position.z

	WASMIOBuffer[3] = cameraPosition.x
	WASMIOBuffer[4] = cameraPosition.y
	WASMIOBuffer[5] = cameraPosition.z

	WASMIOBuffer[6] = cameraAngles.x
	WASMIOBuffer[7] = cameraAngles.y
	WASMIOBuffer[8] = cameraAngles.z

	WASMIOBuffer[9] = cameraDistance

	WASMIOBuffer[10] = windowSize.x
	WASMIOBuffer[11] = windowSize.y

	if (wasm.WorldToScreen() === 0) return undefined
	return new Vector2(WASMIOBuffer[0], WASMIOBuffer[1])
}

export function ScreenToWorld(
	screen: Vector2,
	cameraPosition: Vector3,
	cameraDistance: number,
	cameraAngles: QAngle,
	windowSize: Vector2
): Vector3 {
	WASMIOBuffer[0] = screen.x
	WASMIOBuffer[1] = screen.y

	WASMIOBuffer[2] = cameraPosition.x
	WASMIOBuffer[3] = cameraPosition.y
	WASMIOBuffer[4] = cameraPosition.z

	WASMIOBuffer[5] = cameraAngles.x
	WASMIOBuffer[6] = cameraAngles.y
	WASMIOBuffer[7] = cameraAngles.z

	WASMIOBuffer[8] = cameraDistance

	WASMIOBuffer[9] = windowSize.x
	WASMIOBuffer[10] = windowSize.y

	wasm.ScreenToWorld()
	return new Vector3(WASMIOBuffer[0], WASMIOBuffer[1], WASMIOBuffer[2])
}

export function ParseVHCG(stream: ReadableBinaryStream): void {
	try {
		const addr = wasm.malloc(stream.Size)
		if (addr === 0) throw "Memory allocation for VHCG raw data failed"
		stream.ReadSliceTo(new Uint8Array(wasm.memory.buffer, addr, stream.Size))

		const err = wasm.ParseVHCG(addr, stream.Size)
		if (err !== HeightMapParseError.NONE) {
			if (err < 0) throw `VHCG parse failed with READ_ERROR ${-err}`
			throw `VHCG parse failed with ${HeightMapParseError[err]}`
		}
		HeightMap = new CHeightMap(
			new Vector2(WASMIOBuffer[0], WASMIOBuffer[1]),
			new Vector2(WASMIOBuffer[2], WASMIOBuffer[3])
		)
	} catch (e) {
		console.error("Error in HeightMap init", e)
		HeightMap = undefined
	}
}

export function ResetVHCG(): void {
	HeightMap = undefined
}

export function GetPositionHeight(loc: Vector2 | Vector3): number {
	WASMIOBuffer[0] = loc.x
	WASMIOBuffer[1] = loc.y

	wasm.GetHeightForLocation()
	return WASMIOBuffer[0]
}

export function IsPointUnderWater(loc: Vector2 | Vector3): boolean {
	WASMIOBuffer[0] = loc.x
	WASMIOBuffer[1] = loc.y

	return wasm.IsPointUnderWater() !== 0
}

export function GetLocationAverageHeight(
	position: Vector2,
	count: number,
	distance: number
): number {
	WASMIOBuffer[0] = position.x
	WASMIOBuffer[1] = position.y
	WASMIOBuffer[2] = count
	WASMIOBuffer[3] = distance

	wasm.GetLocationAverageHeight()
	return WASMIOBuffer[0]
}

export function CloneWorldToProjection(mat: ArrayLike<number>): void {
	WASMIOBuffer.set(mat)
	wasm.CloneWorldToProjection()
}

export function WorldToScreenNew(
	position: Vector3,
	windowSize: Vector2
): Nullable<Vector2> {
	WASMIOBuffer[0] = position.x
	WASMIOBuffer[1] = position.y
	WASMIOBuffer[2] = position.z

	WASMIOBuffer[3] = windowSize.x
	WASMIOBuffer[4] = windowSize.y
	if (wasm.WorldToScreenNew() === 0) return undefined
	return new Vector2(WASMIOBuffer[0], WASMIOBuffer[1])
}

export function DecompressVertexBuffer(
	data: Uint8Array,
	elemCount: number,
	elemSize: number
): Uint8Array {
	const size = data.byteLength
	const bufAddr = wasm.malloc(size)
	if (bufAddr === 0)
		throw "Memory allocation for DecompressVertexBuffer raw data failed"
	new Uint8Array(wasm.memory.buffer, bufAddr, size).set(data)

	const addr = wasm.DecompressVertexBuffer(bufAddr, size, elemCount, elemSize)
	const copy = new Uint8Array(elemCount * elemSize)
	copy.set(new Uint8Array(wasm.memory.buffer, addr, copy.byteLength))
	wasm.free(addr)

	return copy
}

export function DecompressIndexBuffer(
	data: Uint8Array,
	elemCount: number,
	elemSize: number
): Uint8Array {
	const size = data.byteLength
	const bufAddr = wasm.malloc(size)
	if (bufAddr === 0)
		throw "Memory allocation for DecompressIndexBuffer raw data failed"
	new Uint8Array(wasm.memory.buffer, bufAddr, size).set(data)

	const addr = wasm.DecompressIndexBuffer(bufAddr, size, elemCount, elemSize)
	const copy = new Uint8Array(elemCount * elemSize)
	copy.set(new Uint8Array(wasm.memory.buffer, addr, copy.byteLength))
	wasm.free(addr)

	return copy
}

export function ResetWorld(): void {
	wasm.ResetWorld()
}

export function LoadWorldMesh(
	id: number,
	vertexBuffer: Uint8Array,
	vertexSize: number,
	indexBuffer: Uint8Array,
	indexSize: number,
	flags: number,
	pathID: number
): void {
	const vertexAddr = wasm.malloc(vertexBuffer.byteLength)
	if (vertexAddr === 0)
		throw "Memory allocation for LoadWorldMesh vertexBuffer raw data failed"
	new Uint8Array(wasm.memory.buffer, vertexAddr, vertexBuffer.byteLength).set(
		vertexBuffer
	)

	const indexAddr = wasm.malloc(indexBuffer.byteLength)
	if (indexAddr === 0)
		throw "Memory allocation for LoadWorldMesh indexBuffer raw data failed"
	new Uint8Array(wasm.memory.buffer, indexAddr, indexBuffer.byteLength).set(
		indexBuffer
	)

	wasm.LoadWorldMesh(
		id,
		vertexAddr,
		vertexBuffer.byteLength,
		vertexSize,
		indexAddr,
		indexBuffer.byteLength,
		indexSize,
		flags,
		pathID
	)
}

export function LoadWorldMeshCached(
	id: number,
	triangles: Uint8Array,
	nodes: Uint8Array,
	indices: Uint8Array,
	flags: number,
	pathID: number
): void {
	const trianglesAddr = wasm.malloc(triangles.byteLength)
	if (trianglesAddr === 0)
		throw "Memory allocation for LoadWorldMeshCached triangles raw data failed"
	new Uint8Array(wasm.memory.buffer, trianglesAddr, triangles.byteLength).set(
		triangles
	)

	const nodesAddr = wasm.malloc(nodes.byteLength)
	if (nodesAddr === 0)
		throw "Memory allocation for LoadWorldMeshCached nodes raw data failed"
	new Uint8Array(wasm.memory.buffer, nodesAddr, nodes.byteLength).set(nodes)

	const indicesAddr = wasm.malloc(indices.byteLength)
	if (indicesAddr === 0)
		throw "Memory allocation for LoadWorldMeshCached indices raw data failed"
	new Uint8Array(wasm.memory.buffer, indicesAddr, indices.byteLength).set(
		indices
	)

	wasm.LoadWorldMeshCached(
		id,
		trianglesAddr,
		triangles.byteLength,
		nodesAddr,
		nodes.byteLength,
		indicesAddr,
		indices.byteLength,
		flags,
		pathID
	)
}

export function SpawnWorldMesh(id: number, transform: ArrayLike<number>): void {
	WASMIOBuffer.set(transform)
	wasm.SpawnWorldMesh(id)
}

export function FinishWorld(
	cachedBVH?: Nullable<[Uint8Array, Uint8Array]>
): void {
	if (cachedBVH !== undefined) {
		const cachedBVH1Addr = wasm.malloc(cachedBVH[0].byteLength)
		if (cachedBVH1Addr === 0)
			throw "Memory allocation for FinishWorld cachedBVH[0] raw data failed"
		new Uint8Array(
			wasm.memory.buffer,
			cachedBVH1Addr,
			cachedBVH[0].byteLength
		).set(cachedBVH[0])

		const cachedBVH2Addr = wasm.malloc(cachedBVH[1].byteLength)
		if (cachedBVH2Addr === 0)
			throw "Memory allocation for FinishWorld cachedBVH[1] raw data failed"
		new Uint8Array(
			wasm.memory.buffer,
			cachedBVH2Addr,
			cachedBVH[1].byteLength
		).set(cachedBVH[1])

		wasm.FinishWorld(
			cachedBVH1Addr,
			cachedBVH[0].byteLength,
			cachedBVH2Addr,
			cachedBVH[1].byteLength
		)
	} else wasm.FinishWorld(0, 0, 0, 0)
}

export function ExtractWorldBVH(): [Uint8Array, Uint8Array] {
	wasm.ExtractWorldBVH()
	return [
		new Uint8Array(wasm.memory.buffer, WASMIOBufferU32[0], WASMIOBufferU32[1]),
		new Uint8Array(wasm.memory.buffer, WASMIOBufferU32[2], WASMIOBufferU32[3])
	]
}

export function ExtractMeshData(
	id: number
): Nullable<[number, Uint8Array, Uint8Array, Uint8Array, number, number]> {
	wasm.ExtractMeshData(id)
	if (
		WASMIOBufferU32[1] === 0 ||
		WASMIOBufferU32[3] === 0 ||
		WASMIOBufferU32[5] === 0
	)
		return undefined
	return [
		id,
		new Uint8Array(wasm.memory.buffer, WASMIOBufferU32[0], WASMIOBufferU32[1]),
		new Uint8Array(wasm.memory.buffer, WASMIOBufferU32[2], WASMIOBufferU32[3]),
		new Uint8Array(wasm.memory.buffer, WASMIOBufferU32[4], WASMIOBufferU32[5]),
		WASMIOBufferU32[6],
		WASMIOBufferU32[7]
	]
}

const maxHitboxes = (ioBufferSize - 7) / (3 * 2)
export function BatchCheckRayBox(
	startPos: Vector3,
	ray: Vector3,
	hitboxes: AABB[]
): boolean[] {
	if (hitboxes.length > maxHitboxes) {
		let res: boolean[] = []
		for (let i = 0; i < hitboxes.length; i += maxHitboxes) {
			res = [
				...res,
				...BatchCheckRayBox(startPos, ray, hitboxes.slice(i, i + maxHitboxes))
			]
		}
		return res
	}
	WASMIOBuffer[0] = startPos.x
	WASMIOBuffer[1] = startPos.y
	WASMIOBuffer[2] = startPos.z

	WASMIOBuffer[3] = ray.x
	WASMIOBuffer[4] = ray.y
	WASMIOBuffer[5] = ray.z

	WASMIOBuffer[6] = hitboxes.length

	hitboxes.forEach((hitbox, i) => {
		WASMIOBuffer[7 + i * 3 * 2 + 0] = hitbox.Base.x + hitbox.MinOffset.x
		WASMIOBuffer[7 + i * 3 * 2 + 1] = hitbox.Base.y + hitbox.MinOffset.y
		WASMIOBuffer[7 + i * 3 * 2 + 2] =
			hitbox.Base.z + hitbox.MinOffset.z + hitbox.DeltaZ
		WASMIOBuffer[7 + i * 3 * 2 + 3] = hitbox.Base.x + hitbox.MaxOffset.x
		WASMIOBuffer[7 + i * 3 * 2 + 4] = hitbox.Base.y + hitbox.MaxOffset.y
		WASMIOBuffer[7 + i * 3 * 2 + 5] =
			hitbox.Base.z + hitbox.MaxOffset.z + hitbox.DeltaZ
	})

	wasm.BatchCheckRayBox()
	return hitboxes.map((_, i) => WASMIOBufferView.getUint8(i) !== 0)
}
