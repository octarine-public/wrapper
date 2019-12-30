import Ability from "../../Base/Ability"

export default class jakiro_macropyre extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Jakiro_Macropyre

	public get BaseCastRange(): number {
		return this.Owner?.HasScepter ? this.GetSpecialValue("cast_range_scepter") : super.CastRange
	}

}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("jakiro_macropyre", jakiro_macropyre)
