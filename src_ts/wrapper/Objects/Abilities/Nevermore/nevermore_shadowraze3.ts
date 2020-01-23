import Ability from "../../Base/Ability"

export default class nevermore_shadowraze3 extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Nevermore_Shadowraze3>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("nevermore_shadowraze3", nevermore_shadowraze3)
