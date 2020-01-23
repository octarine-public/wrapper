import Building from "./Building"

export default class Outpost extends Building {
	public NativeEntity: Nullable<C_DOTA_BaseNPC_Watch_Tower>
	public OutpostName = ""
}

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_BaseNPC_Watch_Tower", Outpost)
RegisterFieldHandler(Outpost, "m_szOutpostName", (outpost, new_val) => outpost.OutpostName = new_val as string)
