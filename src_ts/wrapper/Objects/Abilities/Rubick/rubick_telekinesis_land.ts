import Ability from "../../Base/Ability"

export default class rubick_telekinesis_land extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Rubick_TelekinesisLand>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("rubick_telekinesis_land", rubick_telekinesis_land)
