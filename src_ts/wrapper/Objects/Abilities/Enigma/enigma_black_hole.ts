import Ability from "../../Base/Ability"

export default class enigma_black_hole extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Enigma_BlackHole

	public get AOERadius(): number {
		return this.GetSpecialValue("pull_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("enigma_black_hole", enigma_black_hole)
