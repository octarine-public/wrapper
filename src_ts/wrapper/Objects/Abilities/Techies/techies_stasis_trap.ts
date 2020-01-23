import Ability from "../../Base/Ability"

export default class techies_stasis_trap extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Techies_StasisTrap>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("techies_stasis_trap", techies_stasis_trap)
