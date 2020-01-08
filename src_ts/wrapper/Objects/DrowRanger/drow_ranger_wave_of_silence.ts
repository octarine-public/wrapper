import Ability from "../Base/Ability"

export default class drow_ranger_wave_of_silence extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_DrowRanger_WaveOfSilence

	public get AOERadius(): number {
		return this.GetSpecialValue("wave_width")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("drow_ranger_wave_of_silence", drow_ranger_wave_of_silence)
