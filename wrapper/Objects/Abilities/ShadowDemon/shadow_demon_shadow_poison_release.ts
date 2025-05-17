import { WrapperClass } from "../../../Decorators"
import { DAMAGE_TYPES } from "../../../Enums/DAMAGE_TYPES"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"
import { modifier_shadow_demon_shadow_poison } from "../../Modifiers/Abilities/ShadowDemon/modifier_shadow_demon_shadow_poison"

@WrapperClass("shadow_demon_shadow_poison_release")
export class shadow_demon_shadow_poison_release extends Ability implements INuke {
	public get DamageType(): DAMAGE_TYPES {
		return DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetRawDamage(target: Unit): number {
		const modifier = target.GetBuffByClass(modifier_shadow_demon_shadow_poison)
		return modifier?.RawBonusDamage ?? 0
	}
}
