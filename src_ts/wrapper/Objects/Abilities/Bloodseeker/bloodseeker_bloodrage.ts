import Ability from "../../Base/Ability"

export default class bloodseeker_bloodrage extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Bloodseeker_Bloodrage>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("bloodseeker_bloodrage", bloodseeker_bloodrage)
