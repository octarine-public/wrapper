import Ability from "../../Base/Ability"

export default class keeper_of_the_light_spirit_form_illuminate_end extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_KeeperOfTheLight_SpiritFormIlluminateEnd>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("keeper_of_the_light_spirit_form_illuminate_end", keeper_of_the_light_spirit_form_illuminate_end)
