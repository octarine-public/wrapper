import Ability from "../Base/Ability"

export default class luna_lucent_beam extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Luna_LucentBeam
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("luna_lucent_beam", luna_lucent_beam)
