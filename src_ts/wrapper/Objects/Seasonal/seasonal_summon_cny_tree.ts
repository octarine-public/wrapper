import Ability from "../Base/Ability"

export default class seasonal_summon_cny_tree extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Seasonal_Summon_CNY_Tree
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("seasonal_summon_cny_tree", seasonal_summon_cny_tree)
