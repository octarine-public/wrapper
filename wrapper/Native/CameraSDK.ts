import { QAngle } from "../Base/QAngle"
import { Vector3 } from "../Base/Vector3"
import { EventPriority } from "../Enums/EventPriority"
import { WorldPolygon } from "../Geometry/WorldPolygon"
import { EventsSDK } from "../Managers/EventsSDK"
import { ConVarsSDK } from "./ConVarsSDK"

export const CameraSDK = new (class CCameraSDK {
	/** @readonly */
	public DefaultDistance = 1200
	public readonly DefaultAngles = new QAngle(60, 90, 0)
	/** @description Camera polygon update only with humanizer */
	public readonly Polygon = new WorldPolygon()

	constructor() {
		EventsSDK.on(
			"PreDraw",
			this.UpdateDefaultValues.bind(this),
			EventPriority.IMMEDIATE
		)
	}

	public get Angles() {
		return Camera.Angles ? QAngle.fromIOBuffer() : this.DefaultAngles
	}
	public set Angles(value: QAngle) {
		IOBuffer[0] = value.x
		IOBuffer[1] = value.y
		IOBuffer[2] = 0
		Camera.Angles = true
	}
	public get FoV(): number {
		return Camera.FoV
	}
	public get Distance(): number {
		return Camera.Distance
	}
	public set Distance(value: number) {
		Camera.Distance = value
	}
	public get Position(): Vector3 {
		return Camera.Position ? Vector3.fromIOBuffer() : new Vector3()
	}
	public UpdateDefaultValues() {
		const pith = ConVarsSDK.GetFloat("dota_camera_pitch_max", 60),
			yaw = ConVarsSDK.GetFloat("dota_camera_yaw", 90)
		this.DefaultAngles.CopyFrom(new QAngle(pith, yaw, 0))
		this.DefaultDistance = ConVarsSDK.GetFloat("dota_camera_distance", 1200)
	}
})()
