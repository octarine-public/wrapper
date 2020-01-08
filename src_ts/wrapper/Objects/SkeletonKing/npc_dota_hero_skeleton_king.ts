import Hero from "../Base/Hero"

export default class npc_dota_hero_skeleton_king extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_SkeletonKing
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_SkeletonKing", npc_dota_hero_skeleton_king)
