import Ability from "../../Base/Ability"

export default class keeper_of_the_light_blinding_light extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_KeeperOfTheLight_BlindingLight>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("keeper_of_the_light_blinding_light", keeper_of_the_light_blinding_light)
