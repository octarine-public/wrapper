import { Vector2 } from "../../Base/Vector2"
import { WrapperClass } from "../../Decorators"
import { GUIInfo } from "../../GUI/GUIInfo"
import { Hero } from "../Base/Hero"

@WrapperClass("CDOTA_Unit_Hero_Medusa")
export class npc_dota_hero_medusa extends Hero {
	public get HealthBarSize() {
		return new Vector2(
			GUIInfo.ScaleHeight(this.IsMyHero ? 107 : 99),
			GUIInfo.ScaleHeight(8)
		)
	}
}
