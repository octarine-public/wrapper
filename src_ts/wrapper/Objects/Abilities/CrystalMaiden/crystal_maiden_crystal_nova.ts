import Ability from "../../Base/Ability"

export default class crystal_maiden_crystal_nova extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_CrystalMaiden_CrystalNova

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("crystal_maiden_crystal_nova", crystal_maiden_crystal_nova)
