/* import EntityManager from "../../Managers/EntityManager";
import AbilityData from "../DataBook/AbilityData";
import Ability from "../Base/Ability"; */

export default class StockInfo {
	
	readonly m_StockInfo: CDOTA_ItemStockInfo
	
	//private m_AbilityData: AbilityData
	private m_AbilityID: number
	private m_InitStockDuration: number
	private m_MaxCount: number
	private m_Team: DOTATeam_t
	
	constructor(info: CDOTA_ItemStockInfo) {
		this.m_StockInfo = info;
		
		this.m_AbilityID = info.nItemAbilityID;
		this.m_InitStockDuration = info.fInitialStockDuration;
		this.m_MaxCount = info.iMaxCount;
		this.m_Team = info.iTeamNumber;
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
		return this.m_AbilityID;
	}
	get InitStockDuration(): number {
		return this.m_InitStockDuration;
	}
	get IsAvalible(): boolean {
		return this.Count > 0;
	}
	get MaxCount(): number {
		return this.m_MaxCount;
	}
	get Count(): number {
		return this.m_StockInfo.iStockCount;
	}
	get Duraction(): boolean {
		return this.m_StockInfo.fStockDuration > 0;
	}
	get Time(): boolean {
		return this.m_StockInfo.fStockTime > 0;
	}
	get Team(): DOTATeam_t {
		return this.m_Team;
	}
	get PlayerNumber(): number {
		return this.m_StockInfo.iPlayerNumber;
	}
	get BonusDelayed(): number {
		return this.m_StockInfo.iBonusDelayedStockCount;
	}
}