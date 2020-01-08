import Ability from "../Base/Ability"

export default class broodmother_incapacitating_bite extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Broodmother_IncapacitatingBite
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("broodmother_incapacitating_bite", broodmother_incapacitating_bite)
