import Item from "../Base/Item"

export default class item_bottle extends Item {
	public readonly m_pBaseEntity!: C_DOTA_Item_EmptyBottle

	public get StoredRune(): DOTA_RUNES {
		return this.m_pBaseEntity.m_iStoredRuneType
	}
	public get StoredRuneTime(): number {
		return this.m_pBaseEntity.m_fStoredRuneTime
	}
	public get Duration(): number {
		return this.GetSpecialValue("restore_time")
	}
	public get TotalHealthRestore(): number {
		return this.GetSpecialValue("health_restore") * this.Duration
	}
	public get TotalManaRestore(): number {
		return this.GetSpecialValue("mana_restore") * this.Duration
	}

	public CanBeCasted(bonusMana: number = 0): boolean {
		return this.CurrentCharges !== 0 && super.CanBeCasted(bonusMana)
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_bottle", item_bottle)
