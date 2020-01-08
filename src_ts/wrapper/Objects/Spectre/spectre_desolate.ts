import Ability from "../Base/Ability"

export default class spectre_desolate extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Spectre_Desolate
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("spectre_desolate", spectre_desolate)
