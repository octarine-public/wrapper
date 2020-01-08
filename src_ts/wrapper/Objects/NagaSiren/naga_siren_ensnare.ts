import Ability from "../Base/Ability"

export default class naga_siren_ensnare extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_NagaSiren_Ensnare
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("naga_siren_ensnare", naga_siren_ensnare)
