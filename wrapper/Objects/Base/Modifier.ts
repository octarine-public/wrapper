import { Vector4 } from "../../Base/Vector4"
import { GetItemTexture, GetSpellTexture } from "../../Data/ImageData"
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

	/** @readonly */
	public IsValid = true
	/** @readonly */
	public IsHidden = false
	/** @readonly */
	public IsBuff = false
	/** @readonly */
	public IsShield = false
	/** @readonly */
	public IsGhost = false
	/** @readonly */
	public IsDebuff = false
	/** @readonly */
	public IsStunDebuff = false
	/** @readonly */
	public IsHiddenWhenStolen = false
	/** @readonly */
	public IsDeniable = false
	/** @readonly */
	public IsVisibleForEnemies = false

	// Attack speed
	/** @readonly */
	public IsAttackSpeedLimit = true
	/** @readonly */
	public FixedBaseAttackTime = 0
	/** @readonly */
	public BonusBaseAttackTime = 0
	/** @readonly */
	public BonusBaseAttackTimeStack = false
	/** @readonly */
	public FixedAttackAnimationPoint = 0
	/** @readonly */
	public BonusAttackSpeed = 0
	/** @readonly */
	public BaseBonusAttackSpeed = 0
	/** @readonly */
	public BaseBonusAttackSpeedStack = false
	/** @readonly */
	public BaseAttackSpeedAmplifier = 0
	/** @readonly */
	public BaseAttackSpeedAmplifierStack = false
	/** @readonly */
	public BonusAttackSpeedStack = false
	/** @readonly */
	public AttackSpeedAmplifier = 0
	/** @readonly */
	public AttackSpeedAmplifierStack = false

	// Bonus attack range
	/** @readonly */
	public FixedAttackRange = 0
	/** @readonly */
	public BonusAttackRange = 0
	/** @readonly */
	public AttackRangeAmplifier = 0
	/** @readonly */
	public BonusAttackRangeStack = false
	/** @readonly */
	public AttackRangeAmplifierStack = false
	/** @readonly */
	public IsInfinityAttackRange = false

	// Bonus cast range
	/** @readonly */
	public BonusCastRange = 0
	/** @readonly */
	public CastRangeAmplifier = 0
	/** @readonly */
	public BonusCastRangeStack = false
	/** @readonly */
	public CastRangeAmplifierStack = false

	// Bonus radius
	/** @readonly */
	public BonusAOERadius = 0

	// Base move speed
	/** @readonly */
	public MoveSpeedBase = 0
	/** @readonly */
	public MoveSpeedBaseStack = false
	/** @readonly */
	public MoveSpeedFixed = 0
	/** @readonly */
	public MoveSpeedBaseAmplifier = 0
	/** @readonly */
	public MoveSpeedBaseAmplifierStack = false

	// Bonus move speed
	/** @readonly */
	public IsBoots = false
	/** @readonly */
	public IsMoveSpeedLimit = true
	/** @readonly */
	public BonusMoveSpeed = 0
	/** @readonly */
	public BonusMoveSpeedStack = false
	/** @readonly */
	public BonusMoveSpeedAmplifier = 0
	/** @readonly */
	public BonusMoveSpeedAmplifierStack = false
	/** @readonly */
	public StatusResistanceSpeed = 0
	/** @readonly */
	public StatusResistanceSpeedStack = false

	// Bonus armor
	/** @readonly */
	public BonusArmor = 0
	/** @readonly */
	public BonusArmorStack = false
	/** @readonly */
	public BonusArmorAmplifier = 0
	/** @readonly */
	public BonusArmorAmplifierStack = false

	// bonus vision
	/** @readonly */
	public BonusDayVision = 0
	/** @readonly */
	public BonusDayVisionStack = false
	/** @readonly */
	public BonusDayVisionAmplifier = 0
	/** @readonly */
	public BonusDayVisionAmplifierStack = false
	/** @readonly */
	public BonusNightVision = 0
	/** @readonly */
	public BonusNightVisionStack = false

	// move speed resistance
	/** @readonly */

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
	protected CustomAbilityName: Nullable<string> = undefined

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
	// TODO: rework this after add ModifierManager
	public get InvisibilityLevel(): number {
		if (
			this.Name === "modifier_monkey_king_bounce_leap" ||
			this.Name === "modifier_monkey_king_arc_to_ground"
		) {
			return 0
		}
		const fadeTime = this.kv.FadeTime
		if (fadeTime === undefined) {
			return 0
		}
		if (fadeTime === 0) {
			return 1
		}
		return Math.min(this.ElapsedTime / (fadeTime * 2), 1)
	}

	// TODO: rework this after add ModifierManager
	public get DeltaZ(): number {
		if (
			(this.Name === "modifier_monkey_king_bounce_leap" ||
				this.Name === "modifier_monkey_king_arc_to_ground") &&
			this.ElapsedTime < 10 // just in case buff bugs out
		) {
			return this.kv.FadeTime ?? 0
		}
		switch (this.Name) {
			case "modifier_rattletrap_jetpack":
				return 260
			case "modifier_lina_flame_cloak":
			case "modifier_monkey_king_bounce_perch":
				return 100
			default:
				return 0
		}
	}

	// TODO: rework this after add ModifierManager
	public get ShouldDoFlyHeightVisual(): boolean {
		return (
			this.Name === "modifier_winter_wyvern_arctic_burn_flight" ||
			this.Name === "modifier_courier_flying" ||
			this.Name === "modifier_night_stalker_darkness" ||
			this.Name === "modifier_monkey_king_bounce_perch"
		)
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
		return this.Name.includes("item_")
			? GetItemTexture(this.Name)
			: GetSpellTexture(this.Name)
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

	public IsUnslowable(unit?: Unit): boolean {
		return (unit ?? this.Parent)?.IsUnslowable ?? false
	}

	public IsDebuffImmune(unit?: Unit) {
		const owner = unit ?? this.Parent
		const caster = this.Ability?.Owner
		if (this.ThroughMagicImmunity(owner, caster)) {
			return false
		}
		return (unit ?? this.Parent)?.IsDebuffImmune ?? false
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

	public OnUnitStateChaged(): void {
		this.updateAllSpecialValues()
	}

	public OnAbilityLevelChanged(): void {
		this.updateAllSpecialValues()
	}

	public OnAbilityCooldownChanged(): void {
		// implement in child classes
	}

	public OnIntervalThink(): void {
		// implement in child classes
	}

	public Update(): void {
		const newCaster = EntityManager.EntityByIndex<Unit>(this.kv.Caster),
			newAbility = EntityManager.EntityByIndex<Ability>(this.kv.Ability),
			newAuraOwner = EntityManager.EntityByIndex<Unit>(this.kv.AuraOwner),
			newParent = EntityManager.EntityByIndex<Unit>(this.kv.Parent),
			newAbilityLevel = this.kv.AbilityLevel ?? 0,
			newDuration = this.kv.Duration ?? 0,
			newStackCount = this.kv.StackCount ?? 0,
			newCreationTime = this.kv.CreationTime ?? 0,
			newArmor = this.kv.Armor ?? 0,
			newAttackSpeed = this.kv.AttackSpeed ?? 0,
			newMovementSpeed = this.kv.MovementSpeed ?? 0,
			newBonusAllStats = this.kv.BonusAllStats ?? 0,
			newBonusHealth = this.kv.BonusHealth ?? 0,
			newBonusMana = this.kv.BonusMana ?? 0,
			newCustomEntity = EntityManager.EntityByIndex<Unit>(this.kv.CustomEntity),
			newChannelTime = this.kv.ChannelTime ?? 0,
			newDamage = this.kv.Damage ?? 0,
			newIsRanged = newParent?.IsRanged ?? false

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

		if (this.CustomAbilityName !== undefined) {
			return this.byAbilityData(this.CustomAbilityName, specialName, level)
		}
		if (abil === undefined || level === 0) {
			return 0
		}
		return abil.GetSpecialValue(specialName, level)
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

	/** ======================= Bonus AOE Radius ======================= */
	protected SetBonusAOERadius(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.BonusAOERadius = subtract ? value * -1 : value
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
		// bonus cast range
		this.SetBonusCastRange()
		this.SetCastRangeAmplifier()

		// bonus spells radius
		this.SetBonusAOERadius()

		// bonus attack range
		this.SetBonusAttackRange()
		this.SetAttackRangeAmplifier()

		// bonus vision
		this.SetBonusDayVision()
		this.SetBonusNightVision()

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
