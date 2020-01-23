import Ability from "../../Base/Ability"

export default class shadow_shaman_voodoo extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_ShadowShamanVoodoo>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("shadow_shaman_voodoo", shadow_shaman_voodoo)
