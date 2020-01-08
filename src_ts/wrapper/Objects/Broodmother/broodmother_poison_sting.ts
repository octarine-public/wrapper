import Ability from "../Base/Ability"

export default class broodmother_poison_sting extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Broodmother_PoisonSting
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("broodmother_poison_sting", broodmother_poison_sting)
