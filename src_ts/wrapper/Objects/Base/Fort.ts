import Building from "./Building"

export default class Fort extends Building {
	public NativeEntity: Nullable<C_DOTA_BaseNPC_Fort>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_BaseNPC_Fort", Fort)
