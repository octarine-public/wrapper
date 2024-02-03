import { Color } from "../../Base/Color"
import { Vector3 } from "../../Base/Vector3"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { ERoshanLocation } from "../../Enums/ERoshanLocation"
import { RenderMode } from "../../Enums/RenderMode"
import { Entity, GameRules } from "./Entity"

@WrapperClass("CDOTA_RoshanSpawner")
export class RoshanSpawner extends Entity {
	@NetworkedBasicField("m_iKillCount")
	public readonly KillCount = 0
	@NetworkedBasicField("m_vRoshanAltLocation")
	public readonly AltLocation = new Vector3().Invalidate()

	public set CustomGlowColor(_: Nullable<Color>) {
		// N/A for non-networked entities
	}
	public set CustomDrawColor(_: Nullable<[Color, RenderMode]>) {
		// N/A for non-networked entities
	}
	public get LocationType() {
		return !this.AltLocation.IsValid || (GameRules?.IsNightGameTime ?? false)
			? ERoshanLocation.TOP
			: ERoshanLocation.BOT
	}
	public get Position() {
		switch (this.LocationType) {
			case ERoshanLocation.TOP:
				return this.AltLocation
			default:
				return super.Position
		}
	}
	public get RoshanPosition() {
		const position = this.Position.Clone()
		switch (this.LocationType) {
			case ERoshanLocation.TOP:
				return position.SubtractScalarZ(114)
			default:
				return position.SubtractScalarZ(50)
		}
	}
}
