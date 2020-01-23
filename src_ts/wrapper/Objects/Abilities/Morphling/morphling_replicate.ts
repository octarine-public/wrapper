import Ability from "../../Base/Ability"

export default class morphling_replicate extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Morphling_Replicate>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("morphling_replicate", morphling_replicate)
