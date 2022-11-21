import { Team } from "../Enums/Team"
import { AbilityData } from "../Objects/DataBook/AbilityData"
import { EntityPropertiesNode } from "./EntityProperties"

export class StockInfo {
	constructor(public readonly properties: EntityPropertiesNode) {}

	public get AbilityID(): number {
		return this.properties.get("nItemAbilityID") as number
	}
	public get InitStockDuration(): number {
		return this.properties.get("fInitialStockDuration") as number
	}
	public get StockDuration(): number {
		return this.properties.get("fStockDuration") as number
	}
	public get StockTime(): number {
		return this.properties.get("fStockTime") as number
	}
	public get MaxCount(): number {
		return this.properties.get("iMaxCount") as number
	}
	public get Team(): Team {
		return this.properties.get("iTeamNumber") as Team
	}
	public get IsAvalible(): boolean {
		return this.StockCount > 0
	}
	public get StockCount(): number {
		return this.properties.get("iStockCount") as number
	}
	public get PlayerNumber(): number {
		return this.properties.get("iPlayerNumber") as number
	}
	public get BonusDelayedStockCount(): number {
		return this.properties.get("iBonusDelayedStockCount") as number
	}
	public GetAbilityData(): AbilityData {
		return (
			AbilityData.GetAbilityByName(this.GetAbilityName()) ?? AbilityData.empty
		)
	}
	public GetAbilityName(): string {
		return AbilityData.GetAbilityNameByID(this.AbilityID) ?? ""
	}
	public toJSON(): any {
		return {
			AbilityID: this.AbilityID,
			InitStockDuration: this.InitStockDuration,
			StockDuration: this.StockDuration,
			StockTime: this.StockTime,
			MaxCount: this.MaxCount,
			Team: this.Team,
			IsAvalible: this.IsAvalible,
			StockCount: this.StockCount,
			PlayerNumber: this.PlayerNumber,
			BonusDelayedStockCount: this.BonusDelayedStockCount,
		}
	}
}
