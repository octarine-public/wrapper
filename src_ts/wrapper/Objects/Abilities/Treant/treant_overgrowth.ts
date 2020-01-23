import Ability from "../../Base/Ability"

export default class treant_overgrowth extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Treant_Overgrowth>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("treant_overgrowth", treant_overgrowth)
