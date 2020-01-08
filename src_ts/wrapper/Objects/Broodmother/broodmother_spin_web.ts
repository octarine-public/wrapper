import Ability from "../Base/Ability"

export default class broodmother_spin_web extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Broodmother_SpinWeb
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("broodmother_spin_web", broodmother_spin_web)
