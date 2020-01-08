import Ability from "../Base/Ability"

export default class pudge_dismember extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Pudge_Dismember
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("pudge_dismember", pudge_dismember)
