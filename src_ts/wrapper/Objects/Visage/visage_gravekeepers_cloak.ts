import Ability from "../Base/Ability"

export default class visage_gravekeepers_cloak extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Visage_GravekeepersCloak
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("visage_gravekeepers_cloak", visage_gravekeepers_cloak)
