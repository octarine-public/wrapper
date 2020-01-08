import Ability from "../Base/Ability"

export default class nevermore_requiem extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Nevermore_Requiem
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("nevermore_requiem", nevermore_requiem)
