import Ability from "../Base/Ability"

export default class frostivus2018_throw_snowball extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Frostivus2018_Throw_Snowball
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("frostivus2018_throw_snowball", frostivus2018_throw_snowball)
