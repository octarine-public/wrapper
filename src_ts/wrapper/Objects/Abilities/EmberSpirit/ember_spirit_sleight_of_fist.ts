import Ability from "../../Base/Ability"

export default class ember_spirit_sleight_of_fist extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_EmberSpirit_SleightOfFist>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("ember_spirit_sleight_of_fist", ember_spirit_sleight_of_fist)
