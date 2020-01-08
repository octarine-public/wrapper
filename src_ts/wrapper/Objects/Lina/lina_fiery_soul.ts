import Ability from "../Base/Ability"

export default class lina_fiery_soul extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Lina_FierySoul
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lina_fiery_soul", lina_fiery_soul)
