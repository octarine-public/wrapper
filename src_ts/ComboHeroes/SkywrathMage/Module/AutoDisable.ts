//@ts-nocheck
import { Ability, Entity, Hero, Item, Menu, TickSleeper, EntityManager } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { MyHero, initItemsMap, initAbilityMap } from "../Listeners"
import { AutoDisableAbilityItems, AutoDisableState, ComboKey, State } from "../Menu"

let Sleep = new TickSleeper(),
	ParticleHandler: Entity | number

function IsValidDisable(Name: Ability | Item, target: Hero, Selectror: Menu.ImageSelector) {
	return Name !== undefined
		&& Selectror.IsEnabled(Name.Name) && !Name.IsInAbilityPhase
		&& !Base.CancelAbilityRealm(target)
		&& Name.CanBeCasted() && MyHero.Distance2D(target) <= Name.CastRange
}
function ClearParticleHandler() {
	if (ParticleHandler !== undefined) {
		ParticleHandler = undefined
	}
}
export function AutoDisable() {
	if (!Base.IsRestrictions(State) || !AutoDisableState.value || ComboKey.is_pressed || Sleep.Sleeping) {
		return
	}
	if (MyHero === undefined) {
		return
	}
	let ParticleTaget = ParticleHandler as Hero,
		target = ParticleHandler === undefined
			? EntityManager.GetEntitiesByClass<Hero>(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY).find(x =>
				x.IsValid && x.IsVisible && x.IsAlive
				&& !x.IsIllusion
				&& Base.Disable(x) && !x.IsMagicImmune)
			: ParticleTaget.IsEnemy() && !ParticleTaget.IsMagicImmune
				&& ParticleTaget.IsVisible
				&& ParticleTaget.IsAlive ? ParticleTaget : undefined

	if (ParticleHandler) {
		setTimeout(() => ClearParticleHandler, 1000)
	}

	if (target === undefined) {
		return
	}
	let Items = initItemsMap.get(MyHero),
		Abilities = initAbilityMap.get(MyHero)

	if (Items === undefined || Abilities === undefined) {
		return
	}
	if (IsValidDisable(Items.Sheeps, target, AutoDisableAbilityItems)) {
		MyHero.CastTarget(Items.Sheeps, target)
		ParticleHandler = undefined
		Sleep.Sleep(Items.Tick)
		return
	}

	if (IsValidDisable(Items.Orchid, target, AutoDisableAbilityItems)) {
		MyHero.CastTarget(Items.Orchid, target)
		ParticleHandler = undefined
		Sleep.Sleep(Items.Tick)
		return
	}

	if (IsValidDisable(Items.Bloodthorn, target, AutoDisableAbilityItems)) {
		MyHero.CastTarget(Items.Bloodthorn, target)
		ParticleHandler = undefined
		Sleep.Sleep(Items.Tick)
		return
	}

	if (IsValidDisable(Abilities.AncientSeal, target, AutoDisableAbilityItems)) {
		MyHero.CastTarget(Abilities.AncientSeal, target)
		ParticleHandler = undefined
		Sleep.Sleep(Abilities.Tick)
		return
	}
	return
}
export function ParticleCreated(id: number, path: string, handle: bigint, attach: ParticleAttachment_t, target?: Entity | number) {
	if (target !== undefined && handle === 6400371855556675384n) {
		ParticleHandler = target
	}
}
export function AutoDisableDeleteVars() {
	Sleep.ResetTimer()
	ParticleHandler = undefined
}
