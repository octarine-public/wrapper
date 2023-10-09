import { AABB } from "../Base/AABB"
import { QAngle } from "../Base/QAngle"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { DegreesToRadian } from "../Utils/Math"

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
		const avgPos = cameraPosition
			.Clone()
			.AddScalarX(eyeVector.x * cameraDistance)
			.AddScalarY(eyeVector.y * cameraDistance)
		cameraOffset = WorldUtils.GetLocationAverageHeight(
			avgPos.x,
			avgPos.y,
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
	windowSize.toIOBuffer()
	cameraAngles.toIOBuffer(2)
	IOBuffer[5] = fov
	screen.toIOBuffer(6)

	WorldUtils.GetCursorRay()
	return new Vector3(IOBuffer[0], IOBuffer[1], IOBuffer[2])
}

const ioBufferSize = IOBuffer.length,
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

	windowSize.toIOBuffer()
	cameraPosition.toIOBuffer(2)
	cameraAngles.toIOBuffer(5)
	IOBuffer[8] = cameraDistance
	IOBuffer[9] = fov
	IOBuffer[10] = screens.length

	screens.forEach((screen, i) => {
		screen.toIOBuffer(11 + i * 2)
	})

	WorldUtils.ScreenToWorldFar()
	return screens.map((_, i) => Vector3.fromIOBuffer(i * 3))
}

export function WorldToScreen(
	position: Vector3,
	cameraPosition: Vector3,
	cameraDistance: number,
	cameraAngles: QAngle,
	windowSize: Vector2
): Nullable<Vector2> {
	position.toIOBuffer()
	cameraPosition.toIOBuffer(3)
	cameraAngles.toIOBuffer(6)
	IOBuffer[9] = cameraDistance
	IOBuffer[10] = windowSize.x
	IOBuffer[11] = windowSize.y

	if (!WorldUtils.WorldToScreen()) return undefined
	return Vector2.fromIOBuffer()
}

export function ScreenToWorld(
	screen: Vector2,
	cameraPosition: Vector3,
	cameraDistance: number,
	cameraAngles: QAngle,
	windowSize: Vector2
): Vector3 {
	screen.toIOBuffer()
	cameraPosition.toIOBuffer(2)
	cameraAngles.toIOBuffer(5)
	IOBuffer[8] = cameraDistance
	windowSize.toIOBuffer(9)

	WorldUtils.ScreenToWorld()
	return Vector3.fromIOBuffer()
}

export function ResetVHCG(): void {
	HeightMap = undefined
}

export function ParseVHCG(): void {
	if (!WorldUtils.GetHeightMapData()) {
		console.error("Error in HeightMap init: VHCG parse failed")
		HeightMap = undefined
		return
	}
	HeightMap = new CHeightMap(
		new Vector2(IOBuffer[0], IOBuffer[1]),
		new Vector2(IOBuffer[2], IOBuffer[3])
	)
}

export function GetPositionHeight(loc: Vector2 | Vector3): number {
	return WorldUtils.GetHeightForLocation(loc.x, loc.y)
}

export function WorldToScreenNew(
	position: Vector3,
	windowSize: Vector2
): Nullable<Vector2> {
	position.toIOBuffer()
	windowSize.toIOBuffer(3)

	if (!WorldUtils.WorldToScreenNew()) return undefined
	return Vector2.fromIOBuffer()
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

	startPos.toIOBuffer()
	ray.toIOBuffer(3)
	IOBuffer[6] = hitboxes.length

	hitboxes.forEach((hitbox, i) => {
		IOBuffer[7 + i * 3 * 2 + 0] = hitbox.Base.x + hitbox.MinOffset.x
		IOBuffer[7 + i * 3 * 2 + 1] = hitbox.Base.y + hitbox.MinOffset.y
		IOBuffer[7 + i * 3 * 2 + 2] =
			hitbox.Base.z + hitbox.MinOffset.z + hitbox.DeltaZ
		IOBuffer[7 + i * 3 * 2 + 3] = hitbox.Base.x + hitbox.MaxOffset.x
		IOBuffer[7 + i * 3 * 2 + 4] = hitbox.Base.y + hitbox.MaxOffset.y
		IOBuffer[7 + i * 3 * 2 + 5] =
			hitbox.Base.z + hitbox.MaxOffset.z + hitbox.DeltaZ
	})

	WorldUtils.BatchCheckRayBox()
	return hitboxes.map((_, i) => IOBufferView.getUint8(i) !== 0)
}
