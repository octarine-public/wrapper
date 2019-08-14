/* import EntityManager from "../../Managers/EntityManager";
import AbilityData from "../DataBook/AbilityData";
import Ability from "../Base/Ability"; */

export default class StockInfo {
	// private m_AbilityData: AbilityData
	private m_AbilityID: number
	private m_InitStockDuration: number
	private m_MaxCount: number
	private m_Team: DOTATeam_t

	constructor(public readonly m_StockInfo: CDOTA_ItemStockInfo) {
		this.m_AbilityID = m_StockInfo.nItemAbilityID
		this.m_InitStockDuration = m_StockInfo.fInitialStockDuration
		this.m_MaxCount = m_StockInfo.iMaxCount
		this.m_Team = m_StockInfo.iTeamNumber
	}

	/* get AbilityData(): AbilityData {
		let data = this.m_AbilityData;

		if (data === undefined) {
			let ability = EntityManager.EntityByIndex(this.m_AbilityID) as Ability;
			if (ability !== undefined)
				this.m_AbilityData = ability.AbilityData;
		}

		return this.m_AbilityData;
	} */
	get AbilityID(): number {
		return this.m_AbilityID
	}
	get InitStockDuration(): number {
		return this.m_InitStockDuration
	}
	get IsAvalible(): boolean {
		return this.Count > 0
	}
	get MaxCount(): number {
		return this.m_MaxCount
	}
	get Count(): number {
		return this.m_StockInfo.iStockCount
	}
	get Duraction(): boolean {
		return this.m_StockInfo.fStockDuration > 0
	}
	get Time(): boolean {
		return this.m_StockInfo.fStockTime > 0
	}
	get Team(): DOTATeam_t {
		return this.m_Team
	}
	get PlayerNumber(): number {
		return this.m_StockInfo.iPlayerNumber
	}
	get BonusDelayed(): number {
		return this.m_StockInfo.iBonusDelayedStockCount
	}
}
