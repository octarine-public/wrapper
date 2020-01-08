import Ability from "../Base/Ability"

export default class invoker_empty2 extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Invoker_Empty2
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("invoker_empty2", invoker_empty2)
