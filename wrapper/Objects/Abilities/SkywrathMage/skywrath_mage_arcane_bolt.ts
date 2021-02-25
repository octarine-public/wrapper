import { WrapperClass } from "../../../Decorators"
import { SPELL_IMMUNITY_TYPES } from "../../../Enums/SPELL_IMMUNITY_TYPES"
import Ability from "../../Base/Ability"

@WrapperClass("skywrath_mage_arcane_bolt")
export default class skywrath_mage_arcane_bolt extends Ability {

	public get Speed(): number {
		return this.GetSpecialValue("bolt_speed")
	}

	public get AbilityDamage(): number {
		let damage = this.GetSpecialValue("bolt_damage")
		if (this.Owner !== undefined)
			damage += this.Owner.TotalIntellect * this.GetSpecialValue("int_multiplier")
		return damage
	}

	public get AbilityImmunityType(): SPELL_IMMUNITY_TYPES {
		const talent = this.Owner?.GetAbilityByName("special_bonus_unique_skywrath_6")
		if (talent === undefined || talent.Level === 0)
			return this.AbilityImmunityType

		return SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ENEMIES_YES
	}

	public get ProjectileName() {
		return [
			"particles/units/heroes/hero_skywrath_mage/skywrath_mage_arcane_bolt.vpcf",
			"particles/econ/items/skywrath_mage/skywrath_ti9_immortal_back/skywrath_mage_ti9_arcane_bolt.vpcf",
			"particles/econ/items/skywrath_mage/skywrath_ti9_immortal_back/skywrath_mage_ti9_arcane_bolt_golden.vpcf",
			"particles/econ/items/skywrath_mage/skywrath_ti9_immortal_back/skywrath_mage_ti9_arcane_bolt_crimson.vpcf",
		]
	}
}
