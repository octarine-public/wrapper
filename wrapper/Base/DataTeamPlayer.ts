import { EntityPropertiesNode } from "./EntityProperties"

export class DataTeamPlayer {
	constructor(public readonly properties: EntityPropertiesNode) {}

	public get TotalEarnedGold(): number {
		return this.properties.get("m_iTotalEarnedGold") as number
	}
	public get ReliableGold(): number {
		return this.properties.get("m_iReliableGold") as number
	}
	public get UnreliableGold(): number {
		return this.properties.get("m_iUnreliableGold") as number
	}
	public get StartingPosition(): number {
		return this.properties.get("m_iStartingPosition") as number
	}
	public get TotalEarnedXP(): number {
		return this.properties.get("m_iTotalEarnedXP") as number
	}
	public get SharedGold(): number {
		return this.properties.get("m_iSharedGold") as number
	}
	public get HeroKillGold(): number {
		return this.properties.get("m_iHeroKillGold") as number
	}
	public get CreepKillGold(): number {
		return this.properties.get("m_iCreepKillGold") as number
	}
	public get BuildingGold(): number {
		return this.properties.get("m_iBuildingGold") as number
	}
	public get OtherGold(): number {
		return this.properties.get("m_iOtherGold") as number
	}
	public get ComebackGold(): number {
		return this.properties.get("m_iComebackGold") as number
	}
	// m_iExperimentalGold, m_iExperimental2Gold?
	public get CreepDenyGold(): number {
		return this.properties.get("m_iCreepDenyGold") as number
	}
	public get TPScrollsPurchased(): number {
		return this.properties.get("m_iTPScrollsPurchased") as number
	}
	public get IncomeGold(): number {
		return this.properties.get("m_iIncomeGold") as number
	}
	public get NetWorth(): number {
		return this.properties.get("m_iNetWorth") as number
	}
	public get DenyCount(): number {
		return this.properties.get("m_iDenyCount") as number
	}
	public get LastHitCount(): number {
		return this.properties.get("m_iLastHitCount") as number
	}
	public get LastHitStreak(): number {
		return this.properties.get("m_iLastHitStreak") as number
	}
	public get LastHitMultikill(): number {
		return this.properties.get("m_iLastHitMultikill") as number
	}
	public get NearbyCreepDeathCount(): number {
		return this.properties.get("m_iNearbyCreepDeathCount") as number
	}
	public get ClaimedDenyCount(): number {
		return this.properties.get("m_iClaimedDenyCount") as number
	}
	public get ClaimedMissCount(): number {
		return this.properties.get("m_iClaimedMissCount") as number
	}
	public get MissCount(): number {
		return this.properties.get("m_iMissCount") as number
	}
	public get PossibleHeroSelection(): number {
		return this.properties.get("m_nPossibleHeroSelection") as number
	}
	public get MetaLevel(): number {
		return this.properties.get("m_iMetaLevel") as number
	}
	public get MetaExperience(): number {
		return this.properties.get("m_iMetaExperience") as number
	}
	public get MetaExperienceAwarded(): number {
		return this.properties.get("m_iMetaExperienceAwarded") as number
	}
	public get BuybackCooldownTime(): number {
		return this.properties.get("m_flBuybackCooldownTime") as number
	}
	public get BuybackGoldLimitTime(): number {
		return this.properties.get("m_flBuybackGoldLimitTime") as number
	}
	public get BuybackCostTime(): number {
		return this.properties.get("m_flBuybackCostTime") as number
	}
	public get CustomBuybackCooldown(): number {
		return this.properties.get("m_flCustomBuybackCooldown") as number
	}
	public get Stuns(): number {
		return this.properties.get("m_fStuns") as number
	}
	public get Healing(): number {
		return this.properties.get("m_fHealing") as number
	}
	public get TowerKills(): number {
		return this.properties.get("m_iTowerKills") as number
	}
	public get RoshanKills(): number {
		return this.properties.get("m_iRoshanKills") as number
	}
	// m_hCameraTarget, m_hOverrideSelectionEntity?
	public get ObserverWardsPlaced(): number {
		return this.properties.get("m_iObserverWardsPlaced") as number
	}
	public get SentryWardsPlaced(): number {
		return this.properties.get("m_iSentryWardsPlaced") as number
	}
	public get CreepsStacked(): number {
		return this.properties.get("m_iCreepsStacked") as number
	}
	public get CampsStacked(): number {
		return this.properties.get("m_iCampsStacked") as number
	}
	public get RunePickups(): number {
		return this.properties.get("m_iRunePickups") as number
	}
	public get GoldSpentOnSupport(): number {
		return this.properties.get("m_iGoldSpentOnSupport") as number
	}
	public get HeroDamage(): number {
		return this.properties.get("m_iHeroDamage") as number
	}
	public get WardsPurchased(): number {
		return this.properties.get("m_iWardsPurchased") as number
	}
	public get WardsDestroyed(): number {
		return this.properties.get("m_iWardsDestroyed") as number
	}
	public get Items(): number[] {
		return this.properties.get("m_hItems") as number[]
	}
	public get Parity(): number {
		return this.properties.get("m_iParity") as number
	}
	public get InventoryParent(): number {
		return this.properties.get("m_hInventoryParent") as number
	}
	public get StashEnabled(): boolean {
		return this.properties.get("m_bStashEnabled") as boolean
	}
	public get TransientCastItem(): number {
		return this.properties.get("m_hTransientCastItem") as number
	}
	public get KillsPerOpposingTeamMember(): number[] {
		return this.properties.get("m_nKillsPerOpposingTeamMember") as number[]
	}
	public get SuggestedAbilities(): number[] {
		return this.properties.get("m_iSuggestedAbilities") as number[]
	}
	public get SuggestedAbilityWeights(): number[] {
		return this.properties.get("m_fSuggestedAbilityWeights") as number[]
	}
	public get SuggestedPregameItems(): number[] {
		return this.properties.get("m_iSuggestedPregameItems") as number[]
	}
	public get SuggestedItemSequences(): number[] {
		return this.properties.get("m_iSuggestedItemSequences") as number[]
	}
	// TODO: m_iSuggestedWeightedItems: WeightedSuggestion_t[]
	public get SuggestedHeroes(): number[] {
		return this.properties.get("m_iSuggestedHeroes") as number[]
	}
	public get SuggestedHeroesWeights(): number[] {
		return this.properties.get("m_flSuggestedHeroesWeights") as number[]
	}
	public get DamageByTypeReceivedPreReduction(): number[] {
		return this.properties.get(
			"m_iDamageByTypeReceivedPreReduction"
		) as number[]
	}
	public get DamageByTypeReceivedPostReduction(): number[] {
		return this.properties.get(
			"m_iDamageByTypeReceivedPostReduction"
		) as number[]
	}
	public get CommandsIssued(): number {
		return this.properties.get("m_iCommandsIssued") as number
	}
	public get GoldSpentOnConsumables(): number {
		return this.properties.get("m_iGoldSpentOnConsumables") as number
	}
	public get GoldSpentOnItems(): number {
		return this.properties.get("m_iGoldSpentOnItems") as number
	}
	public get GoldSpentOnBuybacks(): number {
		return this.properties.get("m_iGoldSpentOnBuybacks") as number
	}
	public get GoldLostToDeath(): number {
		return this.properties.get("m_iGoldLostToDeath") as number
	}
	public get IsNewPlayer(): boolean {
		return this.properties.get("m_bIsNewPlayer") as boolean
	}
	public get IsGuidePlayer(): boolean {
		return this.properties.get("m_bIsGuidePlayer") as boolean
	}
	public get PlayerSteamID(): bigint {
		return this.properties.get("m_iPlayerSteamID") as bigint
	}
	public get SmokesUsed(): boolean {
		return this.properties.get("m_iSmokesUsed") as boolean
	}
	public get NeutralTokensFound(): boolean {
		return this.properties.get("m_iNeutralTokensFound") as boolean
	}
	public get WatchersTaken(): boolean {
		return this.properties.get("m_iWatchersTaken") as boolean
	}
	public get LotusesTaken(): boolean {
		return this.properties.get("m_iLotusesTaken") as boolean
	}
	public get TormentorKills(): boolean {
		return this.properties.get("m_iTormentorKills") as boolean
	}
	public get CourierKills(): boolean {
		return this.properties.get("m_iCourierKills") as boolean
	}
	public toJSON(): any {
		return {
			TotalEarnedGold: this.TotalEarnedGold,
			ReliableGold: this.ReliableGold,
			UnreliableGold: this.UnreliableGold,
			StartingPosition: this.StartingPosition,
			TotalEarnedXP: this.TotalEarnedXP,
			SharedGold: this.SharedGold,
			HeroKillGold: this.HeroKillGold,
			CreepKillGold: this.CreepKillGold,
			BuildingGold: this.BuildingGold,
			OtherGold: this.OtherGold,
			ComebackGold: this.ComebackGold,
			CreepDenyGold: this.CreepDenyGold,
			TPScrollsPurchased: this.TPScrollsPurchased,
			IncomeGold: this.IncomeGold,
			NetWorth: this.NetWorth,
			DenyCount: this.DenyCount,
			LastHitCount: this.LastHitCount,
			LastHitStreak: this.LastHitStreak,
			LastHitMultikill: this.LastHitMultikill,
			NearbyCreepDeathCount: this.NearbyCreepDeathCount,
			ClaimedDenyCount: this.ClaimedDenyCount,
			ClaimedMissCount: this.ClaimedMissCount,
			MissCount: this.MissCount,
			PossibleHeroSelection: this.PossibleHeroSelection,
			MetaLevel: this.MetaLevel,
			MetaExperience: this.MetaExperience,
			MetaExperienceAwarded: this.MetaExperienceAwarded,
			BuybackCooldownTime: this.BuybackCooldownTime,
			BuybackGoldLimitTime: this.BuybackGoldLimitTime,
			BuybackCostTime: this.BuybackCostTime,
			CustomBuybackCooldown: this.CustomBuybackCooldown,
			Stuns: this.Stuns,
			Healing: this.Healing,
			TowerKills: this.TowerKills,
			RoshanKills: this.RoshanKills,
			ObserverWardsPlaced: this.ObserverWardsPlaced,
			SentryWardsPlaced: this.SentryWardsPlaced,
			CreepsStacked: this.CreepsStacked,
			CampsStacked: this.CampsStacked,
			RunePickups: this.RunePickups,
			GoldSpentOnSupport: this.GoldSpentOnSupport,
			HeroDamage: this.HeroDamage,
			WardsPurchased: this.WardsPurchased,
			WardsDestroyed: this.WardsDestroyed,
			Items: this.Items,
			Parity: this.Parity,
			InventoryParent: this.InventoryParent,
			StashEnabled: this.StashEnabled,
			TransientCastItem: this.TransientCastItem,
			KillsPerOpposingTeamMember: this.KillsPerOpposingTeamMember,
			SuggestedAbilities: this.SuggestedAbilities,
			SuggestedAbilityWeights: this.SuggestedAbilityWeights,
			SuggestedPregameItems: this.SuggestedPregameItems,
			SuggestedItemSequences: this.SuggestedItemSequences,
			SuggestedHeroes: this.SuggestedHeroes,
			SuggestedHeroesWeights: this.SuggestedHeroesWeights,
			DamageByTypeReceivedPreReduction: this.DamageByTypeReceivedPreReduction,
			DamageByTypeReceivedPostReduction: this.DamageByTypeReceivedPostReduction,
			CommandsIssued: this.CommandsIssued,
			GoldSpentOnConsumables: this.GoldSpentOnConsumables,
			GoldSpentOnItems: this.GoldSpentOnItems,
			GoldSpentOnBuybacks: this.GoldSpentOnBuybacks,
			GoldLostToDeath: this.GoldLostToDeath,
			IsNewPlayer: this.IsNewPlayer,
			IsGuidePlayer: this.IsGuidePlayer
		}
	}
}
