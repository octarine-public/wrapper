import Ability from "../Base/Ability"

export default class templar_assassin_meld extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_TemplarAssassin_Meld
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("templar_assassin_meld", templar_assassin_meld)
