import Ability from "../Base/Ability"

export default class skywrath_mage_ancient_seal extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Skywrath_Mage_Ancient_Seal
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("skywrath_mage_ancient_seal", skywrath_mage_ancient_seal)
