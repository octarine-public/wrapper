import Ability from "../Base/Ability"

export default class ursa_fury_swipes extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Ursa_Fury_Swipes
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("ursa_fury_swipes", ursa_fury_swipes)
