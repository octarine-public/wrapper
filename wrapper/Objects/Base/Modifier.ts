import { Vector4 } from "../../Base/Vector4"
import { GetItemTexture, GetSpellTexture } from "../../Data/ImageData"
import { DAMAGE_AMPLIFY } from "../../Enums/DAMAGE_AMPLIFY"
import { DAMAGE_TYPES } from "../../Enums/DAMAGE_TYPES"
import { DOTA_ABILITY_BEHAVIOR } from "../../Enums/DOTA_ABILITY_BEHAVIOR"
import { DOTA_UNIT_TARGET_FLAGS } from "../../Enums/DOTA_UNIT_TARGET_FLAGS"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import { IModifier } from "../../Managers/ModifierManager"
import { StringTables } from "../../Managers/StringTables"
import { GameState } from "../../Utils/GameState"
import { AbilityData } from "../DataBook/AbilityData"
import { Ability } from "./Ability"
import { Unit } from "./Unit"

// AllowIllusionDuplicate
// CanParentBeAutoAttacked
// IsDebuff
// IsHidden
// IsPurgeException
// IsStunDebuff
// IsValid
// TextureName

const scepterRegExp = /^modifier_(item_ultimate_scepter|wisp_tether_scepter)/

export class Modifier {
	public static readonly DebuffHeal: string[] = [
		"modifier_ice_blast",
		"modifier_doom_bringer_doom"
	]
	public static readonly AttackThroughImmunity: string[] = [
		"modifier_item_revenants_brooch_active",
		"modifier_muerta_pierce_the_veil_buff"
	]
	// TODO: rework this after add ModifierManager
	public static HasTrueSightBuff(buffs: Modifier[]): boolean {
		return buffs.some(buff => {
			switch (buff.Name) {
				case "modifier_truesight":
				case "modifier_item_dustofappearance":
				case "modifier_bloodseeker_thirst_vision":
				case "modifier_bounty_hunter_track":
					return true
				default:
					return false
			}
		})
	}

	// TODO: rework this after add ModifierManager
	public static HasScepterBuff(buffs: Modifier[]): boolean {
		return buffs.some(buff => scepterRegExp.test(buff.Name))
	}

	// TODO: rework this after add ModifierManager
	public static HasShardBuff(buffs: Modifier[]): boolean {
		return buffs.some(buff => buff.Name === "modifier_item_aghanims_shard")
	}

	public static CanBeHealed(unit: Unit): boolean
	public static CanBeHealed(buffs: Modifier[]): boolean
	public static CanBeHealed(option: Unit | Modifier[]): boolean {
		return Array.isArray(option)
			? option.every(buff => !this.DebuffHeal.includes(buff.Name))
			: option.Buffs.every(buff => !this.DebuffHeal.includes(buff.Name))
	}

	public IsValid = true
	public IsHidden = false
	public IsBuff = false
	public IsShield = false
	public IsGhost = false
	public IsDebuff = false
	public IsStunDebuff = false
	public IsHiddenWhenStolen = false
	public IsDeniable = false
	public IsVisibleForEnemies = false

	// Cast point
	public BonusCastPointAmplifier = 0
	public BonusCastPointAmplifierStack = false

	// Damage
	public DamageType = DAMAGE_TYPES.DAMAGE_TYPE_NONE
	public AmplifyDamage = DAMAGE_AMPLIFY.DAMAGE_AMPLIFY_NONE
	// Damage reduction
	public DamageReduction = 0
	// Damage amplification
	public DamageAmplifier = 0
	// Damage absorption
	public AbsorbDamage = 0
	public AbsorbDamageAfterReduction = false
	public AbsorbDamageType = DAMAGE_TYPES.DAMAGE_TYPE_NONE

	// Attack speed
	public IsAttackSpeedLimit = true
	public FixedBaseAttackTime = 0
	public BonusBaseAttackTime = 0
	public BonusBaseAttackTimeStack = false
	public FixedAttackAnimationPoint = 0
	public BonusAttackSpeed = 0
	public BaseBonusAttackSpeed = 0
	public BaseBonusAttackSpeedStack = false
	public BaseAttackSpeedAmplifier = 0
	public BaseAttackSpeedAmplifierStack = false
	public BonusAttackSpeedStack = false
	public AttackSpeedAmplifier = 0
	public AttackSpeedAmplifierStack = false

