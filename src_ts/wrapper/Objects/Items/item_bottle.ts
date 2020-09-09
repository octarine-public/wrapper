import Item from "../Base/Item"
import { GameRules } from "../Base/Entity"
import { WrapperClass } from "../../Decorators"

@WrapperClass("item_bottle")
export default class item_bottle extends Item {
	public StoredRune = DOTA_RUNES.DOTA_RUNE_INVALID
	public LastRuneTypeChangeTime = GameRules?.RawGameTime ?? 0

	public get StoredRuneTime(): number {
		let time = GameRules?.RawGameTime
		if (time === undefined)
			return 0
		return time - this.LastRuneTypeChangeTime
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
	bottle.LastRuneTypeChangeTime = GameRules?.RawGameTime ?? 0
})
