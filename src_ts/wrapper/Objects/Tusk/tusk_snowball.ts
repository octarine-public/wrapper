import Ability from "../Base/Ability"

export default class tusk_snowball extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Tusk_Snowball
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tusk_snowball", tusk_snowball)
