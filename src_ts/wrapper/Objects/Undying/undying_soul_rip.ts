import Ability from "../Base/Ability"

export default class undying_soul_rip extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Undying_SoulRip

	public get Speed(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("undying_soul_rip", undying_soul_rip)
