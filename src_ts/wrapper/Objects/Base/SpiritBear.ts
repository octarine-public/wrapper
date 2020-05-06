import Unit from "./Unit"

export default class SpiritBear extends Unit {
	public NativeEntity: Nullable<C_DOTA_Unit_SpiritBear>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_SpiritBear", SpiritBear)
