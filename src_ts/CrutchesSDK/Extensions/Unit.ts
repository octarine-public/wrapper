//import * as Enums from "./Enums";
import Entity from "./Entity";

export default class Unit extends Entity {
	
	ent: C_DOTA_BaseNPC
	
	constructor(ent: C_BaseEntity) {
		super(ent);
	}
	
	get Armor(): number {
		return this.ent.m_flPhysicalArmorValue;
	}
	get ArmorType(): ArmorType {
		return this.ent.m_iCombatClassDefend;
	}
	get AttackCapability(): DOTAUnitAttackCapability_t {
		return this.ent.m_iAttackCapabilities;
	}
	get AttackDamageType(): AttackDamageType {
		return this.ent.m_iCombatClassAttack;
	}
	get AttackRange(): number {
		return this.ent.m_fAttackRange;
	}
	get IncreasedAttackSpeed(): number {
		return this.ent.m_fIncreasedAttackSpeed;
	}
	get SecondsPerAttack(): number {
		return this.ent.m_fAttacksPerSecond;
	}
	get AttacksPerSecond(): number {
		return 1 / this.ent.m_fAttacksPerSecond
	}
	get AvailableShops(): DOTA_SHOP_TYPE /*Enums.ShopFlags*/ {
		return this.ent.m_iNearShopMask;
	}
	// BaseArmor
	get BaseAttackTime(): number {
		return this.ent.m_flBaseAttackTime;
	}
	// BaseHealthRegeneration
	// BaseManaRegeneration
	get BaseMoveSpeed(): number {
		return this.ent.m_iMoveSpeed;
	}
	get BKBChargesUsed(): number {
		return this.ent.m_iBKBChargesUsed;
	}
	get DamageBonus(): number {
		return this.ent.m_iDamageBonus;
	}
	get CollisionPadding(): number {
		return this.ent.m_flCollisionPadding;
	}
	get DayVision(): number {
		return this.ent.m_iDayTimeVisionRange;
	}
	get DeathTime(): number {
		return this.ent.m_flDeathTime;
	}
	get DebuffState(): bigint {
		return this.ent.m_nUnitDebuffState;
	}
	// check
	get HasArcana(): boolean {
		return this.ent.m_nArcanaLevel > 0;
	}
	get BaseStatsChanged(): boolean {
		return this.ent.m_bBaseStatsChanged;
	}
	get HasInventory(): boolean {
		return this.ent.m_bHasInventory;
	}
	get HasSharedAbilities(): boolean {
		return this.ent.m_bHasSharedAbilities;
	}
	// HasStolenScepter
	get HasUpgradeableAbilities(): boolean {
		return this.ent.m_bHasUpgradeableAbilities;
	}
	get HealthBarOffset(): number {
		return this.ent.m_iHealthBarOffset;
	}
	get HealthBarHighlightColor(): Color {
		return this.ent.m_iHealthBarHighlightColor;
	}
	// get HPRegen(): number {
	// 	return this.ent.m_flHealthThinkRegen;
	// }
	get HullRadius(): number {
		return this.ent.m_flHullRadius;
	}
	// _Inventory: C_DOTA_UnitInventory
	get Inventory(): C_DOTA_UnitInventory {
		
		if (!this.HasInventory)
			return;

		return this.ent.m_Inventory;
		
		// return this._Inventory === undefined && this.HasInventory
		// 	? this._Inventory = new UnitInventory(this.ent)
		// 	: this._Inventory;
	}
	get InvisibleLevel(): number {
		return this.ent.m_flInvisibilityLevel;
	}
	get IsAncient(): boolean {
		return this.ent.m_bIsAncient;
	}
	/**
	 * IsControllable by LocalPlayer
	 */
	get IsControllable(): boolean {
		return this.ent.IsControllableByPlayer(LocalDOTAPlayer.m_iPlayerID);
	}
	get IsDominatable(): boolean {
		return this.ent.m_bCanBeDominated;
	}
	get IsIllusion(): boolean {
		
		var ent = this.ent;
		
		if (ent.m_bIsIllusion)
			return true;
		
		// if (ent instanceof C_DOTA_Unit_Hero_Meepo)
		// 	(ent as C_DOTA_Unit_Hero_Meepo).
	}
	// get IsMeepoIllusion(): boolean {
	// 	return (this.ent as C_DOTA_Unit_Hero_Meepo).m_bIsClone;
	// }
	get IsMelee(): boolean {
		return this.AttackCapability === DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_MELEE_ATTACK;
	}
	get IsMoving(): boolean {
		return this.ent.m_bIsMoving;
	}
	get IsNeutral(): boolean {
		return this.ent.m_bIsNeutralUnitType;
	}
	get IsPhantom(): boolean {
		return this.ent.m_bIsPhantom;
	}
	get IsRanged(): boolean {
		return this.AttackCapability === DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK;
	}
	get IsSpawned(): boolean {
		return !this.IsWaitingToSpawn;
	}
	get IsSummoned(): boolean {
		return this.ent.m_bIsSummoned;
	}
	get IsVisibleForEnemies(): boolean {
		//return this.IsVisibleForEnemiesNumber & (1 << 14)) != 0;
		return this.ent.m_bIsVisibleForEnemies;
	}
	get IsVisibleForTeam(): DOTATeam_t {
		return this.ent.m_iTaggedAsVisibleByTeam;
	}
	get IsTrueSightedForEnemies(): boolean {
		return this.ent.m_bIsTrueSightedForEnemies;
	}
	get IsWaitingToSpawn(): boolean {
		return this.ent.m_bIsWaitingToSpawn;
	}
	get Level(): number {
		return this.ent.m_iCurrentLevel
	}
	get Mana(): number {
		return this.ent.m_flMana;
	}
	// ManaRegen(): number {
	// 	//return this.ent.manare
	// }
	get MaxDamage(): number {
		return this.ent.m_iDamageMax;
	}
	get MaxMana(): number {
		return this.ent.m_flMaxMana;	
	}
	get MinimapIcon(): string {
		return this.ent.m_iszMinimapIcon;
	}
	get MinimapIconSize(): number {
		return this.ent.m_flMinimapIconSize;
	}
	get MinDamage(): number {
		return this.ent.m_iDamageMin;
	}
	get Modifiers(): CDOTA_ModifierManager {
		return this.ent.m_ModifierManager;
	}
	get MoveCapability(): DOTAUnitMoveCapability_t {
		return this.ent.m_iMoveCapabilities;
	}
	get IdealSpeed(): number {
		return this.ent.m_fIdealSpeed;
	}
}

//(LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC).m_iTaggedAsVisibleByTeam;