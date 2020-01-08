import Ability from "../Base/Ability"

export default class rattletrap_battery_assault extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Rattletrap_BatteryAssault

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("rattletrap_battery_assault", rattletrap_battery_assault)
