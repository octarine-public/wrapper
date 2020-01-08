import Ability from "../Base/Ability"

export default class venomancer_poison_sting extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Venomancer_PoisonSting
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("venomancer_poison_sting", venomancer_poison_sting)
