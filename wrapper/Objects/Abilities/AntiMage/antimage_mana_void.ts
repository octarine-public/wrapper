import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("antimage_mana_void")
export class antimage_mana_void extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("mana_void_aoe_radius", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0 || target.MaxMana === 0) {
			return 0
		}
		const multiplier = this.GetSpecialValue("mana_void_damage_per_mana")
		return (target.MaxMana - target.Mana) * multiplier
	}
}
