import Ability from "../Base/Ability"

export default class razor_unstable_current extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Razor_UnstableCurrent
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("razor_unstable_current", razor_unstable_current)
