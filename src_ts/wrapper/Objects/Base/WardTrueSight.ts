import WardObserver from "./WardObserver"
import EntityManager from "../../Managers/EntityManager"
import Entity from "./Entity"

export default class WardTrueSight extends WardObserver {
	public readonly m_pBaseEntity: CDOTA_NPC_Observer_Ward_TrueSight
	private Caster_: Entity
	private Ability_: Entity

	public get TrueSight(): number {
		return this.m_pBaseEntity.m_iTrueSight
	}
	public get Caster(): Entity {
		if (this.Caster_ === undefined)
			this.Caster_ = EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hCasterEntity)
		return this.Caster_
	}
	public get Ability(): Entity {
		if (this.Ability_ === undefined)
			this.Ability_ = EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hAbilityEntity)
		return this.Ability_
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_NPC_Observer_Ward_TrueSight", WardTrueSight)
