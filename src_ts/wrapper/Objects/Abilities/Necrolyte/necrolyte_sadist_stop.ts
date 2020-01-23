import Ability from "../../Base/Ability"

export default class necrolyte_sadist_stop extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Necrolyte_Sadist_Stop>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("necrolyte_sadist_stop", necrolyte_sadist_stop)
