import Ability from "../Base/Ability"

export default class huskar_inner_fire extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Huskar_Inner_Fire

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("huskar_inner_fire", huskar_inner_fire)
