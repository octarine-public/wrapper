import Ability from "../Base/Ability"

export default class abyssal_underlord_pit_of_malice extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_AbyssalUnderlord_PitOfMalice
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("abyssal_underlord_pit_of_malice", abyssal_underlord_pit_of_malice)
