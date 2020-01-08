import Ability from "../Base/Ability"

export default class throw_coal extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Throw_Coal
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("throw_coal", throw_coal)
