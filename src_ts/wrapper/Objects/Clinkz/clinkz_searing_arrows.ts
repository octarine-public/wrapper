import Ability from "../Base/Ability"

export default class clinkz_searing_arrows extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Clinkz_SearingArrows
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("clinkz_searing_arrows", clinkz_searing_arrows)
