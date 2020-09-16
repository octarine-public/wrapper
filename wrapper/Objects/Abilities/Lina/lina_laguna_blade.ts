import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("lina_laguna_blade")
export default class lina_laguna_blade extends Ability {
	public get DamageType(): DAMAGE_TYPES {
		return this.Owner?.HasScepter ? DAMAGE_TYPES.DAMAGE_TYPE_PURE : DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
	}
}
