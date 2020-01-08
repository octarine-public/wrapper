import Ability from "../Base/Ability"

export default class tinker_heat_seeking_missile extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Tinker_HeatSeekingMissile

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}

	public get Speed(): number {
		return this.GetSpecialValue("speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tinker_heat_seeking_missile", tinker_heat_seeking_missile)
