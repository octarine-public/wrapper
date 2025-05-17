import { WrapperClass } from "../../../Decorators"
import { EventPriority } from "../../../Enums/EventPriority"
import { EventsSDK } from "../../../Managers/EventsSDK"
import { Ability } from "../../Base/Ability"
import { Modifier } from "../../Base/Modifier"
import { Unit } from "../../Base/Unit"

@WrapperClass("tusk_snowball")
export class tusk_snowball extends Ability implements INuke {
	/** @readonly */
	public FriendlyCounts: number = 0

	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("snowball_speed", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("snowball_radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("snowball_damage", level)
	}
	public GetRawDamage(target: Unit): number {
		return this.rawTotalDamage(target, super.GetRawDamage(target))
	}

	private rawTotalDamage(_target: Unit, baseDamage: number = 0): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const damageBonus = this.GetSpecialValue("snowball_damage_bonus")
		return baseDamage + damageBonus * this.FriendlyCounts
	}
}

const modifiers: Modifier[] = []
function CalculateFriendlyCount(abil: tusk_snowball) {
	let result = 0
	for (let i = modifiers.length - 1; i > -1; i--) {
		const modifier = modifiers[i]
		if (!modifier.IsValid || abil !== modifier.Ability) {
			modifiers.remove(modifier)
			continue
		}
		result++
	}
	abil.FriendlyCounts = result
}

function ModifierChanged(modifier: Modifier, create: boolean) {
	if (modifier.Name !== "modifier_tusk_snowball_movement_friendly") {
		return
	}
	const owner = modifier.Parent,
		caster = modifier.Caster
	if (owner === undefined || caster === undefined) {
		return
	}
	const ability = modifier.Ability
	if (!(ability instanceof tusk_snowball)) {
		return
	}
	if (!create) {
		modifiers.remove(modifier)
		CalculateFriendlyCount(ability)
		return
	}
	modifiers.push(modifier)
	CalculateFriendlyCount(ability)
}

EventsSDK.on("ModifierCreated", mod => ModifierChanged(mod, true), EventPriority.HIGH)

EventsSDK.on("ModifierRemoved", mod => ModifierChanged(mod, false), EventPriority.HIGH)
