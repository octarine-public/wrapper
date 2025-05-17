import { Vector2 } from "../../Base/Vector2"
import { WrapperClass } from "../../Decorators"
import { ScaleHeight } from "../../GUI/Helpers"
import { Creep } from "../Base/Creep"

@WrapperClass("CDOTA_BaseNPC_Warlock_Golem")
export class npc_dota_warlock_golem extends Creep {
	public get HealthBarSize() {
		return !this.IsEnemy()
			? new Vector2(ScaleHeight(100), ScaleHeight(6))
			: new Vector2(ScaleHeight(100), ScaleHeight(8))
	}
	public get HealthBarPositionCorrection() {
		return new Vector2(this.HealthBarSize.x / 2, ScaleHeight(23))
	}
}
