import Ability from "../../Base/Ability"

export default class shadow_demon_shadow_poison_release extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Shadow_Demon_Shadow_Poison_Release>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("shadow_demon_shadow_poison_release", shadow_demon_shadow_poison_release)
