import Ability from "../Base/Ability"

export default class invoker_alacrity extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Invoker_Alacrity
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("invoker_alacrity", invoker_alacrity)
