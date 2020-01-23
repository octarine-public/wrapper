import Ability from "../../Base/Ability"

export default class templar_assassin_psi_blades extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_TemplarAssassin_PsiBlades>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("templar_assassin_psi_blades", templar_assassin_psi_blades)
