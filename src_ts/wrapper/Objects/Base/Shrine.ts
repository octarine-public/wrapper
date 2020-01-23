import Building from "./Building"

export default class Shrine extends Building {
	public NativeEntity: Nullable<C_DOTA_BaseNPC_Healer>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_BaseNPC_Healer", Shrine)
