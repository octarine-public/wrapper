import Ability from "../Base/Ability"

export default class templar_assassin_psi_blades extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_TemplarAssassin_PsiBlades
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("templar_assassin_psi_blades", templar_assassin_psi_blades)
