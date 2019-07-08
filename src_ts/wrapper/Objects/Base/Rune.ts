import Entity from "./Entity"

export default class Rune extends Entity {
	readonly m_pBaseEntity: C_DOTA_Item_Rune

	get Type(): DOTA_RUNES {
		return this.m_pBaseEntity.m_iRuneType
	}
	get OldType(): DOTA_RUNES {
		return this.m_pBaseEntity.m_iOldRuneType
	}
	get ShowingTooltip(): boolean {
		return this.m_pBaseEntity.m_bShowingTooltip
	}

	HasType(type: DOTA_RUNES): boolean {
		return this.Type === type
	}
}
