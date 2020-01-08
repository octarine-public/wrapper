import Ability from "../Base/Ability"

export default class death_prophet_silence extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_DeathProphet_Silence

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("death_prophet_silence", death_prophet_silence)
