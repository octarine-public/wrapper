import Ability from "../../Base/Ability"

export default class shadow_demon_shadow_poison extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Shadow_Demon_Shadow_Poison>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("shadow_demon_shadow_poison", shadow_demon_shadow_poison)
