import Ability from "../../Base/Ability"

export default class omniknight_purification extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Omniknight_Purification>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("omniknight_purification", omniknight_purification)
