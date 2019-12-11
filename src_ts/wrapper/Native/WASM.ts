import QAngle from "../Base/QAngle"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import { RendererSDK } from "../Imports"

var wasm = new WebAssembly.Instance(new WebAssembly.Module(readFile("~/wrapper.wasm")), {}).exports as any as {
	_start: () => void,
	CacheFrame: () => void,
	GetIOBuffer: () => number,
	memory: WebAssembly.Memory,
	ScreenToWorld: () => void,
	ScreenToWorldCached: () => void,
	WorldToScreen: () => boolean,
	WorldToScreenCached: () => boolean,
	my_malloc: (size: number) => number,
	my_free: (ptr: number) => void,
	ParseImage: (ptr: number, size: number) => number
}
globalThis.wasm = wasm
wasm._start()

var IOBuffer = new Float32Array(wasm.memory.buffer, wasm.GetIOBuffer())
globalThis.WASMIOBuffer = IOBuffer

export function OnDraw() {
	let camera_position = Vector3.fromIOBuffer(Camera.Position) || new Vector3()
	IOBuffer[0] = camera_position.x
	IOBuffer[1] = camera_position.y
	IOBuffer[2] = camera_position.z

	let camera_angles = QAngle.fromIOBuffer(Camera.Angles)
	IOBuffer[3] = camera_angles.x
	IOBuffer[4] = camera_angles.y
	IOBuffer[5] = camera_angles.z

	IOBuffer[6] = Camera.Distance || 1134

	IOBuffer[7] = RendererSDK.WindowSize.x
	IOBuffer[8] = RendererSDK.WindowSize.y

	wasm.CacheFrame()
}

export function WorldToScreenCached(position: Vector3 | Vector2) {
	IOBuffer[0] = position.x
	IOBuffer[1] = position.y
	IOBuffer[2] = position instanceof Vector2 ? RendererSDK.GetPositionHeight(position) : position.z

	return wasm.WorldToScreenCached() ? new Vector2(IOBuffer[0], IOBuffer[1]) : undefined
}

export function ScreenToWorldCached(screen: Vector2): Vector3 {
	IOBuffer[0] = screen.x
	IOBuffer[1] = screen.y
	wasm.ScreenToWorldCached()
	return new Vector3(IOBuffer[0], IOBuffer[1], IOBuffer[2])
}

export function WorldToScreen(
	position: Vector3 | Vector2,
	camera_position: Vector3 | Vector2,
	camera_distance: number,
	camera_angles: QAngle,
	window_size: Vector2,
): Vector2 {
	IOBuffer[0] = position.x
	IOBuffer[1] = position.y
	IOBuffer[2] = position instanceof Vector2 ? RendererSDK.GetPositionHeight(position) : position.z

	IOBuffer[3] = camera_position.x
	IOBuffer[4] = camera_position.y
	IOBuffer[5] = camera_position instanceof Vector2
		? Vector3.fromIOBuffer(Camera.Position).z - Math.sin(camera_angles.x / 180 * Math.PI) * Camera.Distance + Math.sin(camera_angles.x / 180 * Math.PI) * camera_distance
		: camera_position.z

	IOBuffer[6] = camera_angles.x
	IOBuffer[7] = camera_angles.y
	IOBuffer[8] = camera_angles.z

	IOBuffer[9] = camera_distance

	IOBuffer[10] = window_size.x
	IOBuffer[11] = window_size.y

	return wasm.WorldToScreen() ? new Vector2(IOBuffer[0], IOBuffer[1]) : undefined
}

export function ScreenToWorld(
	screen: Vector2,
	camera_position: Vector3 | Vector2,
	camera_distance: number,
	camera_angles: QAngle,
	window_size: Vector2,
): Vector3 {
	IOBuffer[0] = screen.x
	IOBuffer[1] = screen.y

	IOBuffer[2] = camera_position.x
	IOBuffer[3] = camera_position.y
	IOBuffer[4] = camera_position instanceof Vector2
		? Vector3.fromIOBuffer(Camera.Position).z - Math.sin(camera_angles.x / 180 * Math.PI) * Camera.Distance + Math.sin(camera_angles.x / 180 * Math.PI) * camera_distance
		: camera_position.z

	IOBuffer[5] = camera_angles.x
	IOBuffer[6] = camera_angles.y
	IOBuffer[7] = camera_angles.z

	IOBuffer[8] = camera_distance

	IOBuffer[9] = window_size.x
	IOBuffer[10] = window_size.y

	wasm.ScreenToWorld()
	return new Vector3(IOBuffer[0], IOBuffer[1], IOBuffer[2])
}

export function ParseImage(buf: ArrayBuffer): [Uint8Array, Vector2] {
	if (buf === undefined)
		return [new Uint8Array(new Array(4).fill(0xFF)), new Vector2(1, 1)]

	let addr = wasm.my_malloc(buf.byteLength)
	let memory = new Uint8Array(wasm.memory.buffer, addr)
	memory.set(new Uint8Array(buf))

	addr = wasm.ParseImage(addr, buf.byteLength)
	if (addr === 0)
		throw "Image conversion failed"
	let image_size = new Vector2(IOBuffer[0], IOBuffer[1])
	let copy = new Uint8Array(image_size.x * image_size.y * 4)
	copy.set(new Uint8Array(wasm.memory.buffer, addr, copy.byteLength))
	wasm.my_free(addr)

	return [copy, image_size]
}
