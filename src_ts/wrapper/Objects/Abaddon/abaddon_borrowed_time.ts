import Ability from "../Base/Ability"

export default class abaddon_borrowed_time extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Abaddon_BorrowedTime
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("abaddon_borrowed_time", abaddon_borrowed_time)
