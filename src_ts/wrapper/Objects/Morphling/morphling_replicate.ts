import Ability from "../Base/Ability"

export default class morphling_replicate extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Morphling_Replicate
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("morphling_replicate", morphling_replicate)
