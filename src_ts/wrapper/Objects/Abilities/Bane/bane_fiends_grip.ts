import Ability from "../../Base/Ability"

export default class bane_fiends_grip extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Bane_FiendsGrip>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("bane_fiends_grip", bane_fiends_grip)
