import { WrapperClass } from "../../Decorators"
import { GUIInfo } from "../../GUI/GUIInfo"
import { Hero } from "../Base/Hero"

@WrapperClass("CDOTA_Unit_Hero_Huskar")
export class npc_dota_hero_huskar extends Hero {
	public get HealthBarSize() {
		return super.HealthBarSize.SetY(GUIInfo.ScaleHeight(11))
	}
	public get HealthBarPositionCorrection() {
		const position = super.HealthBarPositionCorrection
		switch (true) {
			case this.IsMyHero:
				return position.SetY(GUIInfo.ScaleHeight(37))
			case !this.IsEnemy():
				return position.SetY(GUIInfo.ScaleHeight(32))
			case this.HasBuffByName("modifier_morphling_replicate_illusion"):
				return position.SetY(GUIInfo.ScaleHeight(11))
			default:
				return position.SetY(GUIInfo.ScaleHeight(30))
		}
	}
}
