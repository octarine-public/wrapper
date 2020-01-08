import Ability from "../Base/Ability"

export default class abyssal_underlord_dark_rift extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_AbyssalUnderlord_DarkRift
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("abyssal_underlord_dark_rift", abyssal_underlord_dark_rift)