	// Bonus attack range
	public FixedAttackRange = 0
	public BonusAttackRange = 0
	public AttackRangeAmplifier = 0
	public BonusAttackRangeStack = false
	public AttackRangeAmplifierStack = false
	public IsInfinityAttackRange = false

	// Bonus cast range
	public BonusCastRange = 0
	public CastRangeAmplifier = 0
	public BonusCastRangeStack = false
	public CastRangeAmplifierStack = false

	// Bonus radius
	public BonusAOERadius = 0
	public BonusAOERadiusAmplifier = 0

	// Base move speed
	public MoveSpeedBase = 0
	public MoveSpeedBaseStack = false
	public MoveSpeedFixed = 0
	public MoveSpeedBaseAmplifier = 0
	public MoveSpeedBaseAmplifierStack = false

	// Bonus move speed
	public IsBoots = false
	public IsMoveSpeedLimit = true
	public BonusMoveSpeed = 0
	public BonusMoveSpeedStack = false
	public BonusMoveSpeedAmplifier = 0
	public BonusMoveSpeedAmplifierStack = false
	public StatusResistanceSpeed = 0
	public StatusResistanceSpeedStack = false

	// Bonus armor
	public BaseFixedArmor = 0
	public BaseBonusArmor = 0
	public BaseBonusArmorStack = false
	public BaseBonusArmorAmplifier = 0
	public BaseBonusArmorAmplifierStack = false

	public BonusArmor = 0
	public BonusArmorStack = false
	public BonusArmorAmplifier = 0
	public BonusArmorAmplifierStack = false

	// bonus vision
	public BonusDayVision = 0
	public BonusDayVisionStack = false
	public BonusDayVisionAmplifier = 0
	public BonusDayVisionAmplifierStack = false
	public BonusNightVision = 0
	public BonusNightVisionStack = false

	// Turn rate
	public FixedTurnRate = 0
	public FixedBaseTurnRate = 0
	public BonusTurnRate = 0
	public BonusTurnRateStack = false
	public BonusTurnRateAmplifier = 0
	public BonusTurnRateAmplifierStack = false

	// Bonus / Reduction mana cost
	public BonusManaCostAmplifier = 0
	public BonusManaCostAmplifierStack = false

	// move speed resistance
	/** @readonly */
	// TODO?

	// Status resistance
	public StatusResistanceAmplifier = 0
	public StatusResistanceAmplifierStack = false

	public ShouldDoFlyHeightVisual = false

	public readonly Index: number
	public readonly SerialNumber: number
	public readonly IsAura: boolean
	public readonly Name: string

	// only KV
	/** @deprecated */
	public Armor = 0
	/** @deprecated */
	public AttackSpeed = 0
	/** @deprecated */
	public MovementSpeed = 0
	/** @deprecated */
	public BonusAllStats = 0
	/** @deprecated */
	public BonusHealth = 0
	/** @deprecated */
	public BonusMana = 0

	public NetworkArmor = 0
	public NetworkDamage = 0
	public NetworkFadeTime = 0
	public NetworkBonusMana = 0
	public NetworkBonusHealth = 0
	public NetworkAttackSpeed = 0
	public NetworkChannelTime = 0
	public NetworkMovementSpeed = 0
	public NetworkBonusAllStats = 0

	public CreationTime = 0
	public CustomEntity: Nullable<Unit>
	public StackCount = 0
	public Duration = 0
	public AbilityLevel = 0
	public DDAbilityName: string
	public Parent: Nullable<Unit>
	public Ability: Nullable<Ability>
	public Caster: Nullable<Unit>
	public AuraOwner: Nullable<Unit>

	/** @description parent is range attacker */
	protected IsRanged = false

	/** @description need maybe only for spent abilities */
	public ConsumedAbilityName: Nullable<string> = undefined

