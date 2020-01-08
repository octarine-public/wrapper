import Ability from "../Base/Ability"

export default class courier_shield extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Courier_Shield
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("courier_shield", courier_shield)
