import { Team } from "../Enums/Team"
import { AbilityData } from "../Objects/DataBook/AbilityData"
import { EntityPropertiesNode } from "./EntityProperties"

export class StockInfo {
	constructor(public readonly properties: EntityPropertiesNode) {}

	public get AbilityID() {
		return Number((this.properties.get<bigint>("nItemAbilityID") ?? -1n) >> 1n)
	}
	public get PlayerID() {
		return this.properties.get<number>("iPlayerID")
	}
	public get InitStockDuration() {
		return this.properties.get<number>("fInitialStockDuration")
	}
	public get StockDuration() {
		return this.properties.get<number>("fStockDuration")
	}
	public get StockTime() {
		return this.properties.get<number>("fStockTime")
	}
	public get MaxCount() {
		return this.properties.get<number>("iMaxCount")
	}
	public get Team() {
		return this.properties.get<Team>("iTeamNumber")
	}
	public get IsAvalible() {
		return (this.StockCount ?? 0) > 0
	}
	public get StockCount() {
		return this.properties.get<number>("iStockCount")
	}
	public get PlayerNumber() {
		return this.properties.get<number>("iPlayerNumber")
	}
	public get BonusDelayedStockCount() {
		return this.properties.get<number>("iBonusDelayedStockCount")
	}
	public GetAbilityData(): AbilityData {
		return AbilityData.GetAbilityByName(this.GetAbilityName()) ?? AbilityData.empty
	}
	public GetAbilityName(): string {
		return AbilityData.GetAbilityNameByID(this.AbilityID) ?? ""
	}
}
