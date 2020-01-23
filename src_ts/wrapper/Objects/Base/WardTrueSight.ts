import WardObserver from "./WardObserver"
import EntityManager from "../../Managers/EntityManager"
import Entity from "./Entity"

export default class WardTrueSight extends WardObserver {
	public NativeEntity: Nullable<CDOTA_NPC_Observer_Ward_TrueSight>
	public TrueSight = 0
	public Caster_ = 0
	public Ability_ = 0

	public get Caster(): Nullable<Entity> {
		return EntityManager.EntityByIndex(this.Caster_)
	}
	public get Ability(): Nullable<Entity> {
		return EntityManager.EntityByIndex(this.Ability_)
	}
}

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_NPC_Observer_Ward_TrueSight", WardTrueSight)
RegisterFieldHandler(WardTrueSight, "m_iTrueSight", (ward, new_value) => ward.TrueSight = new_value as number)
RegisterFieldHandler(WardTrueSight, "m_hCasterEntity", (ward, new_value) => ward.Caster_ = new_value as number)
RegisterFieldHandler(WardTrueSight, "m_hAbilityEntity", (ward, new_value) => ward.Ability_ = new_value as number)
