import Ability from "../../Base/Ability"

export default class tusk_launch_snowball extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Tusk_Launch_Snowball>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tusk_launch_snowball", tusk_launch_snowball)
