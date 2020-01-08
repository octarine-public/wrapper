import Ability from "../Base/Ability"

export default class throw_snowball extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Throw_Snowball
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("throw_snowball", throw_snowball)
