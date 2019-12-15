import WardObserver from "./WardObserver"
import EntityManager from "../../Managers/EntityManager"
import { EntityNullable } from "./Entity"

export default class WardTrueSight extends WardObserver {
	public readonly m_pBaseEntity!: CDOTA_NPC_Observer_Ward_TrueSight

	private Caster_: EntityNullable
	private Ability_: EntityNullable

	public get TrueSight(): number {
		return this.m_pBaseEntity.m_iTrueSight
	}
	public get Caster(): EntityNullable {
		if (this.Caster_ === undefined)
			this.Caster_ = EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hCasterEntity)
		return this.Caster_
	}
	public get Ability(): EntityNullable {
		if (this.Ability_ === undefined)
			this.Ability_ = EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hAbilityEntity)
		return this.Ability_
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_NPC_Observer_Ward_TrueSight", WardTrueSight)
