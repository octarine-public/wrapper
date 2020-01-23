import Ability from "../../Base/Ability"

export default class omniknight_pacify extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Omniknight_Pacify>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("omniknight_pacify", omniknight_pacify)
