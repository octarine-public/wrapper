import Ability from "../../Base/Ability"

export default class bane_enfeeble extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Bane_Enfeeble>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("bane_enfeeble", bane_enfeeble)
