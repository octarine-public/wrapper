import Ability from "../../Base/Ability"

export default class keeper_of_the_light_will_o_wisp extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_KeeperOfTheLight_Will_O_Wisp>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("keeper_of_the_light_will_o_wisp", keeper_of_the_light_will_o_wisp)
