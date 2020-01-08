import Ability from "../Base/Ability"

export default class slardar_amplify_damage extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Slardar_Amplify_Damage
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("slardar_amplify_damage", slardar_amplify_damage)
