import Item from "../Base/Item"

export default class item_bottle extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_EmptyBottle>
	public StoredRune = DOTA_RUNES.DOTA_RUNE_INVALID

	public get StoredRuneTime(): number {
		return this.NativeEntity?.m_fStoredRuneTime ?? 0
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

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_bottle", item_bottle)
RegisterFieldHandler(item_bottle, "m_iStoredRuneType", (bottle, new_val) => bottle.StoredRune = new_val as DOTA_RUNES)
