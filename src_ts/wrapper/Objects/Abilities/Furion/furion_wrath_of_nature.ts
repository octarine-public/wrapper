import Ability from "../../Base/Ability"

export default class furion_wrath_of_nature extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Furion_WrathOfNature>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("furion_wrath_of_nature", furion_wrath_of_nature)
