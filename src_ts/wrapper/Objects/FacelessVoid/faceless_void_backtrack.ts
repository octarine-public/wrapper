import Ability from "../Base/Ability"

export default class faceless_void_backtrack extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_FacelessVoid_Backtrack
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("faceless_void_backtrack", faceless_void_backtrack)
