import Ability from "../Base/Ability"

export default class juggernaut_blade_dance extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Juggernaut_BladeDance
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("juggernaut_blade_dance", juggernaut_blade_dance)
