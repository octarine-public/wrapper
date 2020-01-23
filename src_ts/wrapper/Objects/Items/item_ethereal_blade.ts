import Item from "../Base/Item"
import Hero from "../Base/Hero"

export default class item_ethereal_blade extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_Ethereal_Blade

	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
	public get AbilityDamage(): number {

		let hero = this.Owner as Hero,
			damage = this.GetSpecialValue("blast_damage_base"),
			multiplier = this.GetSpecialValue("blast_agility_multiplier")

		switch (hero.PrimaryAtribute) {
			case Attributes.DOTA_ATTRIBUTE_STRENGTH:
				damage += multiplier * hero.TotalStrength
				break
			case Attributes.DOTA_ATTRIBUTE_AGILITY:
				damage += multiplier * hero.TotalAgility
				break
			case Attributes.DOTA_ATTRIBUTE_INTELLECT:
				damage += multiplier * hero.TotalIntellect
				break
		}
		return damage
	}
	public get DamageType(): DAMAGE_TYPES {
		return DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"

RegisterClass("item_ethereal_blade", item_ethereal_blade)
