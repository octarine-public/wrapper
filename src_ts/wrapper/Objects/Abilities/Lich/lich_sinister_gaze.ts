import Ability from "../../Base/Ability"

export default class lich_sinister_gaze extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Lich_Sinister_Gaze>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lich_sinister_gaze", lich_sinister_gaze)
