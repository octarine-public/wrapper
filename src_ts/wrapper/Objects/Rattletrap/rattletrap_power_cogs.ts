import Ability from "../Base/Ability"

export default class rattletrap_power_cogs extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Rattletrap_PowerCogs

	public get AOERadius(): number {
		return this.GetSpecialValue("cogs_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("rattletrap_power_cogs", rattletrap_power_cogs)
