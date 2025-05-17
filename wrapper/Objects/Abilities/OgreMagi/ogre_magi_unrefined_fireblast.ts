import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("ogre_magi_unrefined_fireblast")
export class ogre_magi_unrefined_fireblast extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("base_damage", level)
	}
	public GetBaseManaCostForLevel(level: number): number {
		const owner = this.Owner
		if (owner === undefined) {
			return super.GetBaseManaCostForLevel(level)
		}
		const multiplier = this.GetSpecialValue("scepter_mana", level)
		return (owner.Mana * multiplier) / 100
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const multiplier = this.GetSpecialValue("str_multiplier")
		return super.GetRawDamage(target) + owner.TotalStrength * multiplier
	}
}
