import Ability from "../Base/Ability"

export default class dazzle_weave extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Dazzle_Weave
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dazzle_weave", dazzle_weave)
