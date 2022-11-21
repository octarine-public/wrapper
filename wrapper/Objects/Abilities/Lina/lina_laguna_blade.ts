import { WrapperClass } from "../../../Decorators"
import { DAMAGE_TYPES } from "../../../Enums/DAMAGE_TYPES"
import { Ability } from "../../Base/Ability"

@WrapperClass("lina_laguna_blade")
export class lina_laguna_blade extends Ability {
	public get DamageType(): DAMAGE_TYPES {
		return this.Owner?.HasScepter
			? DAMAGE_TYPES.DAMAGE_TYPE_PURE
			: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
	}
}
