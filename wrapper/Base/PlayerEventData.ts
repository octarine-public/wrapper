import { EntityPropertiesNode } from "./EntityProperties"

export class PlayerEventData {
	constructor(public readonly properties: EntityPropertiesNode) {}
	public get EventID(): number {
		return this.properties.get("m_iEventID") ?? 0
	}
	public get EventPoints(): number {
		return this.properties.get("m_iEventPoints") ?? 0
	}
	public get EventPremiumPoints(): number {
		return this.properties.get("m_iEventPremiumPoints") ?? 0
	}
	public get EventEffectsMask(): number {
		return this.properties.get("m_iEventEffectsMask") ?? 0
	}
	public get EventRanks(): number {
		return this.properties.get("m_iEventRanks") ?? 0
	}
	public get IsEventOwned(): number {
		return this.properties.get("m_bIsEventOwned") ?? 0
	}
	public get FavoriteTeam(): number {
		return this.properties.get("m_iFavoriteTeam") ?? 0
	}
	public get FavoriteTeamQuality(): number {
		return this.properties.get("m_iFavoriteTeamQuality") ?? 0
	}
	public get AvailableSalutes(): number {
		return this.properties.get("m_iAvailableSalutes") ?? 0
	}
	public get SaluteAmountIndex(): number {
		return this.properties.get("m_iSaluteAmountIndex") ?? 0
	}
	public get EventWagerStreak(): number {
		return this.properties.get("m_iEventWagerStreak") ?? 0
	}
	public get EventTeleportFXLevel(): number {
		return this.properties.get("m_iEventTeleportFXLevel") ?? 0
	}
	public get CandyPointsReason(): number[] {
		return this.properties.get("m_nCandyPointsReason") ?? []
	}
	public get SaluteAmounts(): number {
		return this.properties.get("m_iSaluteAmounts") ?? 0
	}
	public get EventArcanaPeriodicResourceRemaining(): number {
		return this.properties.get("m_iEventArcanaPeriodicResourceRemaining") ?? 0
	}
	public get EventArcanaPeriodicResourceMax(): number {
		return this.properties.get("m_iEventArcanaPeriodicResourceMax") ?? 0
	}
	public get EventWagerTokensRemaining(): number {
		return this.properties.get("m_iEventWagerTokensRemaining") ?? 0
	}
	public get EventWagerTokensMax(): number {
		return this.properties.get("m_iEventWagerTokensMax") ?? 0
	}
	public get EventBountiesRemaining(): number {
		return this.properties.get("m_iEventBountiesRemaining") ?? 0
	}
	public get RankWagersAvailable(): number {
		return this.properties.get("m_iRankWagersAvailable") ?? 0
	}
	public get RankWagersMax(): number {
		return this.properties.get("m_iRankWagersMax") ?? 0
	}
	public get EventPointAdjustmentsRemaining(): number {
		return this.properties.get("m_iEventPointAdjustmentsRemaining") ?? 0
	}
}
