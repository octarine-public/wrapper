import Ability from "../Base/Ability"

export default class sven_gods_strength extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Sven_GodsStrength
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("sven_gods_strength", sven_gods_strength)