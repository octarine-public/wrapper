import Ability from "../../Base/Ability"

export default class morphling_hybrid extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Morphling_Hybrid>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("morphling_hybrid", morphling_hybrid)