	constructor(public kv: IModifier) {
		this.Index = this.kv.Index ?? -1
		this.SerialNumber = this.kv.SerialNum ?? -1
		this.IsAura = this.kv.IsAura ?? false

		const luaName = this.kv.LuaName
		const byModifierClass = StringTables.GetString(
			"ModifierNames",
			this.kv.ModifierClass as number
		)
		this.Name = luaName === undefined || luaName === "" ? byModifierClass : luaName

		const ddAbilityID = this.kv.DDAbilityID
		const ddAbilityName =
			ddAbilityID !== undefined
				? AbilityData.GetAbilityNameByID(ddAbilityID)
				: undefined
		this.DDAbilityName = ddAbilityName ?? "ability_base"
	}
	public get InvisibilityLevel(): number {
		const fadeTime = this.kv.FadeTime
		if (fadeTime === undefined) {
			return 0
		}
		if (fadeTime === 0) {
			return 1
		}
		return Math.min(this.ElapsedTime / (fadeTime * 2), 1)
	}

	public get DeltaZ(): number {
		return 0
	}

	public get DieTime(): number {
		return this.CreationTime + this.Duration
	}

	public get ElapsedTime(): number {
		return Math.max(GameState.RawGameTime - this.CreationTime, 0)
	}

	public get RemainingTime(): number {
		return Math.max(this.DieTime - GameState.RawGameTime, 0)
	}

	public get DDModifierID(): Nullable<number> {
		return this.kv.DDModifierID
	}

	public get vStart(): Vector4 {
		const vec = this.kv.vStart
		if (vec === undefined) {
			return new Vector4().Invalidate()
		}
		return new Vector4(vec.x, vec.y, vec.z, vec.w)
	}

	public get vEnd(): Vector4 {
		const vec = this.kv.vEnd
		if (vec === undefined) {
			return new Vector4().Invalidate()
		}
		return new Vector4(vec.x, vec.y, vec.z, vec.w)
	}

	public get CanHitSpellImmuneEnemy() {
		return this.Ability?.CanHitSpellImmuneEnemy ?? false
	}

	public GetTexturePath(_small?: boolean) {
		const abil = this.Ability
		if (abil !== undefined) {
			return abil.TexturePath
		}
		const abilName = this.ConsumedAbilityName
		if (abilName === undefined) {
			return ""
		}
		return abilName.includes("item_")
			? GetItemTexture(abilName)
			: GetSpellTexture(abilName)
	}

	public IsEnemy(team = this.Caster?.Team ?? GameState.LocalTeam) {
		return this.Parent?.Team !== team
	}

	public IsMagicImmune(unit?: Unit) {
		const owner = unit ?? this.Parent
		const caster = this.Ability?.Owner
		if (this.ThroughMagicImmunity(owner, caster)) {
			return false
		}
		return (unit ?? this.Parent)?.IsMagicImmune ?? false
	}

	public IsDebuffImmune(unit?: Unit) {
		const owner = unit ?? this.Parent
		const caster = this.Ability?.Owner
		if (this.ThroughMagicImmunity(owner, caster)) {
			return false
		}
		return (unit ?? this.Parent)?.IsDebuffImmune ?? false
	}

	public IsUnslowable(unit?: Unit): boolean {
		return (unit ?? this.Parent)?.IsUnslowable ?? false
	}
	public IsInvulnerable(unit?: Unit) {
		return (unit ?? this.Parent)?.IsInvulnerable ?? false
	}

	public IsInvisible(unit?: Unit) {
		return (unit ?? this.Parent)?.IsInvisible ?? false
	}

	public IsPassiveDisabled(unit?: Unit) {
		return (unit ?? this.Parent)?.IsPassiveDisabled ?? false
	}

	// TODO: update unit state changes by caster if is buff aura
	// example: modifier_enraged_wildkin_toughness_aura_bonus
	public OnUnitStateChaged(): void {
		this.updateAllSpecialValues()
	}

	public OnAbilityLevelChanged(): void {
		this.updateAllSpecialValues()
	}

	public OnUnitLevelChanged(): void {
		this.updateAllSpecialValues()
	}

	public OnAbilityCooldownChanged(): void {
		// implement in child classes
	}

	public OnShardChanged(): void {
		// implement in child classes
	}

	public OnScepterChanged(): void {
		// implement in child classes
	}

	public OnIntervalThink(): void {
		// implement in child classes
	}

