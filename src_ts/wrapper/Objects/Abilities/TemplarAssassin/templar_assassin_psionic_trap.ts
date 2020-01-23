import Ability from "../../Base/Ability"

export default class templar_assassin_psionic_trap extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_TemplarAssassin_PsionicTrap>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("templar_assassin_psionic_trap", templar_assassin_psionic_trap)
