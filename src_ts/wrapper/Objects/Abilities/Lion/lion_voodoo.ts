import Ability from "../../Base/Ability"

export default class lion_voodoo extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Lion_Voodoo>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lion_voodoo", lion_voodoo)
