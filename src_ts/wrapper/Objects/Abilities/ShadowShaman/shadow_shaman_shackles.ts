import Ability from "../../Base/Ability"

export default class shadow_shaman_shackles extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_ShadowShaman_Shackles>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("shadow_shaman_shackles", shadow_shaman_shackles)
