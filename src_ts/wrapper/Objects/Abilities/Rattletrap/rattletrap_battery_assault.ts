import Ability from "../../Base/Ability"

export default class rattletrap_battery_assault extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Rattletrap_BatteryAssault>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("rattletrap_battery_assault", rattletrap_battery_assault)
