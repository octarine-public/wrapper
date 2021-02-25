import { WrapperClass } from "../../Decorators"
import { DOTA_RUNES } from "../../Enums/DOTA_RUNES"
import GameState from "../../Utils/GameState"
import Item from "../Base/Item"

@WrapperClass("item_bottle")
export default class item_bottle extends Item {
	public StoredRune = DOTA_RUNES.DOTA_RUNE_INVALID
	public LastRuneTypeChangeTime = GameState.RawGameTime

	public get StoredRuneTime(): number {
		return GameState.RawGameTime - this.LastRuneTypeChangeTime
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

import { RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterFieldHandler(item_bottle, "m_iStoredRuneType", (bottle, new_val) => {
	bottle.StoredRune = new_val as DOTA_RUNES
	bottle.LastRuneTypeChangeTime = GameState.RawGameTime
})
