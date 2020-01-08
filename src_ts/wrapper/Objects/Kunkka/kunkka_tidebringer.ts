import Ability from "../Base/Ability"

export default class kunkka_tidebringer extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Kunkka_Tidebringer

	public get AOERadius(): number {
		return this.GetSpecialValue("cleave_distance")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("kunkka_tidebringer", kunkka_tidebringer)
