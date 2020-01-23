import Ability from "../../Base/Ability"

export default class ursa_fury_swipes extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Ursa_Fury_Swipes>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("ursa_fury_swipes", ursa_fury_swipes)
