import Ability from "../../Base/Ability"

export default class axe_counter_helix extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Axe_CounterHelix>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("axe_counter_helix", axe_counter_helix)
