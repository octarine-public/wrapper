import Ability from "../Base/Ability"

export default class faceless_void_time_dilation extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_FacelessVoid_TimeDilation

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("faceless_void_time_dilation", faceless_void_time_dilation)
