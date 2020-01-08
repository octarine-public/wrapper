import Ability from "../Base/Ability"

export default class invoker_empty1 extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Invoker_Empty1
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("invoker_empty1", invoker_empty1)
