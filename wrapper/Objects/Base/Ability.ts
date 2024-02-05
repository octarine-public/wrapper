import { Vector3 } from "../../Base/Vector3"
import { GetSpellTexture } from "../../Data/ImageData"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { ABILITY_TYPES } from "../../Enums/ABILITY_TYPES"
import { AbilityLogicType } from "../../Enums/AbilityLogicType"
import { DAMAGE_TYPES } from "../../Enums/DAMAGE_TYPES"
import { DOTA_ABILITY_BEHAVIOR } from "../../Enums/DOTA_ABILITY_BEHAVIOR"
import { DOTA_UNIT_TARGET_FLAGS } from "../../Enums/DOTA_UNIT_TARGET_FLAGS"
import { DOTA_UNIT_TARGET_TEAM } from "../../Enums/DOTA_UNIT_TARGET_TEAM"
import { DOTA_UNIT_TARGET_TYPE } from "../../Enums/DOTA_UNIT_TARGET_TYPE"
import { EAbilitySlot } from "../../Enums/EAbilitySlot"
import { SPELL_IMMUNITY_TYPES } from "../../Enums/SPELL_IMMUNITY_TYPES"
import { EventsSDK } from "../../Managers/EventsSDK"
import { ExecuteOrder } from "../../Native/ExecuteOrder"
import { RegisterFieldHandler } from "../../Objects/NativeToSDK"
import { GameState } from "../../Utils/GameState"
import { toPercentage } from "../../Utils/Math"
import { AbilityData } from "../DataBook/AbilityData"
import { Entity } from "./Entity"
import { Unit } from "./Unit"

@WrapperClass("CDOTABaseAbility")
export class Ability extends Entity {
	public readonly AbilityData: AbilityData
	/**
	 * @readonly
	 * @description The level of the ability
	 */
	public Level = 0
	/**
	 * @readonly
	 * @description Whether the ability is empty
	 */
	public IsEmpty = false
	/**
	 * @readonly
	 * @description The slot the ability is in
	 * @returns {EAbilitySlot}
	 */
	public AbilitySlot = EAbilitySlot.DOTA_SPELL_SLOT_1

	@NetworkedBasicField("m_bInIndefiniteCooldown")
	public IsInIndefiniteCooldown = false
	@NetworkedBasicField("m_nMaxLevelOverride")
	public MaxLevelOverride = -1
	@NetworkedBasicField("m_bActivated")
	public IsActivated = false
	@NetworkedBasicField("m_bAltCastState")
	public AltCastState = false
	@NetworkedBasicField("m_bAutoCastState")
	public IsAutoCastEnabled = false
	@NetworkedBasicField("m_bFrozenCooldown")
	public IsCooldownFrozen = false
	@NetworkedBasicField("m_bReplicated")
	public IsReplicated = false
	@NetworkedBasicField("m_bStolen")
	public IsStolen = false
	@NetworkedBasicField("m_iManaCost")
	public ManaCost = 0
	@NetworkedBasicField("m_flOverrideCastPoint")
	public OverrideCastPoint = 0
	@NetworkedBasicField("m_flCooldownLength")
	public CooldownLength_ = 0
	public IsInAbilityPhase_ = false
	public IsInAbilityPhaseChangeTime = 0
	@NetworkedBasicField("m_flCastStartTime")
	public CastStartTime = 0
	@NetworkedBasicField("m_flChannelStartTime")
	public ChannelStartTime = 0
	@NetworkedBasicField("m_bToggleState")
	public IsToggled = false
	public IsHidden = false
	@NetworkedBasicField("m_nAbilityCurrentCharges")
	public AbilityCurrentCharges = 0
	@NetworkedBasicField("m_iDirtyButtons")
	public DirtyButtons = 0
	public AbilityChargeRestoreTimeRemaining = 0

	/** @ignore */
	public Cooldown_ = 0
	public CooldownRestore_ = 0
	public CooldownChangeTime = 0
	public CooldownRestoreTime = 0

	/**@deprecated */
	public readonly ProjectilePath: Nullable<string>

	/** @ignore */
	constructor(index: number, serial: number, name: string) {
		super(index, serial)
		this.Name_ = name
		this.AbilityData = AbilityData.globalStorage.get(name) ?? AbilityData.empty
	}

