import Ability from "../../Base/Ability"

export default class slardar_sprint extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Slardar_Sprint>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("slardar_sprint", slardar_sprint)
