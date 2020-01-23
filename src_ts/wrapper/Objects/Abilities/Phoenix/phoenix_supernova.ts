import Ability from "../../Base/Ability"

export default class phoenix_supernova extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Phoenix_Supernova>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("phoenix_supernova", phoenix_supernova)