	/**
	 * @description Determines if the Ability should be drawable
	 * @return {boolean}
	 */
	public get ShouldBeDrawable(): boolean {
		if (this.IsEmpty || this.MaxLevel === 0) {
			return false
		}
		if (this.Name.startsWith("seasonal_")) {
			return false
		}
		return !this.HasTargetFlags(
			DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE
		)
	}
	/**
	 * @description A boolean indicating whether the ability is an ultimate ability
	 * @return {boolean}
	 */
	public get IsUltimate(): boolean {
		return this.AbilityType === ABILITY_TYPES.ABILITY_TYPE_ULTIMATE
	}
	/**
	 * @description Returns true if the ability type is ABILITY_TYPES.ABILITY_TYPE_ATTRIBUTES.
	 * @return {boolean}
	 */
	public get IsAttributes(): boolean {
		return this.AbilityType === ABILITY_TYPES.ABILITY_TYPE_ATTRIBUTES
	}
	/**
	 * @description Determines if the ability can hit a spell immune enemy.
	 * @returns {boolean}
	 */
	public get CanHitSpellImmuneEnemy(): boolean {
		return (
			this.AbilityImmunityType === SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ALLIES_YES ||
			this.AbilityImmunityType === SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ENEMIES_YES
		)
	}
	/**
	 * @description Check if the ability can hit a spell immune ally.
	 * @returns {boolean}
	 */
	public get CanHitSpellImmuneAlly(): boolean {
		return (
			this.AbilityImmunityType === SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_NONE ||
			this.AbilityImmunityType === SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ALLIES_YES ||
			this.AbilityImmunityType === SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ENEMIES_YES
		)
	}
	/**
	 * Check if the ability is usable.
	 * @description Check if the ability is not hidden and is activated
	 * @returns {boolean}
	 */
	public get CanBeUsable(): boolean {
		return this.IsValid && !this.IsHidden && this.IsActivated
	}
	public get Owner(): Nullable<Unit> {
		return this.OwnerEntity as Nullable<Unit>
	}
	public get AbilityBehavior(): DOTA_ABILITY_BEHAVIOR[] {
		return this.AbilityBehaviorMask.toMask
	}
	public get AbilityBehaviorMask(): DOTA_ABILITY_BEHAVIOR {
		return this.AbilityData.AbilityBehavior
	}
	/**
	 * @returns AbilityLogicType bitmask
	 */
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.None
	}
	public get AbilityDamage(): number {
		return this.GetBaseDamageForLevel(this.Level)
	}
	public get AbilityType(): ABILITY_TYPES {
		return this.AbilityData.AbilityType
	}
	public get EndRadius(): number {
		// TODO: fix me
		return this.GetSpecialValue("final_aoe")
	}
	public get CastPoint(): number {
		const overrideValue = this.OverrideCastPoint // default -1
		if (overrideValue > 0) {
			return overrideValue
		}
		return this.GetBaseCastPointForLevel(this.Level)
	}
	public get ActivationDelay() {
		return this.GetBaseActivationDelayForLevel(this.Level)
	}
	public get MaxChannelTime(): number {
		return this.GetBaseChannelTimeForLevel(this.Level)
	}
	public get ChannelTime(): number {
		return Math.max(GameState.RawGameTime - this.ChannelStartTime, 0)
	}
	public get MaxCharges(): number {
		return this.GetMaxChargesForLevel(this.Level)
	}
	public get MaxChargeRestoreTime(): number {
		return this.GetChargeRestoreTimeForLevel(this.Level)
	}
	public get DamageType(): DAMAGE_TYPES {
		return this.AbilityData.DamageType
	}
	public get ID(): number {
		return this.AbilityData.ID
	}
	public get IsChanneling(): boolean {
		return this.ChannelStartTime > 0 && this.ChannelTime <= this.MaxChannelTime
	}
	public get IsInAbilityPhase(): boolean {
		return (
			this.IsInAbilityPhase_ &&
			GameState.RawGameTime - this.IsInAbilityPhaseChangeTime <= this.CastPoint
		)
	}
	public get CooldownLength(): number {
		const chargeRestoreTime = this.MaxChargeRestoreTime
		if (chargeRestoreTime !== 0) {
			return chargeRestoreTime
		} // workaround of bad m_flCooldownLength, TODO: use cooldown reductions
		return this.CooldownLength_
	}
	public get IsCooldownReady(): boolean {
		return this.Cooldown === 0
	}
	public get IsReady(): boolean {
		if (!this.IsCooldownReady || this.Level === 0) {
			return false
		}
		const owner = this.Owner
		if (owner === undefined || owner.Mana < this.ManaCost) {
			return false
		}
		return true
	}
	public get IsGrantedByScepter(): boolean {
		return this.AbilityData.IsGrantedByScepter
	}
	public get IsItem(): boolean {
		return this.AbilityData.IsItem
	}
	public get LevelsBetweenUpgrades(): number {
		return this.AbilityData.LevelsBetweenUpgrades
	}
	public get MaxLevel(): number {
		return this.MaxLevelOverride !== -1
			? this.MaxLevelOverride
			: this.AbilityData.MaxLevel
	}
	public get RequiredLevel(): number {
		return this.AbilityData.RequiredLevel
	}
	public get SharedCooldownName(): string {
		return this.AbilityData.SharedCooldownName
	}
	public get AbilityImmunityType(): SPELL_IMMUNITY_TYPES {
		return this.AbilityData.AbilityImmunityType
	}
	public get TargetFlags(): DOTA_UNIT_TARGET_FLAGS[] {
		return this.AbilityData.TargetFlags.toMask
	}
	public get TargetTeam(): DOTA_UNIT_TARGET_TEAM[] {
		return this.AbilityData.TargetTeam.toMask
	}
	public get TargetType(): DOTA_UNIT_TARGET_TYPE[] {
		return this.AbilityData.TargetType.toMask
	}
	public get TexturePath(): string {
		return GetSpellTexture(this.Name)
	}
	public get IsPassive(): boolean {
		return this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE)
	}
	public get CooldownRestore(): number {
		return Math.max(
			this.CooldownRestore_ - (GameState.RawGameTime - this.CooldownRestoreTime),
			0
		)
	}
	public get Cooldown(): number {
		if (!this.CurrentCharges && this.CooldownRestore > 0) {
			return this.CooldownRestore
		}
		return Math.max(
			this.Cooldown_ - (GameState.RawGameTime - this.CooldownChangeTime),
			0
		)
	}
	/**
	 * The cooldown percentage.
	 * @description Returns the cooldown percentage based on the current cooldown and maximum cooldown.
	 * @return {number}
	 */
	public get CooldownPercent(): number {
		return !this.CurrentCharges && this.CooldownRestore > 0
			? toPercentage(this.CooldownRestore, this.MaxChargeRestoreTime)
			: toPercentage(this.Cooldown, this.MaxCooldown)
	}
	/**
	 * Calculates the cooldown percentage.
	 * @description The cooldown percentage as a decimal value.
	 * @return {number}
	 */
	public get CooldownPercentDecimal(): number {
		return this.CooldownPercent / 100
	}
	/**
	 * @description The remaining cooldown duration for the CooldownDuration property.
	 * @return {number}
	 */
	public get CooldownDuration(): number {
		return Math.max(
			this.MaxDuration - (GameState.RawGameTime - this.CastStartTime),
			0
		)
	}
	/**
	 * @description The cooldown duration as a percentage.
	 * @return {number}
	 */
	public get CooldownDurationPercent(): number {
		return toPercentage(this.CooldownDuration, this.MaxDuration)
	}
	/**
	 * @description The cooldown duration as a decimal value.
	 * @return {number}
	 */
	public get CooldownDurationPercentDecimal(): number {
		return this.CooldownDurationPercent / 100
	}
	/**
	 * @description example: Axe Culling blade, Legion commander Duel and others
	 * @return {number}
	 */
	public get StackCount(): number {
		return 0
	}
	public get Speed() {
		return this.GetBaseSpeedForLevel(this.Level)
	}
	public get HasAffectedByAOEIncrease() {
		return this.AbilityData.AffectedByAOEIncrease
	}
	public get MaxDuration(): number {
		return this.GetMaxDurationForLevel(this.Level)
	}
	public get MaxCooldown(): number {
		return this.GetMaxCooldownForLevel(this.Level)
	}
	public get BaseCastRange(): number {
		return this.GetBaseCastRangeForLevel(this.Level)
	}
	public get BonusCastRange(): number {
		return this.Owner?.BonusCastRange ?? 0
	}
	public get CastRangeAmplifier(): number {
		return this.Owner?.CastRangeAmplifier ?? 0
	}
	public get CastRange(): number {
		const amp = this.CastRangeAmplifier,
			bonus = this.GetCastRangeForLevel(this.Level)
		let calculateBonus = (bonus * amp) >> 0
		if (
			calculateBonus !== 0 &&
			this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET)
		) {
			calculateBonus += this.Owner?.HullRadius ?? 0
		}
		return calculateBonus
	}
	public get BonusAOERadius(): number {
		if (this.Owner === undefined || !this.HasAffectedByAOEIncrease) {
			return 0
		}
		return this.Owner.BonusAOERadius
	}
	public get AOERadius(): number {
		return this.GetBaseAOERadiusForLevel(this.Level) + this.BonusAOERadius
	}
	public get SkillshotRange(): number {
		return this.CastRange
	}
	// TODO Fix me
	public get SpellAmplification(): number {
		if (this.Name.startsWith("special_bonus_spell_amplify")) {
			return this.GetSpecialValue("value") / 100
		}
		return 0
	}
	public get IsCastRangeFake(): boolean {
		return false
	}
	public get UsesRotation() {
		return false
	}
	public get CurrentCharges() {
		return this.AbilityCurrentCharges
	}
	public set CurrentCharges(newVal: number) {
		this.AbilityCurrentCharges = newVal
	}
	protected get CanBeCastedWhileRooted() {
		return this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES)
	}
	protected get CanBeCastedWhileStunned() {
		return false
	}
	protected get CanBeCastedWhileSilenced() {
		return false
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetMaxCooldownForLevel(level: number): number {
		return this.AbilityData.GetMaxCooldownForLevel(level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetChargeRestoreTimeForLevel(level: number): number {
		return this.AbilityData.GetChargeRestoreTime(level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetMaxChargesForLevel(level: number): number {
		return this.AbilityData.GetMaxCharges(level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetMaxDurationForLevel(level: number): number {
		return this.AbilityData.GetMaxDurationForLevel(level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseCastPointForLevel(level: number): number {
		return this.AbilityData.GetCastPoint(level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseDamageForLevel(level: number): number {
		return this.AbilityData.GetAbilityDamage(level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseManaCostForLevel(level: number): number {
		return this.AbilityData.GetManaCost(level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetCastRangeForLevel(level: number): number {
		return this.GetBaseCastRangeForLevel(level) + this.BonusCastRange
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseCastRangeForLevel(level: number): number {
		return this.AbilityData.GetCastRange(level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseActivationDelayForLevel(_level: number): number {
		return 0 // child classes should override
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseSpeedForLevel(_level: number): number {
		return 0 // child classes should override
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseAOERadiusForLevel(_level: number): number {
		return 0 // child classes should override
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseChannelTimeForLevel(level: number): number {
		return this.AbilityData.GetChannelTime(level)
	}
	/**
	 * TODO Fix me
	 * @param position Vector3
	 * @param turnRate boolean
	 * @returns Time in ms until the cast.
	 */
	public GetCastDelay(position: Vector3, turnRate: boolean = true): number {
		return this?.Owner
			? (this.CastPoint + (turnRate ? this.Owner.TurnTime(position) : 0)) * 1000 +
					GameState.Ping / 2
			: 0
	}
	/**
	 * TODO Fix me
	 * @param position Vector3
	 * @returns Time in ms until the cast.
	 */
	public GetHitTime(position: Vector3): number {
		if (this.Owner === undefined) {
			return 0
		}

		if (this.Speed === Number.MAX_SAFE_INTEGER || this.Speed === 0) {
			return this.GetCastDelay(position) + this.ActivationDelay * 1000
		}

		const time = this.Owner.Distance2D(position) / this.Speed
		return this.GetCastDelay(position) + (time + this.ActivationDelay) * 1000
	}

	public UseAbility(
		target?: Vector3 | Entity,
		checkAutoCast: boolean = false,
		checkToggled: boolean = false,
		queue?: boolean,
		showEffects?: boolean
	) {
		return this.Owner?.UseSmartAbility(
			this,
			target,
			checkAutoCast,
			checkToggled,
			queue,
			showEffects
		)
	}

	public UpgradeAbility() {
		return this.Owner?.TrainAbility(this)
	}

	public PingAbility() {
		return this.Owner?.PingAbility(this)
	}
	/**
	 * @description Retrieves a special value based on the provided special name and level.
	 * @param {string} specialName - The name of the special value to retrieve.
	 * @param {number} level - The level at which to retrieve the special value. Defaults to the level of the current Ability.
	 * @return {number}
	 */
	public GetSpecialValue(specialName: string, level: number = this.Level): number {
		const owner = this.Owner
		const abilName = this.Name
		const abilityData = this.AbilityData
		return owner === undefined
			? abilityData.GetSpecialValue(specialName, level, abilName)
			: abilityData.GetSpecialValueWithTalent(owner, specialName, level, abilName)
	}
	public IsManaEnough(bonusMana: number = 0): boolean {
		const owner = this.Owner
		if (owner === undefined) {
			return true
		}
		return owner.Mana + bonusMana >= this.ManaCost
	}
	public HasBehavior(flag: DOTA_ABILITY_BEHAVIOR): boolean {
		return this.AbilityData.HasBehavior(flag)
	}
	public HasTargetFlags(flag: DOTA_UNIT_TARGET_FLAGS): boolean {
		return this.AbilityData.TargetFlags.hasMask(flag)
	}
	public HasTargetTeam(flag: DOTA_UNIT_TARGET_TEAM): boolean {
		return this.AbilityData.TargetTeam.hasMask(flag)
	}
	public HasTargetType(flag: DOTA_UNIT_TARGET_TYPE): boolean {
		return this.AbilityData.TargetType.hasMask(flag)
	}
	public CanHit(target: Unit): boolean {
		if (this.Owner === undefined) {
			return false
		}

		let range = 0
		if (
			!this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) &&
			!this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT)
		) {
			range = this.CastRange
			if (range === 0) {
				range = this.AOERadius
			}
		} else {
			range += this.SkillshotRange + this.Owner.HullRadius
		}
		if (range > 0) {
			range += target.HullRadius
		}
		return this.Owner.Distance2D(target) < range
	}
	public CanBeCasted(bonusMana: number = 0): boolean {
		if (!this.CanBeUsable || !this.IsReady) {
			return false
		}
		// TODO: Add other checks
		return this.IsManaEnough(bonusMana)
	}
	public IsDoubleTap(_order: ExecuteOrder): boolean {
		return false
	}
}

RegisterFieldHandler(Ability, "m_bHidden", (abil, newValue) => {
	abil.IsHidden = newValue as boolean
	EventsSDK.emit("AbilityHiddenChanged", false, abil)
})

RegisterFieldHandler(Ability, "m_iLevel", (abil, newValue) => {
	abil.Level = newValue as number
	EventsSDK.emit("AbilityLevelChanged", false, abil)
})

RegisterFieldHandler(
	Ability,
	"m_fAbilityChargeRestoreTimeRemaining",
	(abil, newValue) => {
		abil.CooldownRestore_ = newValue as number
		abil.CooldownRestoreTime = GameState.RawGameTime
		EventsSDK.emit("AbilityCooldownChanged", false, abil)
	}
)
RegisterFieldHandler(Ability, "m_bInAbilityPhase", (abil, newValue) => {
	abil.IsInAbilityPhase_ = newValue as boolean
	abil.IsInAbilityPhaseChangeTime = GameState.RawGameTime
	EventsSDK.emit("IsInAbilityPhase", false, abil)
})
RegisterFieldHandler(Ability, "m_fCooldown", (abil, newValue) => {
	abil.Cooldown_ = newValue as number
	abil.CooldownChangeTime = GameState.RawGameTime
	EventsSDK.emit("AbilityCooldownChanged", false, abil)
})
