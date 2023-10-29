import { LaneSelectionFlags } from "../Enums/LaneSelectionFlags"
import { EntityPropertiesNode } from "./EntityProperties"
import { PlayerEventData } from "./PlayerEventData"

export class PlayerTeamData {
	public PlayerEventsData: PlayerEventData[] = []

	constructor(public readonly properties: EntityPropertiesNode) {}

	public get SelectedHeroID(): number {
		return this.properties.get("m_nSelectedHeroID") as number
	}
	public get Kills(): number {
		return this.properties.get("m_iKills") as number
	}
	public get Assists(): number {
		return this.properties.get("m_iAssists") as number
	}
	public get Deaths(): number {
		return this.properties.get("m_iDeaths") as number
	}
	public get Streak(): number {
		return this.properties.get("m_iStreak") as number
	}
	public get Level(): number {
		return this.properties.get("m_iLevel") as number
	}
	public get RespawnSeconds(): number {
		return this.properties.get("m_iRespawnSeconds") as number
	}
	public get LastBuybackTime(): number {
		return this.properties.get("m_iLastBuybackTime") as number
	}
	public get SelectedHeroIndex(): number {
		return this.properties.get("m_hSelectedHero") as number
	}
	public get IsAFK(): boolean {
		return this.properties.get("m_bAFK") as boolean
	}
	public get SuggestedHeroes(): number[] {
		return this.properties.get("m_nSuggestedHeroes") as number[]
	}
	public get BanSuggestedHeroes(): number[] {
		return this.properties.get("m_bBanSuggestedHeroes") as number[]
	}
	public get VoiceChatBanned(): boolean {
		return this.properties.get("m_bVoiceChatBanned") as boolean
	}
	public get CompendiumLevel(): number {
		return this.properties.get("m_unCompendiumLevel") as number
	}
	public get CanRepick(): boolean {
		return this.properties.get("m_bCanRepick") as boolean
	}
	public get CanEarnRewards(): boolean {
		return this.properties.get("m_bCanEarnRewards") as boolean
	}
	public get HasRandomed(): boolean {
		return this.properties.get("m_bHasRandomed") as boolean
	}
	public get RandomedHeroID(): number {
		return this.properties.get("m_nRandomedHeroID") as number
	}
	public get BattleBonusActive(): boolean {
		return this.properties.get("m_bBattleBonusActive") as boolean
	}
	public get BattleBonusRate(): number {
		return this.properties.get("m_iBattleBonusRate") as number
	}
	public get CustomBuybackCost(): number {
		return this.properties.get("m_iCustomBuybackCost") as number
	}
	// m_CustomPlayerColor?
	public get HasPredictedVictory(): boolean {
		return this.properties.get("m_bHasPredictedVictory") as boolean
	}
	public get UnitShareMasks(): number {
		return this.properties.get("m_UnitShareMasks") as number
	}
	public get TeamSlot(): number {
		return this.properties.get("m_iTeamSlot") as number
	}
	public get BattleCupWinStreak(): number {
		return this.properties.get("m_iBattleCupWinStreak") as number
	}
	public get BattleCupWinDate(): bigint {
		return this.properties.get("m_iBattleCupWinDate") as bigint
	}
	public get BattleCupSkillLevel(): number {
		return this.properties.get("m_iBattleCupSkillLevel") as number
	}
	public get BattleCupTeamID(): number {
		return this.properties.get("m_iBattleCupTeamID") as number
	}
	public get BattleCupTournamentID(): number {
		return this.properties.get("m_iBattleCupTournamentID") as number
	}
	public get BattleCupDivision(): number {
		return this.properties.get("m_iBattleCupDivision") as number
	}
	public get TeamFightParticipation(): number {
		return this.properties.get("m_flTeamFightParticipation") as number
	}
	public get FirstBloodClaimed(): number {
		return this.properties.get("m_iFirstBloodClaimed") as number
	}
	public get FirstBloodGiven(): number {
		return this.properties.get("m_iFirstBloodGiven") as number
	}
	public get PickOrder(): number {
		return this.properties.get("m_unPickOrder") as number
	}
	public get TimeOfLastSaluteSent(): number {
		return this.properties.get("m_flTimeOfLastSaluteSent") as number
	}
	public get SelectedHeroBadgeXP(): number {
		return this.properties.get("m_unSelectedHeroBadgeXP") as number
	}
	public get LaneSelectionFlags(): LaneSelectionFlags {
		return this.properties.get("m_eLaneSelectionFlags") as LaneSelectionFlags
	}
	public get PlayerDraftPreferredRoles(): LaneSelectionFlags {
		return this.properties.get("m_nPlayerDraftPreferredRoles") as LaneSelectionFlags
	}
	public get PlayerDraftPreferredTeam(): number {
		return this.properties.get("m_nPlayerDraftPreferredTeam") as number
	}
	public toJSON() {
		return {
			SelectedHeroID: this.SelectedHeroID,
			Kills: this.Kills,
			Assists: this.Assists,
			Deaths: this.Deaths,
			Streak: this.Streak,
			Level: this.Level,
			RespawnSeconds: this.RespawnSeconds,
			LastBuybackTime: this.LastBuybackTime,
			SelectedHeroIndex: this.SelectedHeroIndex,
			IsAFK: this.IsAFK,
			SuggestedHeroes: this.SuggestedHeroes,
			BanSuggestedHeroes: this.BanSuggestedHeroes,
			VoiceChatBanned: this.VoiceChatBanned,
			CompendiumLevel: this.CompendiumLevel,
			CanRepick: this.CanRepick,
			CanEarnRewards: this.CanEarnRewards,
			HasRandomed: this.HasRandomed,
			RandomedHeroID: this.RandomedHeroID,
			BattleBonusActive: this.BattleBonusActive,
			BattleBonusRate: this.BattleBonusRate,
			CustomBuybackCost: this.CustomBuybackCost,
			HasPredictedVictory: this.HasPredictedVictory,
			UnitShareMasks: this.UnitShareMasks,
			TeamSlot: this.TeamSlot,
			BattleCupWinStreak: this.BattleCupWinStreak,
			BattleCupWinDate: this.BattleCupWinDate,
			BattleCupSkillLevel: this.BattleCupSkillLevel,
			BattleCupTeamID: this.BattleCupTeamID,
			BattleCupTournamentID: this.BattleCupTournamentID,
			BattleCupDivision: this.BattleCupDivision,
			TeamFightParticipation: this.TeamFightParticipation,
			FirstBloodClaimed: this.FirstBloodClaimed,
			FirstBloodGiven: this.FirstBloodGiven,
			PickOrder: this.PickOrder,
			TimeOfLastSaluteSent: this.TimeOfLastSaluteSent,
			SelectedHeroBadgeXP: this.SelectedHeroBadgeXP
		}
	}
}
