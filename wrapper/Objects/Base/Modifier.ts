import { Vector4 } from "../../Base/Vector4"
import { DOTA_UNIT_TARGET_FLAGS } from "../../Enums/DOTA_UNIT_TARGET_FLAGS"
import { EModifierfunction } from "../../Enums/EModifierfunction"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import { IModifier } from "../../Managers/ModifierManager"
import { GameState } from "../../Utils/GameState"
import { AbilityData } from "../DataBook/AbilityData"
import { Ability } from "./Ability"
import { Entity } from "./Entity"
import { Unit } from "./Unit"

const scepterRegExp = /^modifier_(item_ultimate_scepter|wisp_tether_scepter)/

export type ModifierHandlerValue = () => [number, boolean]
export type ModifierMapFieldHandler = Map<EModifierfunction, ModifierHandlerValue>

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

	public readonly Name: string
	public readonly IsAura: boolean
	public readonly Index: number
	public readonly SerialNumber: number
	public readonly DDAbilityName: string

	public NetworkArmor = 0
	public NetworkDamage = 0
	public NetworkFadeTime = 0
	public NetworkBonusMana = 0
	public NetworkBonusHealth = 0
	public NetworkAttackSpeed = 0
	public NetworkChannelTime = 0
	public NetworkMovementSpeed = 0
	public NetworkBonusAllStats = 0
	public NetworkSubtle = false
	public NetworkIsActive = false
	public NetworkAuraWithInRange = false // e.g. "modifier_omniknight_degen_aura_effect"

	public CreationTime = 0
	public CustomEntity: Nullable<Unit>
	public StackCount = 0
	public Duration = 0
	public AbilityLevel = 0

	public Parent: Nullable<Unit>
	public Ability: Nullable<Ability>
	public Caster: Nullable<Unit>
	public AuraOwner: Nullable<Unit>

	public IsValid = true
	public HasVisualShield = false
	public ShouldDoFlyHeightVisual = false

	protected CanPostDataUpdate = false
	protected DeclaredFunction: Nullable<ModifierMapFieldHandler>
	protected CachedAbilityName: Nullable<string>

	constructor(public kv: IModifier) {
		this.Index = this.kv.Index ?? -1
		this.SerialNumber = this.kv.SerialNum ?? -1
		this.IsAura = this.kv.IsAura ?? false
		this.Name = this.kv.InternalName
		this.DDAbilityName = this.kv.InternalDDAbilityName
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

	public get IsBreakable(): boolean {
		const ability = this.Ability
		if (ability !== undefined) {
			return ability.IsBreakable
		}
		const abilData = AbilityData.GetAbilityByName(this.CachedAbilityName ?? "")
		return abilData?.IsBreakable ?? false
	}

	public get IsDispellable(): boolean {
		const ability = this.Ability
		if (ability !== undefined) {
			return ability.IsDispellable
		}
		const abilData = AbilityData.GetAbilityByName(this.CachedAbilityName ?? "")
		return abilData?.IsDispellable ?? false
	}

	public get CanHitSpellImmuneEnemy() {
		const ability = this.Ability
		if (ability !== undefined) {
			return ability.CanHitSpellImmuneEnemy
		}
		const abilData = AbilityData.GetAbilityByName(this.CachedAbilityName ?? "")
		return abilData?.CanHitSpellImmuneEnemy ?? false
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
			newChannelTime = this.kv.ChannelTime ?? 0,
			newDamage = this.kv.Damage ?? 0,
			newFadeTime = this.kv.FadeTime ?? 0,
			newMovementSpeed = this.kv.MovementSpeed ?? 0,
			newAuraWithinRange = this.kv.AuraWithInRange ?? false,
			newNetworkSubtle = this.kv.Subtle ?? false,
			newIsActive = this.kv.IsActive ?? false

		if (this.Parent !== newParent) {
			this.Remove()
		}
		let updated = false
		if (this.Caster !== newCaster) {
			this.Caster = newCaster
			this.UpdateSpecialValues()
			updated = true
		}
		if (this.Ability !== newAbility) {
			this.Ability = newAbility
			this.UpdateSpecialValues()
			updated = true
		}
		if (this.AuraOwner !== newAuraOwner) {
			this.AuraOwner = newAuraOwner
			this.UpdateSpecialValues()
			updated = true
		}
		if (this.AbilityLevel !== newAbilityLevel) {
			this.AbilityLevel = newAbilityLevel
			this.UpdateSpecialValues()
			updated = true
		}
		if (this.StackCount !== newStackCount) {
			this.StackCount = newStackCount
			this.UpdateSpecialValues()
			updated = true
		}
		if (this.CustomEntity !== newCustomEntity) {
			this.CustomEntity = newCustomEntity
			this.UpdateSpecialValues()
			updated = true
		}
		if (this.NetworkSubtle !== newNetworkSubtle) {
			this.NetworkSubtle = newNetworkSubtle
			this.UpdateSpecialValues()
			updated = true
		}
		if (this.NetworkIsActive !== newIsActive) {
			this.NetworkIsActive = newIsActive
			this.UpdateSpecialValues()
			updated = true
		}
		if (this.NetworkAuraWithInRange !== newAuraWithinRange) {
			this.NetworkAuraWithInRange = newAuraWithinRange
			this.UpdateSpecialValues()
			updated = true
		}
		if (this.NetworkMovementSpeed !== newMovementSpeed) {
			this.NetworkMovementSpeed = newMovementSpeed
			updated = true
		}
		if (this.NetworkFadeTime !== newFadeTime) {
			this.NetworkFadeTime = newFadeTime
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
		if (this.CreationTime !== newCreationTime) {
			this.CreationTime = newCreationTime
			updated = true
		}
		if (this.NetworkArmor !== newArmor) {
			this.NetworkArmor = newArmor
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
		if (newAbility !== undefined && this.Ability !== undefined) {
			this.CachedAbilityName = newAbility.Name
		}
		if (this.Parent !== newParent) {
			this.Parent = newParent
			this.AddModifier()
		} else if (this.Parent !== undefined && updated) {
			this.UnitModifierChanged()
			EventsSDK.emit("ModifierChanged", false, this)
		} else if (this.Parent !== undefined) {
			EventsSDK.emit("ModifierChangedVBE", false, this)
		}
	}

	public GetTexturePath(): string {
		return this.Ability?.TexturePath ?? ""
	}

	public IsEnemy(ent?: Entity): boolean {
		return this.Parent?.IsEnemy(ent) ?? false
	}

	public OnHasShardChanged(): void {
		this.UpdateSpecialValues()
	}

	public OnHasScepterChanged(): void {
		this.UpdateSpecialValues()
	}

	public OnAbilityLevelChanged(): void {
		this.UpdateSpecialValues()
	}

	public PostDataUpdate(): void {
		// child classes should override
	}

	public Remove(): boolean {
		const parent = this.Parent
		if (parent === undefined || !parent.Buffs.includes(this)) {
			return false
		}
		this.IsValid = false
		if (this.CanPostDataUpdate) {
			this.kv.RemoveInternalModifier(this)
		}
		parent.Buffs.remove(this)
		this.UnitPropertyChanged(false)
		parent.ModifierManager.AddOrRemoveInternal(this.DeclaredFunction, false)
		EventsSDK.emit("ModifierRemoved", false, this)
		parent.ChangeFieldsByEvents()
		return true
	}

	public HasTargetFlags(flag: DOTA_UNIT_TARGET_FLAGS): boolean {
		const ability = this.Ability
		if (ability !== undefined) {
			return ability.HasTargetFlags(flag)
		}
		const abilData = AbilityData.GetAbilityByName(this.CachedAbilityName ?? "")
		return abilData?.HasTargetFlags(flag) ?? false
	}

	public IsMagicImmune(unit?: Unit) {
		const owner = unit ?? this.Parent
		const caster = this.Ability?.Owner
		if (this.flagsMagicImmunity(owner, caster)) {
			return false
		}
		return (
			((unit ?? this.Parent)?.IsMagicImmune ?? false) ||
			((unit ?? this.Parent)?.IsDebuffImmune ?? false)
		)
	}

	public IsPassiveDisabled(source?: Unit) {
		source ??= this.Ability?.Owner
		if (source === undefined || !source.IsPassiveDisabled) {
			return false
		}
		return this.IsBreakable && this.IsDispellable
	}

	// Ability#vengefulspirit_soul_strike
	// e.g HasMeleeAttacksBonuses modifier_vengefulspirit_soul_strike
	protected HasMeleeAttacksBonuses(source?: Unit): boolean {
		source ??= this.Parent
		return source !== undefined && (source.IsAttacksAreMelee || !source.IsRanged)
	}

	protected AddModifier(): boolean {
		const parent = this.Parent
		if (parent === undefined || parent.Buffs.includes(this)) {
			return false
		}
		if (this.CanPostDataUpdate) {
			this.kv.AddInternalModifier(this)
		}
		parent.Buffs.push(this)
		this.UpdateSpecialValues()
		this.UnitPropertyChanged()
		parent.ModifierManager.AddOrRemoveInternal(this.DeclaredFunction, true)
		EventsSDK.emit("ModifierCreated", false, this)
		parent.ChangeFieldsByEvents()
		return true
	}

	/**
	 * @param specialName name of the special
	 * @param abilityName (e.g. "item_smoke_of_deceit", "item_moon_shard")
	 * @param level optional (e.g. invoker_ghost_walk#WexLevel)
	 * @return number
	 */
	protected GetSpecialValue(
		specialName: string,
		abilityName: string,
		level = Math.max(this.Ability?.Level ?? this.AbilityLevel, 1)
	): number {
		const ability = this.Ability
		if (ability !== undefined) {
			return ability.GetSpecialValue(specialName, level)
		}
		const data = AbilityData.GetAbilityByName(abilityName)
		if (data === undefined) {
			return 0
		}
		this.CachedAbilityName = abilityName
		return data?.GetSpecialValue(specialName, level) ?? 0
	}

	protected UnitModifierChanged(): void {
		if (this.DeclaredFunction !== undefined) {
			this.UpdateSpecialValues()
		}
		this.UnitPropertyChanged()
	}

	protected UpdateSpecialValues() {
		// child classes should override this method to update special values
		// e.g. this.cachedSpeed = this.GetSpecialValue("movespeed", "wisp_tether")
	}

	protected UnitPropertyChanged(_changed?: boolean): boolean {
		// child classes should override
		return true
	}

	private flagsMagicImmunity(unit?: Unit, caster?: Unit) {
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
