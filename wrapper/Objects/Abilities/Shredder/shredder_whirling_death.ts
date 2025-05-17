import { WrapperClass } from "../../../Decorators"
import { EventPriority } from "../../../Enums/EventPriority"
import { EventsSDK } from "../../../Managers/EventsSDK"
import { Ability } from "../../Base/Ability"
import { Entity } from "../../Base/Entity"
import { Hero } from "../../Base/Hero"
import { TempTrees } from "../../Base/TempTree"
import { Trees } from "../../Base/Tree"
import { Unit } from "../../Base/Unit"

@WrapperClass("shredder_whirling_death")
export class shredder_whirling_death extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner,
			baseDamage = super.GetRawDamage(target)
		if (baseDamage === 0 || owner === undefined || !heroes.has(owner)) {
			return baseDamage
		}
		// TODO: can be out of range (smart CanHit)
		if (!target.IsVisible && !target.IsInvisible) {
			return baseDamage
		}
		if (owner.Distance2D(target) > this.AOERadius) {
			return baseDamage
		}
		const treeCount = heroes.get(owner)?.[1] ?? 0
		const treeDamageScale = this.GetSpecialValue("tree_damage_scale")
		return baseDamage + treeCount * treeDamageScale
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("whirling_damage", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("whirling_radius", level)
	}
}

const heroes = new Map<Unit, [Nullable<shredder_whirling_death>, number]>()

function entityCreated(entity: Entity) {
	if (!(entity instanceof shredder_whirling_death)) {
		return
	}
	const owner = entity.Owner
	if (owner === undefined || owner.IsIllusion) {
		return
	}
	if (!heroes.has(owner)) {
		heroes.set(owner, [entity, 0])
	}
}

function entityPositionChanged(entity: Entity) {
	if (!entity.IsValid || !(entity instanceof Hero) || entity.IsIllusion) {
		return
	}
	if (!entity.IsAlive || !heroes.has(entity)) {
		return
	}
	const abilityData = heroes.get(entity)!
	if (abilityData[0] === undefined) {
		heroes.delete(entity)
		return
	}
	let count = 0
	const trees = [...Trees, ...TempTrees]
	for (let i = trees.length - 1; i > -1; i--) {
		const tree = trees[i]
		if (!tree.IsAlive || entity.Distance2D(tree) > abilityData[0].AOERadius) {
			continue
		}
		count++
	}
	abilityData[1] = count
}

EventsSDK.on("EntityCreated", entity => entityCreated(entity), EventPriority.HIGH)

EventsSDK.on(
	"EntityPositionChanged",
	entity => entityPositionChanged(entity),
	EventPriority.HIGH
)

EventsSDK.on("EntityDestroyed", entity => {
	if (entity instanceof shredder_whirling_death) {
		for (const [hero, [ability]] of heroes) {
			if (ability === undefined || ability === entity) {
				heroes.delete(hero)
				break
			}
		}
	}
	if (entity instanceof Hero) {
		heroes.delete(entity)
	}
})
