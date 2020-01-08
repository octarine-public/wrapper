import Ability from "../Base/Ability"

export default class drow_ranger_multishot extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_DrowRanger_Multishot

	public get CastRange(): number {
		return (this.Owner?.AttackRange ?? 0) * this.GetSpecialValue("arrow_range_multiplier")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("drow_ranger_multishot", drow_ranger_multishot)
