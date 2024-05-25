import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("troll_warlord_whirling_axes_ranged")
export class troll_warlord_whirling_axes_ranged extends Ability {
	public get EndRadius(): number {
		return 206.17 // noе in special data
	}

	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("axe_range", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("axe_speed", level)
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("axe_width", level)
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("axe_damage", level)
	}
}
