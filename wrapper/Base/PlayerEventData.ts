import { EntityPropertiesNode } from "./EntityProperties"

export class PlayerEventData {
	constructor(public readonly properties: EntityPropertiesNode) {}
	public get EventID(): number {
		return this.properties.get("m_iEventID") as number
	}
	public get EventPoints(): number {
		return this.properties.get("m_iEventPoints") as number
	}
	public get EventPremiumPoints(): number {
		return this.properties.get("m_iEventPremiumPoints") as number
	}
	public get EventEffectsMask(): number {
		return this.properties.get("m_iEventEffectsMask") as number
	}
	public get EventRanks(): number {
		return this.properties.get("m_iEventRanks") as number
	}
	public get IsEventOwned(): number {
		return this.properties.get("m_bIsEventOwned") as number
	}
	public get FavoriteTeam(): number {
		return this.properties.get("m_iFavoriteTeam") as number
	}
	public get FavoriteTeamQuality(): number {
		return this.properties.get("m_iFavoriteTeamQuality") as number
	}
	public get AvailableSalutes(): number {
		return this.properties.get("m_iAvailableSalutes") as number
	}
	public get SaluteAmountIndex(): number {
		return this.properties.get("m_iSaluteAmountIndex") as number
	}
	public get EventWagerStreak(): number {
		return this.properties.get("m_iEventWagerStreak") as number
	}
	public get EventTeleportFXLevel(): number {
		return this.properties.get("m_iEventTeleportFXLevel") as number
	}
	public get CandyPointsReason(): number[] {
		return this.properties.get("m_nCandyPointsReason") as number[]
	}
	public get SaluteAmounts(): number {
		return this.properties.get("m_iSaluteAmounts") as number
	}
	public get EventArcanaPeriodicResourceRemaining(): number {
		return this.properties.get("m_iEventArcanaPeriodicResourceRemaining") as number
	}
	public get EventArcanaPeriodicResourceMax(): number {
		return this.properties.get("m_iEventArcanaPeriodicResourceMax") as number
	}
	public get EventWagerTokensRemaining(): number {
		return this.properties.get("m_iEventWagerTokensRemaining") as number
	}
	public get EventWagerTokensMax(): number {
		return this.properties.get("m_iEventWagerTokensMax") as number
	}
	public get EventBountiesRemaining(): number {
		return this.properties.get("m_iEventBountiesRemaining") as number
	}
	public get RankWagersAvailable(): number {
		return this.properties.get("m_iRankWagersAvailable") as number
	}
	public get RankWagersMax(): number {
		return this.properties.get("m_iRankWagersMax") as number
	}
	public get EventPointAdjustmentsRemaining(): number {
		return this.properties.get("m_iEventPointAdjustmentsRemaining") as number
	}
}