	public Update(): void {
		let newParent = EntityManager.EntityByIndex<Unit>(this.kv.Parent),
			newCaster = EntityManager.EntityByIndex<Unit>(this.kv.Caster),
			newAbility = EntityManager.EntityByIndex<Ability>(this.kv.Ability),
			newAuraOwner = EntityManager.EntityByIndex<Unit>(this.kv.AuraOwner),
			newCustomEntity = EntityManager.EntityByIndex<Unit>(this.kv.CustomEntity)
		if (!newParent?.IsUnit) {
			newParent = undefined
		}
		if (!newCaster?.IsUnit) {
			newCaster = undefined
		}
		if (!newAbility?.IsAbility) {
			newAbility = undefined
		}
		if (!newAuraOwner?.IsUnit) {
			newAuraOwner = undefined
		}
		if (!newCustomEntity?.IsUnit) {
			newCustomEntity = undefined
		}
		const newAbilityLevel = this.kv.AbilityLevel ?? 0,
			newDuration = this.kv.Duration ?? 0,
			newStackCount = this.kv.StackCount ?? 0,
			newCreationTime = this.kv.CreationTime ?? 0,
			newArmor = this.kv.Armor ?? 0,
			newAttackSpeed = this.kv.AttackSpeed ?? 0,
			newMovementSpeed = this.kv.MovementSpeed ?? 0,
			newBonusAllStats = this.kv.BonusAllStats ?? 0,
			newBonusHealth = this.kv.BonusHealth ?? 0,
			newBonusMana = this.kv.BonusMana ?? 0,
			newChannelTime = this.kv.ChannelTime ?? 0,
			newDamage = this.kv.Damage ?? 0,
			newIsRanged = newParent?.IsRanged ?? false,
			newFadeTime = this.kv.FadeTime ?? 0

		if (this.Parent !== newParent) {
			this.Remove()
		}
		if (this.IsRanged !== newIsRanged) {
			this.IsRanged = newIsRanged
		}
		let updated = false
		if (this.Caster !== newCaster) {
			this.Caster = newCaster
			updated = true
		}
		if (this.NetworkFadeTime !== newFadeTime) {
			this.NetworkFadeTime = newFadeTime
			updated = true
		}
		if (this.Ability !== newAbility) {
			this.Ability = newAbility
			updated = true
		}
		if (this.AuraOwner !== newAuraOwner) {
			this.AuraOwner = newAuraOwner
			updated = true
		}
		if (this.AbilityLevel !== newAbilityLevel) {
			this.AbilityLevel = newAbilityLevel
			updated = true
		}
		if (this.NetworkDamage !== newDamage) {
			this.NetworkDamage = newDamage
			updated = true
		}
		if (this.Duration !== newDuration) {
			this.Duration = newDuration
			updated = true
		}
		if (this.StackCount !== newStackCount) {
			this.StackCount = newStackCount
			updated = true
		}

		if (this.CreationTime !== newCreationTime) {
			this.CreationTime = newCreationTime
			updated = true
		}
		if (this.Armor !== newArmor) {
			this.Armor = newArmor
			updated = true
		}
		if (this.NetworkArmor !== newArmor) {
			this.NetworkArmor = newArmor
			updated = true
		}
		if (this.AttackSpeed !== newAttackSpeed) {
			this.AttackSpeed = newAttackSpeed
			updated = true
		}
		if (this.MovementSpeed !== newMovementSpeed) {
			this.MovementSpeed = newMovementSpeed
			updated = true
		}
		if (this.BonusAllStats !== newBonusAllStats) {
			this.BonusAllStats = newBonusAllStats
			updated = true
		}
		if (this.BonusHealth !== newBonusHealth) {
			this.BonusHealth = newBonusHealth
			updated = true
		}
		if (this.BonusMana !== newBonusMana) {
			this.BonusMana = newBonusMana
			updated = true
		}
		if (this.CustomEntity !== newCustomEntity) {
			this.CustomEntity = newCustomEntity
			updated = true
		}
		if (this.NetworkChannelTime !== newChannelTime) {
			this.NetworkChannelTime = newChannelTime
			updated = true
		}
		if (this.NetworkAttackSpeed !== newAttackSpeed) {
			this.NetworkAttackSpeed = newAttackSpeed
			updated = true
		}
		if (
			this.Duration !== -1 &&
			this.DieTime < GameState.RawGameTime &&
			this.Name !== "modifier_legion_commander_overwhelming_odds"
		) {
			this.Remove()
			return
		}
		if (this.Parent !== newParent) {
			this.Parent = newParent
			this.AddModifier()
		} else if (this.Parent !== undefined && updated) {
			this.UnitPropertyChanged()
			EventsSDK.emit("ModifierChanged", false, this)
		} else if (this.Parent !== undefined) {
			EventsSDK.emit("ModifierChangedVBE", false, this)
		}
	}

