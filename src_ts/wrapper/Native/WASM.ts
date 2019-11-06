import QAngle from "../Base/QAngle"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import { RendererSDK } from "../Imports"
import UserCmd from "./UserCmd"

var wasm = new WebAssembly.Instance(new WebAssembly.Module(readFile("~/wrapper.wasm")), {}).exports
global.wasm = wasm
wasm._start()

var IOBuffer = new Float32Array(wasm.memory.buffer, wasm.GetIOBuffer())
global.WASMIOBuffer = IOBuffer

var camera_angles = new QAngle(60, 90, 0)

export function OnDraw() {
	let camera_position = Vector3.fromIOBuffer(Camera.Position) || new Vector3()
	IOBuffer[0] = camera_position.x
	IOBuffer[1] = camera_position.y
	IOBuffer[2] = camera_position.z

	let new_camera_angles = QAngle.fromIOBuffer(Camera.Angles)
	if (new_camera_angles !== undefined)
		new_camera_angles.CopyTo(camera_angles)
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
