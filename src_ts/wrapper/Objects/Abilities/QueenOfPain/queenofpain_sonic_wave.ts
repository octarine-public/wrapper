import Ability from "../../Base/Ability"

export default class queenofpain_sonic_wave extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_QueenOfPain_SonicWave>

	public get EndRadius(): number {
		return this.GetSpecialValue("final_aoe")
	}

	public get AOERadius(): number {
		return this.GetSpecialValue("starting_aoe")
	}

	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("queenofpain_sonic_wave", queenofpain_sonic_wave)
