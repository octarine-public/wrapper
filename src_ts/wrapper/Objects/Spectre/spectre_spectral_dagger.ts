import Ability from "../Base/Ability"

export default class spectre_spectral_dagger extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Spectre_SpectralDagger
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("spectre_spectral_dagger", spectre_spectral_dagger)
