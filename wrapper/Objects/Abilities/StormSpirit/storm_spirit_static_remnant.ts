import { WrapperClass } from "../../../Decorators"
import { DOTA_ABILITY_BEHAVIOR } from "../../../Enums/DOTA_ABILITY_BEHAVIOR"
import { Ability } from "../../Base/Ability"
import { Hero } from "../../Base/Hero"

@WrapperClass("storm_spirit_static_remnant")
export class storm_spirit_static_remnant extends Ability implements INuke {
	public get AbilityBehaviorMask(): DOTA_ABILITY_BEHAVIOR {
		const owner = this.Owner
		if (!(owner instanceof Hero)) {
			return super.AbilityBehaviorMask
		}
		return owner.HeroFacetID !== 2 || this.AltCastState
			? super.AbilityBehaviorMask
			: DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("static_remnant_radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("static_remnant_damage", level)
	}
}
