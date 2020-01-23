import Ability from "../Base/Ability"
export default class skywrath_mage_arcane_bolt extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Skywrath_Mage_Arcane_Bolt

	public get Speed(): number {
		return this.GetSpecialValue("bolt_speed")
	}
	public get AbilityDamage(): number {
		let damage = this.GetSpecialValue("bolt_damage")

		if (this.Owner)
			damage += this.Owner.TotalIntellect * this.GetSpecialValue("int_multiplier")

		return damage

	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"

RegisterClass("skywrath_mage_arcane_bolt", skywrath_mage_arcane_bolt)
