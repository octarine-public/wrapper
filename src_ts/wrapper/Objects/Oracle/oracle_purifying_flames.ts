import Ability from "../Base/Ability"

export default class oracle_purifying_flames extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Oracle_PurifyingFlames
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("oracle_purifying_flames", oracle_purifying_flames)
