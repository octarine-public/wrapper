import Ability from "../../Base/Ability"

export default class tusk_snowball extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Tusk_Snowball>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tusk_snowball", tusk_snowball)
