import { WrapperClass } from "../../Decorators"
import { Attributes } from "../../Enums/Attributes"
import { DAMAGE_TYPES } from "../../Enums/DAMAGE_TYPES"
import { Item } from "../Base/Item"

@WrapperClass("item_ethereal_blade")
export class item_ethereal_blade extends Item {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
	public get AbilityDamage(): number {
		const owner = this.Owner
		let damage = this.GetSpecialValue("blast_damage_base")
		if (owner !== undefined) {
			const multiplier = this.GetSpecialValue("blast_agility_multiplier")
			switch (owner.PrimaryAtribute) {
				case Attributes.DOTA_ATTRIBUTE_STRENGTH:
					damage += multiplier * owner.TotalStrength
					break
				case Attributes.DOTA_ATTRIBUTE_AGILITY:
					damage += multiplier * owner.TotalAgility
					break
				case Attributes.DOTA_ATTRIBUTE_INTELLECT:
					damage += multiplier * owner.TotalIntellect
					break
			}
		}
		return damage
	}
	public get DamageType(): DAMAGE_TYPES {
		return DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
	}
}
