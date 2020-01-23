import Ability from "../../Base/Ability"

export default class bane_nightmare extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Bane_Nightmare>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("bane_nightmare", bane_nightmare)
