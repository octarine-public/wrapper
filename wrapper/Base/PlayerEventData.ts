import { EntityPropertiesNode } from "./EntityProperties"

export class PlayerEventData {
	constructor(public readonly properties: EntityPropertiesNode) {}
	public get EventID(): number {
		return this.properties.get("m_iEventID") ?? -1
	}
	public get EventPoints(): number {
		return this.properties.get("m_iEventPoints") ?? -1
	}
	public get EventPremiumPoints(): number {
		return this.properties.get("m_iEventPremiumPoints") ?? -1
	}
	public get EventEffectsMask(): number {
		return this.properties.get("m_iEventEffectsMask") ?? -1
	}
	public get EventRanks(): number {
		return this.properties.get("m_iEventRanks") ?? -1
	}
	public get IsEventOwned(): number {
		return this.properties.get("m_bIsEventOwned") ?? -1
	}
	public get FavoriteTeam(): number {
		return this.properties.get("m_iFavoriteTeam") ?? -1
	}
	public get FavoriteTeamQuality(): number {
		return this.properties.get("m_iFavoriteTeamQuality") ?? -1
	}
	public get AvailableSalutes(): number {
		return this.properties.get("m_iAvailableSalutes") ?? -1
	}
	public get SaluteAmountIndex(): number {
		return this.properties.get("m_iSaluteAmountIndex") ?? -1
	}
	public get EventWagerStreak(): number {
		return this.properties.get("m_iEventWagerStreak") ?? -1
	}
	public get EventTeleportFXLevel(): number {
		return this.properties.get("m_iEventTeleportFXLevel") ?? -1
	}
	public get CandyPointsReason(): number[] {
		return this.properties.get("m_nCandyPointsReason") ?? []
	}
	public get SaluteAmounts(): number {
		return this.properties.get("m_iSaluteAmounts") ?? -1
	}
	public get EventArcanaPeriodicResourceRemaining(): number {
		return this.properties.get("m_iEventArcanaPeriodicResourceRemaining") ?? -1
	}
	public get EventArcanaPeriodicResourceMax(): number {
		return this.properties.get("m_iEventArcanaPeriodicResourceMax") ?? -1
	}
	public get EventWagerTokensRemaining(): number {
		return this.properties.get("m_iEventWagerTokensRemaining") ?? -1
	}
	public get EventWagerTokensMax(): number {
		return this.properties.get("m_iEventWagerTokensMax") ?? -1
	}
	public get EventBountiesRemaining(): number {
		return this.properties.get("m_iEventBountiesRemaining") ?? -1
	}
	public get RankWagersAvailable(): number {
		return this.properties.get("m_iRankWagersAvailable") ?? -1
	}
	public get RankWagersMax(): number {
		return this.properties.get("m_iRankWagersMax") ?? -1
	}
	public get EventPointAdjustmentsRemaining(): number {
		return this.properties.get("m_iEventPointAdjustmentsRemaining") ?? -1
	}
}
