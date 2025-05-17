import { Vector2 } from "../../Base/Vector2"
import { WrapperClass } from "../../Decorators"
import { ScaleHeight } from "../../GUI/Helpers"
import { Creep } from "../Base/Creep"

@WrapperClass("CDOTA_Unit_Brewmaster_PrimalEarth")
export class npc_dota_brewmaster_earth extends Creep {
	public get HealthBarSize() {
		return new Vector2(ScaleHeight(100), ScaleHeight(8))
	}
	public get HealthBarPositionCorrection() {
		return new Vector2(this.HealthBarSize.x / 2, ScaleHeight(23))
	}
}
