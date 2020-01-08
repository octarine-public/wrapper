import Ability from "../Base/Ability"

export default class zuus_lightning_bolt extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Zuus_LightningBolt

	public get AOERadius(): number {
		return this.GetSpecialValue("spread_aoe")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("zuus_lightning_bolt", zuus_lightning_bolt)
