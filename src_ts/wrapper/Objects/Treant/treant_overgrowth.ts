import Ability from "../Base/Ability"

export default class treant_overgrowth extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Treant_Overgrowth
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("treant_overgrowth", treant_overgrowth)
