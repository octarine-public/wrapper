import { QAngle } from "../../Base/QAngle"
import { Vector2 } from "../../Base/Vector2"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { GUIInfo } from "../../GUI/GUIInfo"
import { FakeUnit } from "../Base/FakeUnit"
import { RoshanSpawner } from "../Base/RoshanSpawner"
import { Unit } from "../Base/Unit"

@WrapperClass("CDOTA_Unit_Roshan")
export class Roshan extends Unit {
	public static HP = 0
	public static MaxHP = 0
	public static HPRegenCounter = 0
	public static Spawner: Nullable<RoshanSpawner>
	public static Instance: Nullable<Unit | FakeUnit>

	public static readonly BaseHP = 6000
	public static readonly StaticMoveSpeed = 270
	public static readonly HPChangedPerMinute = 130
	public static readonly StaticAngles = new QAngle()

	public static get Angles() {
		return this.Instance === undefined ? this.StaticAngles : this.Instance.Angles
	}
	public static get MoveSpeed() {
		return this.Instance === undefined
			? this.StaticMoveSpeed
			: this.Instance.MoveSpeed
	}
	public static get HPRegen() {
		return 20
	}

	public PredictionMoveSpeed = 0
	public readonly PredictionAngles = new QAngle()
	@NetworkedBasicField("m_bGoldenRoshan")
	public GoldenRoshan = false

	/** @ignore */
	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.IsRoshan = true
	}
	public get Angles() {
		return this.IsVisible || Roshan.Spawner === undefined
			? super.Angles
			: this.PredictionAngles
	}
	public get MoveSpeed() {
		return this.IsVisible || Roshan.Spawner === undefined
			? super.MoveSpeed
			: this.PredictionMoveSpeed
	}
	public get RingRadius(): number {
		return 80
	}
	public get Position() {
		return this.IsVisible || Roshan.Spawner === undefined
			? super.Position
			: Roshan.Spawner.Position
	}
	public get HealthBarSize() {
		return new Vector2(GUIInfo.ScaleHeight(225), GUIInfo.ScaleHeight(5))
	}
	public get HealthBarPositionCorrection() {
		return new Vector2(this.HealthBarSize.x / 2, GUIInfo.ScaleHeight(9))
	}
}
