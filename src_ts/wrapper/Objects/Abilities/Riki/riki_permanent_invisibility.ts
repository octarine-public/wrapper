import Ability from "../../Base/Ability"

export default class riki_permanent_invisibility extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Riki_Permanent_Invisibility>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("riki_permanent_invisibility", riki_permanent_invisibility)
