import Ability from "../../Base/Ability"

export default class huskar_inner_fire extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Huskar_Inner_Fire>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("huskar_inner_fire", huskar_inner_fire)
