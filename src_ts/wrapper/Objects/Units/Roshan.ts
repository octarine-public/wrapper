import Unit from "../Base/Unit"

export default class Roshan extends Unit {
	readonly m_pBaseEntity: C_DOTA_Unit_Roshan

	get GoldenRoshan(): boolean {
		return this.m_pBaseEntity.m_bGoldenRoshan
	}
	get LastHealthPercent(): number {
		return this.m_pBaseEntity.m_iLastHealthPercent
	}
}