	public Remove(): boolean {
		if (this.Parent === undefined || !this.Parent.Buffs.includes(this)) {
			return false
		}
		this.Parent.Buffs.remove(this)
		this.UnitPropertyChanged(false)
		this.IsValid = false
		EventsSDK.emit("ModifierRemoved", false, this)
		this.Parent.ChangeFieldsByEvents()
		return true
	}

	public ShouldUnslowable(unit?: Unit): boolean {
		return (
			this.IsUnslowable(unit) ||
			this.IsMagicImmune(unit) ||
			this.IsDebuffImmune(unit)
		)
	}

	public HasBehavior(flag: DOTA_ABILITY_BEHAVIOR): boolean {
		return this.Ability?.HasBehavior(flag) ?? false
	}

	public HasTargetFlags(flag: DOTA_UNIT_TARGET_FLAGS): boolean {
		return this.Ability?.HasTargetFlags(flag) ?? false
	}

	protected AddModifier(): boolean {
		if (this.Parent === undefined || this.Parent.Buffs.includes(this)) {
			return false
		}
		this.Parent.Buffs.push(this)
		this.UnitPropertyChanged()
		EventsSDK.emit("ModifierCreated", false, this)
		this.Parent.ChangeFieldsByEvents()
		return true
	}

	protected UnitPropertyChanged(_changed?: boolean): boolean {
		this.updateAllSpecialValues()
		return true
	}

