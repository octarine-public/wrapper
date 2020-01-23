import Ability from "../../Base/Ability"

export default class nevermore_shadowraze2 extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Nevermore_Shadowraze2>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("nevermore_shadowraze2", nevermore_shadowraze2)
