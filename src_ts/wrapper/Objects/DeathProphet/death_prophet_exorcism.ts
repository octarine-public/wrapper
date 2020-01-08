import Ability from "../Base/Ability"

export default class death_prophet_exorcism extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_DeathProphet_Exorcism

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}

	public get Speed(): number {
		return this.GetSpecialValue("spirit_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("death_prophet_exorcism", death_prophet_exorcism)
