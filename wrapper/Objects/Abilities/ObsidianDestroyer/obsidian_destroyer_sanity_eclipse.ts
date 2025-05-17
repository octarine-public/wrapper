import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("obsidian_destroyer_sanity_eclipse")
export class obsidian_destroyer_sanity_eclipse extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("base_damage", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const baseDamage = super.GetRawDamage(target),
			multiplier = this.GetSpecialValue("damage_multiplier"),
			bonusDamage = (owner.MaxMana - target.MaxMana) * multiplier
		return baseDamage + bonusDamage
	}
}
