import Ability from "../Base/Ability"

export default class ursa_enrage extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Ursa_Enrage
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("ursa_enrage", ursa_enrage)
