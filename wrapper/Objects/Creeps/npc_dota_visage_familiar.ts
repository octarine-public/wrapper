import { Vector2 } from "../../Base/Vector2"
import { WrapperClass } from "../../Decorators"
import { GUIInfo } from "../../GUI/GUIInfo"
import { Creep } from "../Base/Creep"

@WrapperClass("CDOTA_Unit_VisageFamiliar")
export class npc_dota_visage_familiar extends Creep {
	public get HealthBarSize() {
		return new Vector2(GUIInfo.ScaleHeight(100), GUIInfo.ScaleHeight(8))
	}
	public get HealthBarPositionCorrection() {
		return new Vector2(
			this.HealthBarSize.x / 2,
			this.IsEnemy() ? GUIInfo.ScaleHeight(23) : GUIInfo.ScaleHeight(24)
		)
	}
}
