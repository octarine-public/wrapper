import Ability from "../../Base/Ability"

export default class medusa_split_shot extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Medusa_SplitShot>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("medusa_split_shot", medusa_split_shot)
