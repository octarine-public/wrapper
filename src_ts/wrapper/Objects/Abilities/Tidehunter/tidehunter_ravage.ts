import Ability from "../../Base/Ability"

export default class tidehunter_ravage extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Tidehunter_Ravage>

	public get Speed(): number {
		return this.GetSpecialValue("speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tidehunter_ravage", tidehunter_ravage)
