import Ability from "../Base/Ability"

export default class dark_willow_terrorize extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_DarkWillow_Terrorize

	public get AOERadius(): number {
		return this.GetSpecialValue("destination_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dark_willow_terrorize", dark_willow_terrorize)
