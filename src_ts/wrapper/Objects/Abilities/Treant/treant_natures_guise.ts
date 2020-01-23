import Ability from "../../Base/Ability"

export default class treant_natures_guise extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Treant_NaturesGuise>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("treant_natures_guise", treant_natures_guise)
