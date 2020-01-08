import Ability from "../Base/Ability"

export default class nevermore_dark_lord extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Nevermore_Presence
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("nevermore_dark_lord", nevermore_dark_lord)
