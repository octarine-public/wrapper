import Ability from "../../Base/Ability"

export default class earthshaker_fissure extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Earthshaker_Fissure

	public get AOERadius(): number {
		return this.GetSpecialValue("fissure_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("earthshaker_fissure", earthshaker_fissure)
