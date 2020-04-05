import Ability from "../../Base/Ability"

export default class lina_laguna_blade extends Ability {
	public get DamageType(): DAMAGE_TYPES {
		return this.Owner?.HasScepter ? DAMAGE_TYPES.DAMAGE_TYPE_PURE : DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lina_laguna_blade", lina_laguna_blade)
