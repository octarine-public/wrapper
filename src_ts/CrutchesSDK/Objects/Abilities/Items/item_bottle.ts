import Item from "../../Base/Item";

export default class item_bottle extends Item {
	readonly m_pBaseEntity: C_DOTA_Item_EmptyBottle;

	get StoredRune(): DOTA_RUNES {
		return this.m_pBaseEntity.m_iStoredRuneType;
	}
	get StoredRuneTime(): number {
		return this.m_pBaseEntity.m_fStoredRuneTime;
	}
	get Duration(): number {
		return this.GetSpecialValue("restore_time");
	}
	get TotalHealthRestore(): number {
		return this.GetSpecialValue("health_restore") * this.Duration;
	}
	get TotalManaRestore(): number {
		return this.GetSpecialValue("mana_restore") * this.Duration;
	}

	CanBeCasted(bonusMana: number = 0): boolean {
		return this.CurrentCharges > 0 && this.StoredRune === DOTA_RUNES.DOTA_RUNE_INVALID && super.CanBeCasted(bonusMana);
	}
}