import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("troll_warlord_whirling_axes_ranged")
export class troll_warlord_whirling_axes_ranged extends Ability {
	public get EndRadius(): number {
		return 206.17 // noе in special data
	}
	public get Speed(): number {
		return this.GetSpecialValue("axe_speed")
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("axe_range", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("axe_width", level)
	}
	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}
}
