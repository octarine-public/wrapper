import { Vector3 } from "../../Base/Vector3"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { ABILITY_TYPES } from "../../Enums/ABILITY_TYPES"
import { AbilityLogicType } from "../../Enums/AbilityLogicType"
import { DAMAGE_TYPES } from "../../Enums/DAMAGE_TYPES"
import { DOTA_ABILITY_BEHAVIOR } from "../../Enums/DOTA_ABILITY_BEHAVIOR"
import { DOTA_UNIT_TARGET_FLAGS } from "../../Enums/DOTA_UNIT_TARGET_FLAGS"
import { DOTA_UNIT_TARGET_TEAM } from "../../Enums/DOTA_UNIT_TARGET_TEAM"
import { DOTA_UNIT_TARGET_TYPE } from "../../Enums/DOTA_UNIT_TARGET_TYPE"
import { SPELL_IMMUNITY_TYPES } from "../../Enums/SPELL_IMMUNITY_TYPES"
import { ExecuteOrder } from "../../Native/ExecuteOrder"
import { RegisterFieldHandler } from "../../Objects/NativeToSDK"
import { HasMask, MaskToArrayNumber } from "../../Utils/BitsExtensions"
import { GameState } from "../../Utils/GameState"
import { AbilityData } from "../DataBook/AbilityData"
import { Entity } from "./Entity"
import { Unit } from "./Unit"

@WrapperClass("CDOTABaseAbility")
export class Ability extends Entity {
	public readonly AbilityData: AbilityData
	@NetworkedBasicField("m_bInIndefiniteCooldown")
	public IsInIndefiniteCooldown = false
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
	@NetworkedBasicField("m_iLevel")
	public Level = 0
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
	@NetworkedBasicField("m_bHidden")
	public IsHidden = false
	@NetworkedBasicField("m_nAbilityCurrentCharges")
	public AbilityCurrentCharges = 0
	@NetworkedBasicField("m_iDirtyButtons")
	public DirtyButtons = 0
	@NetworkedBasicField("m_fAbilityChargeRestoreTimeRemaining")
	public AbilityChargeRestoreTimeRemaining = 0

	/** @ignore */
	public Cooldown_ = 0
	public CooldownChangeTime = 0

	/**@deprecated */
	public readonly ProjectilePath: Nullable<string>

	/** @ignore */
	constructor(index: number, serial: number, name: string) {
		super(index, serial)
		this.Name_ = name
		this.AbilityData = AbilityData.globalStorage.get(name) ?? AbilityData.empty
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
	public get IsUsable(): boolean {
		return !this.IsHidden && this.IsActivated
	}
	public get Owner(): Nullable<Unit> {
		return this.OwnerEntity as Nullable<Unit>
	}
	public get AbilityBehavior(): DOTA_ABILITY_BEHAVIOR[] {
		return MaskToArrayNumber(this.AbilityData.AbilityBehavior)
	}
	/**
	 * @returns AbilityLogicType bitmask
	 */
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.None
	}
	public get AbilityDamage(): number {
		return (
			this.AbilityData.GetAbilityDamage(this.Level) ||
			this.GetSpecialValue("damage")
		)
	}
	public get AbilityType(): ABILITY_TYPES {
		return this.AbilityData.AbilityType
	}
	public get EndRadius(): number {
		return this.GetSpecialValue("final_aoe")
	}
	public get ActivationDelay() {
		return this.GetSpecialValue("delay")
	}
	public get CastPoint(): number {
		return this.AbilityData.GetCastPoint(this.Level)
	}
	public get MaxChannelTime(): number {
		return this.AbilityData.GetChannelTime(this.Level)
	}
	public get ChannelTime(): number {
		return Math.max(GameState.RawGameTime - this.ChannelStartTime, 0)
	}
	public get MaxCharges(): number {
		return (
			this.AbilityData.GetMaxCharges(this.Level) +
			this.GetSpecialValue("AbilityCharges")
		)
	}
	public get ChargeRestoreTime(): number {
		return (
			this.AbilityData.GetChargeRestoreTime(this.Level) +
			this.GetSpecialValue("AbilityChargeRestoreTime")
		)
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
		const chargeRestoreTime = this.ChargeRestoreTime
		if (chargeRestoreTime !== 0) {
			return chargeRestoreTime
		} // workaround of bad m_flCooldownLength, TODO: use cooldown reductions
		return this.CooldownLength_
	}
	public get IsCooldownReady(): boolean {
		return this.Cooldown === 0
	}
	public get IsReady(): boolean {
		const unit = this.Owner
		return (
			this.IsCooldownReady &&
			this.Level !== 0 &&
			(unit === undefined || (unit.Mana >= this.ManaCost && !unit.IsSilenced))
		)
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
		return this.AbilityData.MaxLevel
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
		return MaskToArrayNumber(this.AbilityData.TargetFlags)
	}
	public get TargetTeam(): DOTA_UNIT_TARGET_TEAM[] {
		return MaskToArrayNumber(this.AbilityData.TargetTeam)
	}
	public get TargetType(): DOTA_UNIT_TARGET_TYPE[] {
		return MaskToArrayNumber(this.AbilityData.TargetType)
	}
	public get TexturePath(): string {
		return this.AbilityData.TexturePath
	}

