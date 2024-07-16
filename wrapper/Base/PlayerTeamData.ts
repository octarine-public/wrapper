import { LaneSelectionFlags } from "../Enums/LaneSelectionFlags"
import { EPropertyType } from "../Enums/PropertyType"
import { EntityPropertiesNode } from "./EntityProperties"
import { PlayerEventData } from "./PlayerEventData"

export class PlayerTeamData {
	public PlayerEventsData: PlayerEventData[] = []

	constructor(public readonly properties: EntityPropertiesNode) {}

	public get SelectedHeroID(): number {
		return this.properties.get("m_nSelectedHeroID", EPropertyType.INT32) ?? -1
	}
	public get SelectedHeroVariant(): bigint {
		return this.properties.get("m_nSelectedHeroVariant") ?? 0n
	}
	public get Kills(): number {
		return this.properties.get("m_iKills") ?? -1
	}
	public get Assists(): number {
		return this.properties.get("m_iAssists") ?? -1
	}
	public get Deaths(): number {
		return this.properties.get("m_iDeaths") ?? -1
	}
	public get Streak(): number {
		return this.properties.get("m_iStreak") ?? -1
	}
	public get Level(): number {
		return this.properties.get("m_iLevel") ?? -1
	}
	public get RespawnSeconds(): number {
		return this.properties.get("m_iRespawnSeconds") ?? -1
	}
	public get LastBuybackTime(): number {
		return this.properties.get("m_iLastBuybackTime") ?? -1
	}
	public get SelectedHeroIndex(): number {
		return this.properties.get("m_hSelectedHero") ?? -1
	}
	public get IsAFK(): boolean {
		return this.properties.get("m_bAFK") ?? false
	}
	public get SuggestedHeroes(): number[] {
		return this.properties.get("m_nSuggestedHeroes", EPropertyType.UINT32) ?? []
	}
	public get BanSuggestedHeroes(): boolean[] {
		return this.properties.get("m_bBanSuggestedHeroes") ?? []
	}
	public get VoiceChatBanned(): boolean {
		return this.properties.get("m_bVoiceChatBanned") ?? false
	}
	public get CompendiumLevel(): number {
		return this.properties.get("m_unCompendiumLevel") ?? -1
	}
	public get CanRepick(): boolean {
		return this.properties.get("m_bCanRepick") ?? false
	}
	public get CanEarnRewards(): boolean {
		return this.properties.get("m_bCanEarnRewards") ?? false
	}
	public get HasRandomed(): boolean {
		return this.properties.get("m_bHasRandomed") ?? false
	}
	public get RandomedHeroID(): number {
		return this.properties.get("m_nRandomedHeroID", EPropertyType.UINT32) ?? -1
	}
	public get BattleBonusActive(): boolean {
		return this.properties.get("m_bBattleBonusActive") ?? false
	}
	public get BattleBonusRate(): number {
		return this.properties.get("m_iBattleBonusRate") ?? -1
	}
	public get CustomBuybackCost(): number {
		return this.properties.get("m_iCustomBuybackCost") ?? -1
	}
	// m_CustomPlayerColor?
	public get HasPredictedVictory(): boolean {
		return this.properties.get("m_bHasPredictedVictory") ?? false
	}
	public get UnitShareMasks(): number {
		return this.properties.get("m_UnitShareMasks") ?? -1
	}
	public get TeamSlot(): number {
		return this.properties.get("m_iTeamSlot") ?? -1
	}
	public get BattleCupWinStreak(): number {
		return this.properties.get("m_iBattleCupWinStreak") ?? -1
	}
	public get BattleCupWinDate(): bigint {
		return this.properties.get("m_iBattleCupWinDate") ?? 0n
	}
	public get BattleCupSkillLevel(): number {
		return this.properties.get("m_iBattleCupSkillLevel") ?? -1
	}
	public get BattleCupTeamID(): number {
		return this.properties.get("m_iBattleCupTeamID") ?? -1
	}
	public get BattleCupTournamentID(): number {
		return this.properties.get("m_iBattleCupTournamentID") ?? -1
	}
	public get BattleCupDivision(): number {
		return this.properties.get("m_iBattleCupDivision") ?? -1
	}
	public get TeamFightParticipation(): number {
		return this.properties.get("m_flTeamFightParticipation") ?? -1
	}
	public get FirstBloodClaimed(): number {
		return this.properties.get("m_iFirstBloodClaimed") ?? -1
	}
	public get FirstBloodGiven(): number {
		return this.properties.get("m_iFirstBloodGiven") ?? -1
	}
	public get PickOrder(): number {
		return this.properties.get("m_unPickOrder") ?? -1
	}
	public get TimeOfLastSaluteSent(): number {
		return this.properties.get("m_flTimeOfLastSaluteSent") ?? -1
	}
	public get SelectedHeroBadgeXP(): number {
		return this.properties.get("m_unSelectedHeroBadgeXP") ?? -1
	}
	public get LaneSelectionFlags(): LaneSelectionFlags {
		return this.properties.get("m_eLaneSelectionFlags") ?? LaneSelectionFlags.None
	}
	public get PlayerDraftPreferredRoles(): LaneSelectionFlags {
		return (
			this.properties.get("m_nPlayerDraftPreferredRoles") ?? LaneSelectionFlags.None
		)
	}
	public get PlayerDraftPreferredTeam(): number {
		return this.properties.get("m_nPlayerDraftPreferredTeam") ?? -1
	}
}
