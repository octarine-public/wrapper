import { WrapperClass } from "../../../Decorators"
import { EventPriority } from "../../../Enums/EventPriority"
import { EventsSDK } from "../../../Managers/EventsSDK"
import { Ability } from "../../Base/Ability"
import { Modifier } from "../../Base/Modifier"
import { Unit } from "../../Base/Unit"

@WrapperClass("tusk_snowball")
export class tusk_snowball extends Ability implements INuke {
	public readonly Friendly: Unit[] = []

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
		return baseDamage + damageBonus * this.Friendly.length
	}
}

const modifiers: Modifier[] = []
function CalculateFriendlyCount(abil: tusk_snowball, remove: boolean = false) {
	for (let i = modifiers.length - 1; i > -1; i--) {
		const modifier = modifiers[i]
		const owner = modifier.Parent
		if (owner === undefined) {
			modifiers.remove(modifier)
			continue
		}
		if (!modifier.IsValid || abil !== modifier.Ability) {
			abil.Friendly.remove(owner)
			modifiers.remove(modifier)
			continue
		}
		if (remove) {
			abil.Friendly.remove(owner)
			continue
		}
		if (abil.Friendly.includes(owner)) {
			continue
		}
		abil.Friendly.push(owner)
	}
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
		CalculateFriendlyCount(ability, true)
		modifiers.remove(modifier)
		return
	}
	modifiers.push(modifier)
	CalculateFriendlyCount(ability)
}

EventsSDK.on("ModifierCreated", mod => ModifierChanged(mod, true), EventPriority.HIGH)

EventsSDK.on("ModifierRemoved", mod => ModifierChanged(mod, false), EventPriority.HIGH)
