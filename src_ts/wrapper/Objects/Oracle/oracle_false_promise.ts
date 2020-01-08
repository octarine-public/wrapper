import Ability from "../Base/Ability"

export default class oracle_false_promise extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Oracle_FalsePromise
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("oracle_false_promise", oracle_false_promise)
