import Ability from "../Base/Ability"

export default class broodmother_spawn_spiderite extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Broodmother_SpawnSpiderite
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("broodmother_spawn_spiderite", broodmother_spawn_spiderite)
