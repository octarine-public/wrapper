import Ability from "../../Base/Ability"

export default class puck_dream_coil extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Puck_DreamCoil>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("puck_dream_coil", puck_dream_coil)
