import Ability from "../Base/Ability"

export default class spectre_haunt_single extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Spectre_Haunt_Single
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("spectre_haunt_single", spectre_haunt_single)
