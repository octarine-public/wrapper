import Ability from "../../Base/Ability"

export default class techies_suicide extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Techies_Suicide>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("techies_suicide", techies_suicide)
