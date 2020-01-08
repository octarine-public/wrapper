import Ability from "../Base/Ability"

export default class ursa_overpower extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Ursa_Overpower
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("ursa_overpower", ursa_overpower)
