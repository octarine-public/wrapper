import Ability from "../Base/Ability"

export default class skywrath_mage_arcane_bolt extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Skywrath_Mage_Arcane_Bolt

	public get Speed(): number {
		return this.GetSpecialValue("bolt_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("skywrath_mage_arcane_bolt", skywrath_mage_arcane_bolt)
