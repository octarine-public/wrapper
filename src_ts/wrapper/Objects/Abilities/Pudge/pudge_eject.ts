import Ability from "../../Base/Ability"

export default class pudge_eject extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Pudge_Eject>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("pudge_eject", pudge_eject)
