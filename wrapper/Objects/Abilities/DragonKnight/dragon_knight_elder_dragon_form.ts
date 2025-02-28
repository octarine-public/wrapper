import { WrapperClass } from "../../../Decorators"
import { DAMAGE_TYPES } from "../../../Enums/DAMAGE_TYPES"
import { Ability } from "../../Base/Ability"

@WrapperClass("dragon_knight_elder_dragon_form")
export class dragon_knight_elder_dragon_form extends Ability {
	public get DamageType(): DAMAGE_TYPES {
		return this.HeroFacetKey === 1
			? DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
			: super.DamageType
	}
}
