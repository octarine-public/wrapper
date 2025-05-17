import { WrapperClass } from "../../Decorators"
import { ScaleHeight } from "../../GUI/Helpers"
import { Hero } from "../Base/Hero"

@WrapperClass("CDOTA_Unit_Hero_Huskar")
export class npc_dota_hero_huskar extends Hero {
	public get HealthBarSize() {
		return super.HealthBarSize.SetY(ScaleHeight(11))
	}
	public get HealthBarPositionCorrection() {
		const position = super.HealthBarPositionCorrection
		switch (true) {
			case this.IsMyHero:
				return position.SetY(ScaleHeight(37))
			case !this.IsEnemy():
				return position.SetY(ScaleHeight(32))
			case this.ModifierManager.IsMorphlingReplicateIllusion_:
				return position.SetY(ScaleHeight(11))
			default:
				return position.SetY(ScaleHeight(30))
		}
	}
}
