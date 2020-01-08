import Ability from "../Base/Ability"

export default class treant_leech_seed extends Ability {
	public readonly m_pBaseEntity!: C_CDOTA_Ability_Treant_LeechSeed
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("treant_leech_seed", treant_leech_seed)
