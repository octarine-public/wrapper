import Item from "../Base/Item"
import Hero from "../Base/Hero"
import { WrapperClass } from "../../Decorators"

@WrapperClass("item_ethereal_blade")
export default class item_ethereal_blade extends Item {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
	public get AbilityDamage(): number {
		let damage = this.GetSpecialValue("blast_damage_base"),
			owner = this.Owner
		if (owner instanceof Hero) {
			let multiplier = this.GetSpecialValue("blast_agility_multiplier")
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
	public get ProjectileName() {
		return ["particles/items_fx/ethereal_blade.vpcf"]
	}
}
