import { Vector2 } from "../../Base/Vector2"
import { WrapperClass } from "../../Decorators"
import { ScaleHeight } from "../../GUI/Helpers"
import { Creep } from "../Base/Creep"

@WrapperClass("CDOTA_Unit_VisageFamiliar")
export class npc_dota_visage_familiar extends Creep {
	public get HealthBarSize() {
		return new Vector2(ScaleHeight(100), ScaleHeight(8))
	}
	public get HealthBarPositionCorrection() {
		return new Vector2(
			this.HealthBarSize.x / 2,
			this.IsEnemy() ? ScaleHeight(23) : ScaleHeight(24)
		)
	}
}
