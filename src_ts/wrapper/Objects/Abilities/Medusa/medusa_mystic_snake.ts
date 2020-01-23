import Ability from "../../Base/Ability"

export default class medusa_mystic_snake extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Medusa_MysticSnake>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("medusa_mystic_snake", medusa_mystic_snake)
