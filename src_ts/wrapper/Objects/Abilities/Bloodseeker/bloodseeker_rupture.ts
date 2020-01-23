import Ability from "../../Base/Ability"

export default class bloodseeker_rupture extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Bloodseeker_Rupture>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("bloodseeker_rupture", bloodseeker_rupture)
