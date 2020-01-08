import Ability from "../Base/Ability"

export default class spectre_haunt extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Spectre_Haunt
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("spectre_haunt", spectre_haunt)
