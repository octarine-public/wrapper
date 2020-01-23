import Ability from "../../Base/Ability"

export default class huskar_berserkers_blood extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Huskar_Berserkers_Blood>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("huskar_berserkers_blood", huskar_berserkers_blood)
