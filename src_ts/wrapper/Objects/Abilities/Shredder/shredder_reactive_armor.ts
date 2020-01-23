import Ability from "../../Base/Ability"

export default class shredder_reactive_armor extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Shredder_Reactive_Armor>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("shredder_reactive_armor", shredder_reactive_armor)
