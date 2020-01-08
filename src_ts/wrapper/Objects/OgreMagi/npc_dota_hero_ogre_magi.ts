import Hero from "../Base/Hero"

export default class npc_dota_hero_ogre_magi extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Ogre_Magi
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Ogre_Magi", npc_dota_hero_ogre_magi)
