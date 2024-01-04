import { Vector4 } from "../../Base/Vector4"
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
	public static VisibleForEnemies: string[] = [
		"modifier_bounty_hunter_track",
		"modifier_slardar_amplify_damage",
		"modifier_bloodseeker_thirst_vision",
		"modifier_spirit_breaker_charge_of_darkness_vision"
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

	/** @readonly */
	public IsValid = true
	/** @readonly */
	public IsHidden = false
	/** @readonly */
	public IsBuff = false
	/** @readonly */
	public IsDebuff = false
	/** @readonly */
	public IsStunDebuff = false
	/** @readonly */
	public IsHiddenWhenStolen = false
	/** @readonly */
	public VisibleForEnemies = false
	/** @readonly */
	public BonusAttackSpeed = 0
	/** @readonly */
	public BonusAttackRange = 0
	/** @readonly */
	public ReductionCastRange = 0
	/** @readonly */
	public ReductionAttackRange = 0

	// bonus ability radius
	/** @readonly */
	public BonusCastRange = 0
	/** @readonly */
	public BonusAOERadius = 0

	// Base move speed
	/** @readonly */
	public MoveSpeedBase = 0
	/** @readonly */
	public MoveSpeedFixed = 0

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

	public IsEnemy(team = this.Caster?.Team ?? GameState.LocalTeam) {
		return this.Parent?.Team !== team
	}

	public IsMagicImmune(unit?: Unit) {
		return (unit ?? this.Parent)?.IsMagicImmune ?? false
	}

	public IsUnslowable(unit?: Unit): boolean {
		return (unit ?? this.Parent)?.IsUnslowable ?? false
	}

	public IsDebuffImmune(unit?: Unit) {
		return (unit ?? this.Parent)?.IsDebuffImmune ?? false
	}

	public IsInvulnerable(unit?: Unit) {
		return (unit ?? this.Parent)?.IsInvulnerable ?? false
	}

	public IsInvisible(unit?: Unit) {
		return (unit ?? this.Parent)?.IsInvisible ?? false
	}

	public OnUnitStateChaged(): void {
		this.updateAllSpecialValues()
	}

	public OnAbilityCooldownChanged(): void {
		// implement in child classes
	}

	public OnPostDataUpdate(): void {
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
			newCustomEntity = EntityManager.EntityByIndex<Unit>(this.kv.CustomEntity)

		if (this.Parent !== newParent) {
			this.Remove()
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

	protected UnitPropertyChanged(changed?: boolean): boolean {
		const owner = this.Parent
		if (owner === undefined) {
			return false
		}
		const state = (changed ??= true)
		switch (this.Name) {
			case "modifier_arc_warden_tempest_double":
				owner.IsClone_ = state
				owner.CanUseItems = state
				owner.CanUseAbilities = state
				EventsSDK.emit("UnitPropertyChanged", false, owner)
				break
			case "modifier_vengefulspirit_hybrid_special":
				owner.IsClone_ = state && owner.IsAlive
				owner.CanUseAbilities = state && owner.IsAlive
				EventsSDK.emit("UnitPropertyChanged", false, owner)
				break
			case "modifier_muerta_parting_shot_soul_clone":
				owner.IsClone_ = state
				owner.CanUseAbilities = state
				EventsSDK.emit("UnitPropertyChanged", false, owner)
				break
		}

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
		const lvlAbil = abil?.Level ?? level
		if (level === 0 || level < lvlAbil) {
			level = lvlAbil
		}
		if (this.CustomAbilityName !== undefined) {
			return this.byAbilityData(this.CustomAbilityName, specialName, level)
		}
		if (abil === undefined || level === 0) {
			return 0
		}
		return abil.GetSpecialValue(specialName, level)
	}

	protected SetFixedMoveSpeed(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialSpeedByState(specialName)
		this.MoveSpeedFixed = subtract ? value * -1 : value
	}

	protected SetBonusAOERadius(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialValue(specialName)
		this.BonusAOERadius = subtract ? value * -1 : value
	}

	protected SetBonusMoveSpeed(specialName?: string, subtract = false) {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialSpeedByState(specialName)
		this.BonusMoveSpeed = subtract ? value * -1 : value
	}

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

	protected GetSpecialSpeedByState(specialName: string): number {
		const state = this.ShouldUnslowable()
		const value = this.GetSpecialValue(specialName)
		return state && this.IsDebuff && this.IsEnemy() ? 0 : value
	}

	/**
	 * @description Sets the amplifier move speed based on the provided special name.
	 * @param {string} specialName - The special name to use for calculation.
	 * @param {boolean} subtract - Optional. Whether to subtract the calculated value.
	 */
	protected SetMoveSpeedAmplifier(
		specialName?: string,
		subtract: boolean = false
	): void {
		if (specialName === undefined) {
			return
		}
		const value = this.GetSpecialSpeedByState(specialName)
		this.BonusMoveSpeedAmplifier = (subtract ? value * -1 : value) / 100
	}

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
		// bonus vision
		this.SetBonusDayVision()
		this.SetBonusNightVision()

		// bonus move speed
		this.SetFixedMoveSpeed()
		this.SetBonusMoveSpeed()
		this.SetMoveSpeedAmplifier()

		// bonus spells
		this.SetBonusAOERadius()
	}
}
