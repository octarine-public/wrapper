import Ability from "../Base/Ability"

export default class slardar_slithereen_crush extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Slardar_Slithereen_Crush

	public get AOERadius(): number {
		return this.GetSpecialValue("crush_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("slardar_slithereen_crush", slardar_slithereen_crush)
