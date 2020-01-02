import Hero from "../Base/Hero"

export default class KeeperOfTheLight extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_KeeperOfTheLight
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_KeeperOfTheLight", KeeperOfTheLight)