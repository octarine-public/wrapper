import Ability from "../Base/Ability"

export default class luna_lunar_grace extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Luna_Lunar_Grace
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("luna_lunar_grace", luna_lunar_grace)
