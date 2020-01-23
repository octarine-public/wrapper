import Ability from "../../Base/Ability"

export default class slark_pounce extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Slark_Pounce>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("slark_pounce", slark_pounce)
