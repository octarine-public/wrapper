import { EventsSDK, TrackingProjectile, ArrayExtensions, Unit, TickSleeper, Hero, LinearProjectile, Events } from "wrapper/Imports"
import { MenuState } from "./Menu"

export let all_units: Unit[] = []
export let proj_list: TrackingProjectile[] = []
let Sleep = new TickSleeper
let ignorelist: string[] = [
	"particles/units/heroes/hero_skywrath_mage/skywrath_mage_concussive_shot.vpcf"
]
let proj_union: string[] = [
	"particles/units/heroes/hero_skywrath_mage/skywrath_mage_arcane_bolt.vpcf"
]

let Owner: Hero
let EnemyIsInAbilityPhase: string[] = [
	"skywrath_mage_ancient_seal",
	"necrolyte_reapers_scythe",
	"lina_laguna_blade",
	"sven_storm_bolt",
	"shadow_demon_demonic_purge",
	"pudge_dismember",
	"nyx_assassin_mana_burn",
	"doom_bringer_doom",
	"crystal_maiden_frostbite",
	"phantom_assassin_stifling_dagger",
	"phantom_lancer_spirit_lance",
	"bounty_hunter_shuriken_toss",
	"queenofpain_shadow_strike",
	"juggernaut_omni_slash",
]
// ability or items for IsInside
function UseAbility(unit: Unit, length: number) {
	if (!unit.IsEnemy()) {
		return false
	}
	let abil = Owner.GetAbilityByName("antimage_counterspell")
	return EnemyIsInAbilityPhase.some(abil_ => {
		let abils = unit.GetAbilityByName(abil_)
		if (Sleep.Sleeping || abils === undefined || !abils.IsInAbilityPhase) {
			return false
		}
		Owner.CastNoTarget(abil)
		Sleep.Sleep(length * 5)
		return true
	})
}
function UseProjectile(unit: Unit, length: number) {
	let abil = unit.GetAbilityByName("antimage_counterspell")
	if (abil === undefined || !abil.CanBeCasted()) {
		return false
	}
	proj_list.some(proj => {
		if (ignorelist.includes(proj.ParticlePath))
			return false
		let target_proj = proj.Target as Unit,
			HullRadius = unit.HullRadius + target_proj.HullRadius,
			Dist = (unit.Distance(proj.Position) + HullRadius) / proj.Speed
		//console.log("1: ", proj.Position)
		if (proj_union.includes(proj.ParticlePath))
			Dist -= 0.3

		if (Dist >= 0.3 || target_proj !== unit || Sleep.Sleeping) {
			return false
		}
		//console.log("2: ", Dist)
		unit.CastNoTarget(abil)
		Sleep.Sleep(length * 5)
		return true
	})
	//console.log(proj_list.length);
}

EventsSDK.on("Tick", () => {
	if (!MenuState.value)
		return
	// if (all_units.some((unit, i) => unit.IsControllable && (UseProjectile(unit, i) /*|| UseAbility(unit, i)*/)))
	// 	return
})

EventsSDK.on("EntityCreated", x => {
	if (x instanceof Unit)
		all_units.push(x)
})
EventsSDK.on("GameStarted", (hero) => {
	if (Owner === undefined) {
		Owner = hero
	}
})
EventsSDK.on("EntityDestroyed", x => {
	if (x instanceof Unit)
		ArrayExtensions.arrayRemove(all_units, x)
})
export function GameEnded() {
	all_units = []
	proj_list = []
}
// EventsSDK.on("TrackingProjectileCreated", (proj: TrackingProjectile) => {
// 	if (proj instanceof TrackingProjectile && proj.IsValid)
// 		proj_list.push(proj)
// })

// EventsSDK.on("TrackingProjectileDestroyed", (proj: TrackingProjectile) => {
// 	if (proj.IsAttack)
// 		return;
// 	//console.log("TrackingProjectileDestroyed", proj.ID);
// 	const id = proj_list.indexOf(proj);
// 	//console.log("id: ", id);
// 	if (id !== -1) {
// 		//console.log("before: ", proj_list.length);
// 		proj_list.splice(id, 1)
// 		//console.log("after: ", proj_list.length);

// 	}
// 	ArrayExtensions.arrayRemove(proj_list, proj);
// 	//console.log("TrackingProjectileDestroyed", proj);
// })



EventsSDK.on("GameEnded", GameEnded)