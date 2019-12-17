import { Team } from "../../Enums/Team"

/* import EntityManager from "../../Managers/EntityManager";
import AbilityData from "../DataBook/AbilityData";
import Ability from "../Base/Ability"; */

export default class StockInfo {
	// public readonly m_AbilityData: AbilityData
	public readonly AbilityID = this.m_StockInfo.nItemAbilityID
	public readonly InitStockDuration = this.m_StockInfo.fInitialStockDuration
	public readonly MaxCount = this.m_StockInfo.iMaxCount
	public readonly Team: Team = this.m_StockInfo.iTeamNumber

	constructor(public readonly m_StockInfo: CDOTA_ItemStockInfo) { }

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