	public get IsPassive(): boolean {
		return this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE)
	}

	/**
	 * In real time cooldown (in fog)
	 */
	public get Cooldown(): number {
		return Math.max(
			this.Cooldown_ - (GameState.RawGameTime - this.CooldownChangeTime),
			0
		)
	}
	public get MaxDuration(): number {
		return this.AbilityData.GetMaxDurationForLevel(this.Level)
	}
	public get MaxCooldown(): number {
		return this.AbilityData.GetMaxCooldownForLevel(this.Level)
	}
	public get BaseCastRange(): number {
		return this.GetBaseCastRangeForLevel(this.Level)
	}
	public get CastRange(): number {
		return this.GetCastRangeForLevel(this.Level)
	}
	public get AOERadius(): number {
		return this.GetAOERadiusForLevel(this.Level)
	}
	public get SkillshotRange(): number {
		return this.CastRange
	}
	public get SpellAmplification(): number {
		if (this.Name.startsWith("special_bonus_spell_amplify")) {
			return this.GetSpecialValue("value") / 100
		}
		return 0
	}
	public get BonusCastRange(): number {
		if (this.Name.startsWith("special_bonus_cast_range")) {
			return this.GetSpecialValue("value")
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
	public GetBaseCastRangeForLevel(level: number): number {
		return this.AbilityData.GetCastRange(level)
	}
	public GetBaseManaCostForLevel(level: number) {
		if (level === 0) {
			return 0
		}
		return this.AbilityData.GetManaCost(level)
	}
	public GetCastRangeForLevel(level: number): number {
		if (level === 0) {
			return 0
		}
		return this.GetBaseCastRangeForLevel(level) + (this.Owner?.CastRangeBonus ?? 0)
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	/**
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

	public GetSpecialValue(specialName: string, level = this.Level): number {
		const owner = this.Owner
		if (owner === undefined) {
			return this.AbilityData.GetSpecialValue(specialName, level)
		}
		return this.AbilityData.GetSpecialValueWithTalent(owner, specialName, level)
	}
	public IsManaEnough(bonusMana: number = 0): boolean {
		const owner = this.Owner
		if (owner === undefined) {
			return true
		}
		return owner.Mana + bonusMana >= this.ManaCost
	}
	public HasBehavior(flag: DOTA_ABILITY_BEHAVIOR): boolean {
		return HasMask(this.AbilityData.AbilityBehavior, flag)
	}
	public HasTargetFlags(flag: DOTA_UNIT_TARGET_FLAGS): boolean {
		return HasMask(this.AbilityData.TargetFlags, flag)
	}
	public HasTargetTeam(flag: DOTA_UNIT_TARGET_TEAM): boolean {
		return HasMask(this.AbilityData.TargetTeam, flag)
	}
	public HasTargetType(flag: DOTA_UNIT_TARGET_TYPE): boolean {
		return HasMask(this.AbilityData.TargetType, flag)
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
		return (
			this.IsValid &&
			this.Level !== 0 &&
			this.IsCooldownReady &&
			!this.Owner?.IsSilenced &&
			this.IsManaEnough(bonusMana)
		)
	}
	public IsDoubleTap(_order: ExecuteOrder): boolean {
		return false
	}
}

RegisterFieldHandler(
	Ability,
	"m_fAbilityChargeRestoreTimeRemaining",
	(abil, newValue) => {
		abil.Cooldown_ = abil.CurrentCharges !== 0 ? 0 : Math.max(newValue as number, 0)
		abil.CooldownChangeTime = GameState.RawGameTime
	}
)
RegisterFieldHandler(Ability, "m_bInAbilityPhase", (abil, newValue) => {
	abil.IsInAbilityPhase_ = newValue as boolean
	abil.IsInAbilityPhaseChangeTime = GameState.RawGameTime
})
RegisterFieldHandler(Ability, "m_fCooldown", (abil, newValue) => {
	abil.Cooldown_ = newValue as number
	abil.CooldownChangeTime = GameState.RawGameTime
})
