import { LaneSelectionFlags } from "../Enums/LaneSelectionFlags"
import { EPropertyType } from "../Enums/PropertyType"
import { EntityPropertiesNode } from "./EntityProperties"
import { PlayerEventData } from "./PlayerEventData"

export class PlayerTeamData {
	public PlayerEventsData: PlayerEventData[] = []

	constructor(public readonly properties: EntityPropertiesNode) {}

	public get SelectedHeroID(): number {
		return this.properties.get("m_nSelectedHeroID", EPropertyType.INT32) ?? 0
	}
	public get SelectedHeroVariant(): bigint {
		return this.properties.get("m_nSelectedHeroVariant") ?? 0n
	}
	public get Kills(): number {
		return this.properties.get("m_iKills") ?? 0
	}
	public get Assists(): number {
		return this.properties.get("m_iAssists") ?? 0
	}
	public get Deaths(): number {
		return this.properties.get("m_iDeaths") ?? 0
	}
	public get Streak(): number {
		return this.properties.get("m_iStreak") ?? 0
	}
	public get Level(): number {
		return this.properties.get("m_iLevel") ?? 0
	}
	public get RespawnSeconds(): number {
		return this.properties.get("m_iRespawnSeconds") ?? 0
	}
	public get LastBuybackTime(): number {
		return this.properties.get("m_iLastBuybackTime") ?? 0
	}
	public get SelectedHeroIndex(): number {
		return this.properties.get("m_hSelectedHero") ?? 0
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
		return this.properties.get("m_unCompendiumLevel") ?? 0
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
		return this.properties.get("m_nRandomedHeroID", EPropertyType.UINT32) ?? 0
	}
	public get BattleBonusActive(): boolean {
		return this.properties.get("m_bBattleBonusActive") ?? false
	}
	public get BattleBonusRate(): number {
		return this.properties.get("m_iBattleBonusRate") ?? 0
	}
	public get CustomBuybackCost(): number {
		return this.properties.get("m_iCustomBuybackCost") ?? 0
	}
	// m_CustomPlayerColor?
	public get HasPredictedVictory(): boolean {
		return this.properties.get("m_bHasPredictedVictory") ?? false
	}
	public get UnitShareMasks(): number {
		return this.properties.get("m_UnitShareMasks") ?? 0
	}
	public get TeamSlot(): number {
		return this.properties.get("m_iTeamSlot") ?? 0
	}
	public get BattleCupWinStreak(): number {
		return this.properties.get("m_iBattleCupWinStreak") ?? 0
	}
	public get BattleCupWinDate(): bigint {
		return this.properties.get("m_iBattleCupWinDate") ?? 0n
	}
	public get BattleCupSkillLevel(): number {
		return this.properties.get("m_iBattleCupSkillLevel") ?? 0
	}
	public get BattleCupTeamID(): number {
		return this.properties.get("m_iBattleCupTeamID") ?? 0
	}
	public get BattleCupTournamentID(): number {
		return this.properties.get("m_iBattleCupTournamentID") ?? 0
	}
	public get BattleCupDivision(): number {
		return this.properties.get("m_iBattleCupDivision") ?? 0
	}
	public get TeamFightParticipation(): number {
		return this.properties.get("m_flTeamFightParticipation") ?? 0
	}
	public get FirstBloodClaimed(): number {
		return this.properties.get("m_iFirstBloodClaimed") ?? 0
	}
	public get FirstBloodGiven(): number {
		return this.properties.get("m_iFirstBloodGiven") ?? 0
	}
	public get PickOrder(): number {
		return this.properties.get("m_unPickOrder") ?? 0
	}
	public get TimeOfLastSaluteSent(): number {
		return this.properties.get("m_flTimeOfLastSaluteSent") ?? 0
	}
	public get SelectedHeroBadgeXP(): number {
		return this.properties.get("m_unSelectedHeroBadgeXP") ?? 0
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
		return this.properties.get("m_nPlayerDraftPreferredTeam") ?? 0
	}
}
