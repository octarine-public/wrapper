import { EPropertyType } from "../Enums/PropertyType"
import { EntityPropertiesNode } from "./EntityProperties"

export class DataTeamPlayer {
	constructor(public readonly properties: EntityPropertiesNode) {}

	public get AutoCourierAutoBurst(): boolean {
		return this.properties.get("m_bAutoCourierAutoBurst") ?? false
	}
	public get AutoCourierAutoDeliver(): boolean {
		return this.properties.get("m_bAutoCourierAutoDeliver") ?? false
	}
	public get DeliverWhileVisibleOnly(): boolean {
		return this.properties.get("m_bDeliverWhileVisibleOnly") ?? false
	}
	public get TotalEarnedGold(): number {
		return this.properties.get("m_iTotalEarnedGold") ?? 0
	}
	public get ReliableGold(): number {
		return this.properties.get("m_iReliableGold") ?? 0
	}
	public get UnreliableGold(): number {
		return this.properties.get("m_iUnreliableGold") ?? 0
	}
	public get StartingPosition(): number {
		return this.properties.get("m_iStartingPosition") ?? 0
	}
	public get TotalEarnedXP(): number {
		return this.properties.get("m_iTotalEarnedXP") ?? 0
	}
	public get SharedGold(): number {
		return this.properties.get("m_iSharedGold") ?? 0
	}
	public get HeroKillGold(): number {
		return this.properties.get("m_iHeroKillGold") ?? 0
	}
	public get CreepKillGold(): number {
		return this.properties.get("m_iCreepKillGold") ?? 0
	}
	public get BuildingGold(): number {
		return this.properties.get("m_iBuildingGold") ?? 0
	}
	public get OtherGold(): number {
		return this.properties.get("m_iOtherGold") ?? 0
	}
	public get ComebackGold(): number {
		return this.properties.get("m_iComebackGold") ?? 0
	}
	// m_iExperimentalGold, m_iExperimental2Gold?
	public get CreepDenyGold(): number {
		return this.properties.get("m_iCreepDenyGold") ?? 0
	}
	public get TPScrollsPurchased(): number {
		return this.properties.get("m_iTPScrollsPurchased") ?? 0
	}
	public get IncomeGold(): number {
		return this.properties.get("m_iIncomeGold") ?? 0
	}
	public get NetWorth(): number {
		return this.properties.get("m_iNetWorth") ?? 0
	}
	public get DenyCount(): number {
		return this.properties.get("m_iDenyCount") ?? 0
	}
	public get LastHitCount(): number {
		return this.properties.get("m_iLastHitCount") ?? 0
	}
	public get LastHitStreak(): number {
		return this.properties.get("m_iLastHitStreak") ?? 0
	}
	public get LastHitMultikill(): number {
		return this.properties.get("m_iLastHitMultikill") ?? 0
	}
	public get NearbyCreepDeathCount(): number {
		return this.properties.get("m_iNearbyCreepDeathCount") ?? 0
	}
	public get ClaimedDenyCount(): number {
		return this.properties.get("m_iClaimedDenyCount") ?? 0
	}
	public get ClaimedMissCount(): number {
		return this.properties.get("m_iClaimedMissCount") ?? 0
	}
	public get MissCount(): number {
		return this.properties.get("m_iMissCount") ?? 0
	}
	public get PossibleHeroSelection(): number {
		return this.properties.get("m_nPossibleHeroSelection", EPropertyType.INT32) ?? 0
	}
	public get BuybackCooldownTime(): number {
		return this.properties.get("m_flBuybackCooldownTime") ?? 0
	}
	public get BuybackGoldLimitTime(): number {
		return this.properties.get("m_flBuybackGoldLimitTime") ?? 0
	}
	public get BuybackCostTime(): number {
		return this.properties.get("m_flBuybackCostTime") ?? 0
	}
	public get CustomBuybackCooldown(): number {
		return this.properties.get("m_flCustomBuybackCooldown") ?? 0
	}
	public get Stuns(): number {
		return this.properties.get("m_fStuns") ?? 0
	}
	public get Healing(): number {
		return this.properties.get("m_fHealing") ?? 0
	}
	public get TowerKills(): number {
		return this.properties.get("m_iTowerKills") ?? 0
	}
	public get RoshanKills(): number {
		return this.properties.get("m_iRoshanKills") ?? 0
	}
	// m_hCameraTarget, m_hOverrideSelectionEntity?
	public get ObserverWardsPlaced(): number {
		return this.properties.get("m_iObserverWardsPlaced") ?? 0
	}
	public get SentryWardsPlaced(): number {
		return this.properties.get("m_iSentryWardsPlaced") ?? 0
	}
	public get CreepsStacked(): number {
		return this.properties.get("m_iCreepsStacked") ?? 0
	}
	public get CampsStacked(): number {
		return this.properties.get("m_iCampsStacked") ?? 0
	}
	public get RunePickups(): number {
		return this.properties.get("m_iRunePickups") ?? 0
	}
	public get GoldSpentOnSupport(): number {
		return this.properties.get("m_iGoldSpentOnSupport") ?? 0
	}
	public get HeroDamage(): number {
		return this.properties.get("m_iHeroDamage") ?? 0
	}
	public get WardsPurchased(): number {
		return this.properties.get("m_iWardsPurchased") ?? 0
	}
	public get WardsDestroyed(): number {
		return this.properties.get("m_iWardsDestroyed") ?? 0
	}
	public get Items(): number[] {
		return this.properties.get("m_hItems") ?? []
	}
	public get Parity(): number {
		return this.properties.get("m_iParity") ?? 0
	}
	public get InventoryParent(): number {
		return this.properties.get("m_hInventoryParent") ?? 0
	}
	public get StashEnabled(): boolean {
		return this.properties.get("m_bStashEnabled") ?? false
	}
	public get TransientCastItem(): number {
		return this.properties.get("m_hTransientCastItem") ?? 0
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
		return this.properties.get("m_iCommandsIssued") ?? 0
	}
	public get GoldSpentOnConsumables(): number {
		return this.properties.get("m_iGoldSpentOnConsumables") ?? 0
	}
	public get GoldSpentOnItems(): number {
		return this.properties.get("m_iGoldSpentOnItems") ?? 0
	}
	public get GoldSpentOnBuybacks(): number {
		return this.properties.get("m_iGoldSpentOnBuybacks") ?? 0
	}
	public get GoldLostToDeath(): number {
		return this.properties.get("m_iGoldLostToDeath") ?? 0
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
		return this.properties.get("m_iSmokesUsed") ?? 0
	}
	public get NeutralTokensFound(): number {
		return this.properties.get("m_iNeutralTokensFound") ?? 0
	}
	public get WatchersTaken(): number {
		return this.properties.get("m_iWatchersTaken") ?? 0
	}
	public get LotusesTaken(): number {
		return this.properties.get("m_iLotusesTaken") ?? 0
	}
	public get TormentorKills(): number {
		return this.properties.get("m_iTormentorKills") ?? 0
	}
	public get CourierKills(): number {
		return this.properties.get("m_iCourierKills") ?? 0
	}
	public get PossibleHeroFacetSelection(): bigint {
		return this.properties.get("m_nPossibleHeroFacetSelection") ?? 0n
	}
}
