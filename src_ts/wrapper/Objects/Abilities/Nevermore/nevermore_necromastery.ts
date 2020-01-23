import Ability from "../../Base/Ability"

export default class nevermore_necromastery extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Nevermore_Necromastery>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("nevermore_necromastery", nevermore_necromastery)
