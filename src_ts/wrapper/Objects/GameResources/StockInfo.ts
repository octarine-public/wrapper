import { Team } from "../../Enums/Team"

/* import EntityManager from "../../Managers/EntityManager";
import AbilityData from "../DataBook/AbilityData";
import Ability from "../Base/Ability"; */

export default class StockInfo {
	// public readonly m_AbilityData: AbilityData
	public readonly AbilityID: number
	public readonly InitStockDuration: number
	public readonly MaxCount: number
	public readonly Team: Team

	constructor(public readonly m_StockInfo: CDOTA_ItemStockInfo) {
		this.AbilityID = m_StockInfo.nItemAbilityID
		this.InitStockDuration = m_StockInfo.fInitialStockDuration
		this.MaxCount = m_StockInfo.iMaxCount
		this.Team = m_StockInfo.iTeamNumber
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
	get IsAvalible(): boolean {
		return this.Count > 0
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
	get PlayerNumber(): number {
		return this.m_StockInfo.iPlayerNumber
	}
	get BonusDelayed(): number {
		return this.m_StockInfo.iBonusDelayedStockCount
	}
}
