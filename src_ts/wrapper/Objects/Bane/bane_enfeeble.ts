import Ability from "../Base/Ability"

export default class bane_enfeeble extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Bane_Enfeeble
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("bane_enfeeble", bane_enfeeble)
