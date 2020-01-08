import Ability from "../Base/Ability"

export default class necrolyte_sadist extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Necrolyte_Sadist
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("necrolyte_sadist", necrolyte_sadist)
