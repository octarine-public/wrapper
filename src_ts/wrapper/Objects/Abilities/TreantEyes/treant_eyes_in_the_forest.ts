import Ability from "../../Base/Ability"

export default class treant_eyes_in_the_forest extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Treant_EyesInTheForest>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("treant_eyes_in_the_forest", treant_eyes_in_the_forest)
