import Ability from "../Base/Ability"

export default class phantom_assassin_blur extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_PhantomAssassin_Blur

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("phantom_assassin_blur", phantom_assassin_blur)
