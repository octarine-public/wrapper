import Ability from "../Base/Ability"

export default class pugna_life_drain extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Pugna_LifeDrain
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("pugna_life_drain", pugna_life_drain)
