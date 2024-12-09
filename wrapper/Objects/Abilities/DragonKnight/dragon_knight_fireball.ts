import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("dragon_knight_fireball")
export class dragon_knight_fireball extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return (this.Owner?.HasBuffByName("modifier_dragon_knight_dragon_form") ?? false)
			? this.GetSpecialValue("dragon_form_cast_range", level)
			: this.GetSpecialValue("melee_cast_range", level)
	}
}
