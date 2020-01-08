import Ability from "../Base/Ability"

export default class satyr_trickster_purge extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_SatyrTrickster_Purge
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("satyr_trickster_purge", satyr_trickster_purge)
