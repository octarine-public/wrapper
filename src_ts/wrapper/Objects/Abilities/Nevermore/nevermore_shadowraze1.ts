import Ability from "../../Base/Ability"

export default class nevermore_shadowraze1 extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Nevermore_Shadowraze1>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("nevermore_shadowraze1", nevermore_shadowraze1)