	protected GetSpecialValue(
		specialName: string,
		level: number = this.AbilityLevel
	): number {
		if (!this.IsValid) {
			return 0
		}
		const abil = this.Ability
		level = Math.max(abil?.Level ?? level, level)

		if (this.ConsumedAbilityName !== undefined) {
			return this.byAbilityData(
				this.ConsumedAbilityName,
				specialName,
				// some abilities don't have levels ex: (modifier_item_moon_shard_consumed)
				// valve updated set AbilityLevel to 0
				Math.max(level, 1)
			)
		}
		if (abil === undefined || level === 0) {
			return 0
		}
		return abil.GetSpecialValue(specialName, level)
	}
	/** ======================= Cast Point ======================= */
	protected SetBonusCastPointAmplifier(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.BonusCastPointAmplifier = (subtract ? value * -1 : value) / 100
	}
	/** ======================= Absorb Damage ======================= */
	protected SetAbsorbDamage(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.AbsorbDamage = subtract ? value * -1 : value
	}
	/** ======================= Damage Reduction ======================= */
	protected SetDamageReduction(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.DamageReduction = subtract ? value * -1 : value
	}
	/** ======================= Armor ======================= */
	protected SetBaseFixedArmor(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.BaseFixedArmor = subtract ? value * -1 : value
	}
	protected SetBaseBonusArmor(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialArmorByState(specialName)
		this.BaseBonusArmor = subtract ? value * -1 : value
	}
	protected SetBaseBonusArmorAmplifier(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialArmorByState(specialName)
		this.BaseBonusArmorAmplifier = (subtract ? value * -1 : value) / 100
	}
	protected SetBonusArmor(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialArmorByState(specialName)
		this.BonusArmor = subtract ? value * -1 : value
	}
	protected SetBonusArmorAmplifier(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialArmorByState(specialName)
		this.BonusArmorAmplifier = (subtract ? value * -1 : value) / 100
	}
	protected GetSpecialArmorByState(specialName: string): number {
		const isImmune = this.IsMagicImmune() || this.IsDebuffImmune()
		const isPassiveDisabled = this.IsPassiveDisabled()
		if (
			(this.IsDebuff && isImmune && this.IsEnemy()) ||
			(this.IsBuff && isPassiveDisabled && !this.IsEnemy())
		) {
			return 0
		}
		return this.GetSpecialValue(specialName)
	}
	/** ======================= Attack Speed ======================= */
	protected SetBonusBaseAttackTime(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.BonusBaseAttackTime = subtract ? value * -1 : value
	}
	protected SetFixedBaseAttackTime(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.FixedBaseAttackTime = subtract ? value * -1 : value
	}
	protected SetBaseBonusAttackSpeed(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.BaseBonusAttackSpeed = subtract ? value * -1 : value
	}
	protected SetBonusBaseAttackSpeedAmplifier(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.BaseAttackSpeedAmplifier = (subtract ? value * -1 : value) / 100
	}
	protected SetAttackSpeedAmplifier(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialAttackSpeedByState(specialName)
		this.AttackSpeedAmplifier = (subtract ? value * -1 : value) / 100
	}
	protected SetBonusAttackSpeed(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialAttackSpeedByState(specialName)
		this.BonusAttackSpeed = subtract ? value * -1 : value
	}
	protected SetFixedAttackAnimationPoint(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.FixedAttackAnimationPoint = subtract ? value * -1 : value
	}
	protected GetSpecialAttackSpeedByState(specialName: string): number {
		const isImmune = this.IsMagicImmune() || this.IsDebuffImmune()
		const isPassiveDisabled = this.IsPassiveDisabled()
		if (
			(this.IsDebuff && isImmune && this.IsEnemy()) ||
			(this.IsBuff && isPassiveDisabled && !this.IsEnemy())
		) {
			return 0
		}
		return this.GetSpecialValue(specialName)
	}
	/** ======================= Move Speed ======================= */
	protected SetStatusResistanceSpeed(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.StatusResistanceSpeed = (subtract ? value * -1 : value) / 100
	}
	protected SetFixedMoveSpeed(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialMoveSpeedByState(specialName)
		this.MoveSpeedFixed = subtract ? value * -1 : value
	}
	protected SetBonusMoveSpeed(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialMoveSpeedByState(specialName)
		this.BonusMoveSpeed = subtract ? value * -1 : value
	}
	protected SetBaseMoveSpeed(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialMoveSpeedByState(specialName)
		this.MoveSpeedBase = subtract ? value * -1 : value
	}
	protected SetBaseMoveSpeedAmplifier(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialMoveSpeedByState(specialName)
		this.MoveSpeedBaseAmplifier = (subtract ? value * -1 : value) / 100
	}
	protected SetMoveSpeedAmplifier(
		specialName?: string,
		subtract: boolean = false
	): void {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialMoveSpeedByState(specialName)
		this.BonusMoveSpeedAmplifier = (subtract ? value * -1 : value) / 100
	}
	protected GetSpecialMoveSpeedByState(specialName: string): number {
		const isImmuneSlow = this.ShouldUnslowable()
		const isPassiveDisabled = this.IsPassiveDisabled()
		if (
			(this.IsBuff && isPassiveDisabled && !this.IsEnemy()) ||
			(this.IsDebuff && isImmuneSlow && this.IsEnemy())
		) {
			return 0
		}
		return this.GetSpecialValue(specialName)
	}
	/** ======================= Day night vision ======================= */
	protected SetBonusDayVision(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.BonusDayVision = subtract ? value * -1 : value
	}
	protected SetBonusDayVisionAmplifier(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.BonusDayVisionAmplifier = (subtract ? value * -1 : value) / 100
	}
	protected SetBonusNightVision(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.BonusNightVision = subtract ? value * -1 : value
	}
	/** ======================= Attack Range ======================= */
	protected SetFixedAttackRange(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.FixedAttackRange = subtract ? value * -1 : value
	}
	protected SetBonusAttackRange(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.BonusAttackRange = subtract ? value * -1 : value
	}
	protected SetAttackRangeAmplifier(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		const state = this.IsDebuff && (this.IsMagicImmune() || this.IsDebuffImmune())
		this.AttackRangeAmplifier = !state ? (subtract ? value * -1 : value) / 100 : 0
	}
	/** ======================= Cast Range ======================= */
	protected SetBonusCastRange(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.BonusCastRange = subtract ? value * -1 : value
	}
	protected SetCastRangeAmplifier(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		const state = this.IsDebuff && (this.IsMagicImmune() || this.IsDebuffImmune())
		this.CastRangeAmplifier = !state ? (subtract ? value * -1 : value) / 100 : 0
	}
	/** ======================= AOE Radius ======================= */
	protected SetBonusAOERadius(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.BonusAOERadius = subtract ? value * -1 : value
	}
	protected SetBonusAOERadiusAmplifier(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.BonusAOERadiusAmplifier = (subtract ? value * -1 : value) / 100
	}
	/** ======================= Turn rate ======================= */
	protected SetFixedTurnRate(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.FixedTurnRate = subtract ? value * -1 : value
	}
	protected SetFixedBaseTurnRate(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.FixedBaseTurnRate = subtract ? value * -1 : value
	}
	protected SetBonusTurnRate(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		const state = this.IsDebuff && (this.IsMagicImmune() || this.IsDebuffImmune())
		this.BonusTurnRate = !state ? (subtract ? value * -1 : value) : 0
	}
	protected SetTurnRateAmplifier(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		const state = this.IsDebuff && (this.IsMagicImmune() || this.IsDebuffImmune())
		this.BonusTurnRate = !state ? (subtract ? value * -1 : value) / 100 : 0
	}
	/** ======================= Status Resistance ======================= */
	protected SetStatusResistanceAmplifier(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.StatusResistanceAmplifier = (subtract ? value * -1 : value) / 100
	}
	/** ======================= Bonus / Reduction mana costs ======================= */
	protected SetBonusManaCostAmplifier(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.BonusManaCostAmplifier = (subtract ? value * -1 : value) / 100
	}
	/** @description NOTE: does not include talents (recommended use only items) */
	protected byAbilityData(
		abilName: string,
		specialName: string,
		level: number
	): number {
		const abilityData = AbilityData.GetAbilityByName(abilName)
		if (abilityData === undefined || level === 0) {
			return 0
		}
		return abilityData.GetSpecialValue(specialName, level, abilName)
	}

