import Ability from "../Base/Ability"

export default class tiny_craggy_exterior extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Tiny_CraggyExterior
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tiny_craggy_exterior", tiny_craggy_exterior)
