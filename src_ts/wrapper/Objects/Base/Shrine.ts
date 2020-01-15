import Building from "./Building"

export default class Shrine extends Building {
	public readonly m_pBaseEntity!: C_DOTA_BaseNPC_Healer

	get IsShrine(): boolean {
		return true
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_BaseNPC_Healer", Shrine)
