import Ability from "../../Base/Ability"

export default class ember_spirit_flame_guard extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_EmberSpirit_FlameGuard>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("ember_spirit_flame_guard", ember_spirit_flame_guard)
