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
	public get TexturePath(): string {
		switch (this.StoredRune) {
			case DOTA_RUNES.DOTA_RUNE_DOUBLEDAMAGE:
				return "panorama/images/items/bottle_doubledamage_png.vtex_c"
			case DOTA_RUNES.DOTA_RUNE_HASTE:
				return "panorama/images/items/bottle_haste_png.vtex_c"
			case DOTA_RUNES.DOTA_RUNE_ILLUSION:
				return "panorama/images/items/bottle_illusion_png.vtex_c"
			case DOTA_RUNES.DOTA_RUNE_INVISIBILITY:
				return "panorama/images/items/bottle_invisibility_png.vtex_c"
			case DOTA_RUNES.DOTA_RUNE_REGENERATION:
				return "panorama/images/items/bottle_regeneration_png.vtex_c"
			case DOTA_RUNES.DOTA_RUNE_BOUNTY:
				return "panorama/images/items/bottle_bounty_png.vtex_c"
			case DOTA_RUNES.DOTA_RUNE_ARCANE:
				return "panorama/images/items/bottle_arcane_png.vtex_c"
			case DOTA_RUNES.DOTA_RUNE_XP:
				return "panorama/images/items/bottle4_png.vtex_c"
			default:
				switch (this.CurrentCharges) {
					case 2:
						return "panorama/images/items/bottle_medium_png.vtex_c"
					case 1:
						return "panorama/images/items/bottle_small_png.vtex_c"
					case 0:
						return "panorama/images/items/bottle_empty_png.vtex_c"
					default:
						return this.AbilityData.TexturePath
				}
		}
	}

	public CanBeCasted(bonusMana: number = 0): boolean {
		return this.CurrentCharges !== 0 && super.CanBeCasted(bonusMana)
	}
}

import { RegisterFieldHandler } from "../../Objects/NativeToSDK"
RegisterFieldHandler(item_bottle, "m_iStoredRuneType", (bottle, new_val) => {
	bottle.StoredRune = new_val as DOTA_RUNES
	bottle.LastRuneTypeChangeTime = GameState.RawGameTime
})
