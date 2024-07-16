import { EPropertyType } from "../Enums/PropertyType"
import { EntityPropertiesNode } from "./EntityProperties"

export class DataTeamPlayer {
	constructor(public readonly properties: EntityPropertiesNode) {}

	public get TotalEarnedGold(): number {
		return this.properties.get("m_iTotalEarnedGold") ?? -1
	}
	public get ReliableGold(): number {
		return this.properties.get("m_iReliableGold") ?? -1
	}
	public get UnreliableGold(): number {
		return this.properties.get("m_iUnreliableGold") ?? -1
	}
	public get StartingPosition(): number {
		return this.properties.get("m_iStartingPosition") ?? -1
	}
	public get TotalEarnedXP(): number {
		return this.properties.get("m_iTotalEarnedXP") ?? -1
	}
	public get SharedGold(): number {
		return this.properties.get("m_iSharedGold") ?? -1
	}
	public get HeroKillGold(): number {
		return this.properties.get("m_iHeroKillGold") ?? -1
	}
	public get CreepKillGold(): number {
		return this.properties.get("m_iCreepKillGold") ?? -1
	}
	public get BuildingGold(): number {
		return this.properties.get("m_iBuildingGold") ?? -1
	}
	public get OtherGold(): number {
		return this.properties.get("m_iOtherGold") ?? -1
	}
	public get ComebackGold(): number {
		return this.properties.get("m_iComebackGold") ?? -1
	}
	// m_iExperimentalGold, m_iExperimental2Gold?
	public get CreepDenyGold(): number {
		return this.properties.get("m_iCreepDenyGold") ?? -1
	}
	public get TPScrollsPurchased(): number {
		return this.properties.get("m_iTPScrollsPurchased") ?? -1
	}
	public get IncomeGold(): number {
		return this.properties.get("m_iIncomeGold") ?? -1
	}
	public get NetWorth(): number {
		return this.properties.get("m_iNetWorth") ?? -1
	}
	public get DenyCount(): number {
		return this.properties.get("m_iDenyCount") ?? -1
	}
	public get LastHitCount(): number {
		return this.properties.get("m_iLastHitCount") ?? -1
	}
	public get LastHitStreak(): number {
		return this.properties.get("m_iLastHitStreak") ?? -1
	}
	public get LastHitMultikill(): number {
		return this.properties.get("m_iLastHitMultikill") ?? -1
	}
	public get NearbyCreepDeathCount(): number {
		return this.properties.get("m_iNearbyCreepDeathCount") ?? -1
	}
	public get ClaimedDenyCount(): number {
		return this.properties.get("m_iClaimedDenyCount") ?? -1
	}
	public get ClaimedMissCount(): number {
		return this.properties.get("m_iClaimedMissCount") ?? -1
	}
	public get MissCount(): number {
		return this.properties.get("m_iMissCount") ?? -1
	}
	public get PossibleHeroSelection(): number {
		return this.properties.get("m_nPossibleHeroSelection", EPropertyType.INT32) ?? -1
	}
	public get MetaLevel(): number {
		return this.properties.get("m_iMetaLevel") ?? -1
	}
	public get MetaExperience(): number {
		return this.properties.get("m_iMetaExperience") ?? -1
	}
	public get MetaExperienceAwarded(): number {
		return this.properties.get("m_iMetaExperienceAwarded") ?? -1
	}
	public get BuybackCooldownTime(): number {
		return this.properties.get("m_flBuybackCooldownTime") ?? -1
	}
	public get BuybackGoldLimitTime(): number {
		return this.properties.get("m_flBuybackGoldLimitTime") ?? -1
	}
	public get BuybackCostTime(): number {
		return this.properties.get("m_flBuybackCostTime") ?? -1
	}
	public get CustomBuybackCooldown(): number {
		return this.properties.get("m_flCustomBuybackCooldown") ?? -1
	}
	public get Stuns(): number {
		return this.properties.get("m_fStuns") ?? -1
	}
	public get Healing(): number {
		return this.properties.get("m_fHealing") ?? -1
	}
	public get TowerKills(): number {
		return this.properties.get("m_iTowerKills") ?? -1
	}
	public get RoshanKills(): number {
		return this.properties.get("m_iRoshanKills") ?? -1
	}
	// m_hCameraTarget, m_hOverrideSelectionEntity?
	public get ObserverWardsPlaced(): number {
		return this.properties.get("m_iObserverWardsPlaced") ?? -1
	}
	public get SentryWardsPlaced(): number {
		return this.properties.get("m_iSentryWardsPlaced") ?? -1
	}
	public get CreepsStacked(): number {
		return this.properties.get("m_iCreepsStacked") ?? -1
	}
	public get CampsStacked(): number {
		return this.properties.get("m_iCampsStacked") ?? -1
	}
	public get RunePickups(): number {
		return this.properties.get("m_iRunePickups") ?? -1
	}
	public get GoldSpentOnSupport(): number {
		return this.properties.get("m_iGoldSpentOnSupport") ?? -1
	}
	public get HeroDamage(): number {
		return this.properties.get("m_iHeroDamage") ?? -1
	}
	public get WardsPurchased(): number {
		return this.properties.get("m_iWardsPurchased") ?? -1
	}
	public get WardsDestroyed(): number {
		return this.properties.get("m_iWardsDestroyed") ?? -1
	}
	public get Items(): number[] {
		return this.properties.get("m_hItems") ?? []
	}
	public get Parity(): number {
		return this.properties.get("m_iParity") ?? -1
	}
	public get InventoryParent(): number {
		return this.properties.get("m_hInventoryParent") ?? -1
	}
	public get StashEnabled(): boolean {
		return this.properties.get("m_bStashEnabled") ?? false
	}
	public get TransientCastItem(): number {
		return this.properties.get("m_hTransientCastItem") ?? -1
	}
	public get KillsPerOpposingTeamMember(): number[] {
		return this.properties.get("m_nKillsPerOpposingTeamMember") ?? []
	}
	public get SuggestedAbilities(): number[] {
		return this.properties.get("m_iSuggestedAbilities") ?? []
	}
	public get SuggestedAbilityWeights(): number[] {
		return this.properties.get("m_fSuggestedAbilityWeights") ?? []
	}
	public get SuggestedPregameItems(): number[] {
		return this.properties.get("m_iSuggestedPregameItems") ?? []
	}
	public get SuggestedItemSequences(): number[] {
		return this.properties.get("m_iSuggestedItemSequences") ?? []
	}
	// TODO: m_iSuggestedWeightedItems: WeightedSuggestion_t[]
	public get SuggestedHeroes(): number[] {
		return this.properties.get("m_iSuggestedHeroes", EPropertyType.UINT32) ?? []
	}
	public get SuggestedHeroesWeights(): number[] {
		return this.properties.get("m_flSuggestedHeroesWeights") ?? []
	}
	public get DamageByTypeReceivedPreReduction(): number[] {
		return this.properties.get("m_iDamageByTypeReceivedPreReduction") ?? []
	}
	public get DamageByTypeReceivedPostReduction(): number[] {
		return this.properties.get("m_iDamageByTypeReceivedPostReduction") ?? []
	}
	public get CommandsIssued(): number {
		return this.properties.get("m_iCommandsIssued") ?? -1
	}
	public get GoldSpentOnConsumables(): number {
		return this.properties.get("m_iGoldSpentOnConsumables") ?? -1
	}
	public get GoldSpentOnItems(): number {
		return this.properties.get("m_iGoldSpentOnItems") ?? -1
	}
	public get GoldSpentOnBuybacks(): number {
		return this.properties.get("m_iGoldSpentOnBuybacks") ?? -1
	}
	public get GoldLostToDeath(): number {
		return this.properties.get("m_iGoldLostToDeath") ?? -1
	}
	public get IsNewPlayer(): boolean {
		return this.properties.get("m_bIsNewPlayer") ?? false
	}
	public get IsGuidePlayer(): boolean {
		return this.properties.get("m_bIsGuidePlayer") ?? false
	}
	public get PlayerSteamID(): bigint {
		return this.properties.get("m_iPlayerSteamID") ?? 1n
	}
	public get SmokesUsed(): number {
		return this.properties.get("m_iSmokesUsed") ?? -1
	}
	public get NeutralTokensFound(): number {
		return this.properties.get("m_iNeutralTokensFound") ?? -1
	}
	public get WatchersTaken(): number {
		return this.properties.get("m_iWatchersTaken") ?? -1
	}
	public get LotusesTaken(): number {
		return this.properties.get("m_iLotusesTaken") ?? -1
	}
	public get TormentorKills(): number {
		return this.properties.get("m_iTormentorKills") ?? -1
	}
	public get CourierKills(): number {
		return this.properties.get("m_iCourierKills") ?? -1
	}
	public get PossibleHeroFacetSelection(): bigint {
		return this.properties.get("m_nPossibleHeroFacetSelection") ?? 0n
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
