import Ability from "../../Base/Ability"

export default class treant_natures_grasp extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Treant_NaturesGrasp>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("treant_natures_grasp", treant_natures_grasp)
