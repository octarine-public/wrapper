import Ability from "../Base/Ability"

export default class axe_battle_hunger extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Axe_BattleHunger

	public get AOERadius(): number {
		return this.Owner?.HasScepter
			? this.GetSpecialValue("scepter_range")
			: 0
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("axe_battle_hunger", axe_battle_hunger)
