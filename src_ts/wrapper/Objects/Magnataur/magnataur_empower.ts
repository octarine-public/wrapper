import Ability from "../Base/Ability"

export default class magnataur_empower extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Magnataur_Empower
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("magnataur_empower", magnataur_empower)
