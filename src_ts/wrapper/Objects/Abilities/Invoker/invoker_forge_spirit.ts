import Ability from "../../Base/Ability"

export default class invoker_forge_spirit extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Invoker_ForgeSpirit>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("invoker_forge_spirit", invoker_forge_spirit)