	private updateAllSpecialValues() {
		// armor
		this.SetBaseFixedArmor()
		this.SetBaseBonusArmor()
		this.SetBaseBonusArmorAmplifier()
		this.SetBonusArmor()
		this.SetBonusArmorAmplifier()

		// damage
		this.SetAbsorbDamage()
		this.SetDamageReduction()

		// bonus cast range
		this.SetBonusCastRange()
		this.SetCastRangeAmplifier()

		// bonus turn rate
		this.SetBonusTurnRate()
		this.SetFixedTurnRate()
		this.SetFixedBaseTurnRate()
		this.SetTurnRateAmplifier()

		// bonus spells radius
		this.SetBonusAOERadius()
		this.SetBonusAOERadiusAmplifier()

		// bonus attack range
		this.SetBonusAttackRange()
		this.SetFixedAttackRange()
		this.SetAttackRangeAmplifier()

		// bonus vision
		this.SetBonusDayVision()
		this.SetBonusNightVision()

		// status resistance
		this.SetStatusResistanceAmplifier()

		// bonus move speed
		this.SetBaseMoveSpeed()
		this.SetFixedMoveSpeed()
		this.SetBonusMoveSpeed()
		this.SetMoveSpeedAmplifier()
		this.SetStatusResistanceSpeed()
		this.SetBaseMoveSpeedAmplifier()

		// attack speed
		this.SetBonusAttackSpeed()
		this.SetAttackSpeedAmplifier()
		this.SetFixedBaseAttackTime()
		this.SetBonusBaseAttackTime()
		this.SetBaseBonusAttackSpeed()
		this.SetFixedAttackAnimationPoint()
		this.SetBonusBaseAttackSpeedAmplifier()

		// cast point
		this.SetBonusCastPointAmplifier()

		// mana cost
		this.SetBonusManaCostAmplifier()
	}

	private ThroughMagicImmunity(unit?: Unit, caster?: Unit) {
		const owner = unit ?? this.Parent
		const source = caster ?? this.Ability?.Owner
		if (owner === undefined || source === undefined) {
			return false
		}
		const hasFlag = this.HasTargetFlags(
			DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES
		)
		return source.Team !== owner.Team && (hasFlag || this.CanHitSpellImmuneEnemy)
	}
}
