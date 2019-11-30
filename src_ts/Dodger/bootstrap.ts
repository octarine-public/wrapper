// import { EventsSDK, TrackingProjectile, ArrayExtensions, Unit, TickSleeper, Game } from "wrapper/Imports"
// import { MenuState, MyAbility, MenuAbility } from "Menu"

// let Sleep = new TickSleeper
// const MyAbility_union = [
// 	"phantom_lancer_doppelwalk",
// ]
// const projList: string[] = [
// 	// items
// 	"particles/items2_fx/rod_of_atos_attack.vpcf",
// 	"particles/items4_fx/nullifier_proj.vpcf",
// 	"particles/items_fx/ethereal_blade.vpcf",
// 	"particles/units/heroes/hero_sven/sven_spell_storm_bolt.vpcf",
// 	"particles/items5_fx/clumsy_net_proj.vpcf",
// 	// wrath king
// 	"particles/units/heroes/hero_skeletonking/skeletonking_hellfireblast.vpcf",
// 	"particles/econ/items/wraith_king/wraith_king_ti6_bracer/wraith_king_ti6_hellfireblast.vpcf",
// 	// abaddon
// 	"particles/units/heroes/hero_abaddon/abaddon_death_coil.vpcf",
// 	"particles/econ/items/abaddon/abaddon_alliance/abaddon_death_coil_alliance.vpcf",
// 	// alchim
// 	"particles/units/heroes/hero_alchemist/alchemist_unstable_concoction_projectile.vpcf",
// 	// Sniper
// 	"particles/units/heroes/hero_sniper/sniper_assassinate.vpcf",
// 	// Bounty hanter
// 	"particles/units/heroes/hero_bounty_hunter/bounty_hunter_shuriken_dummy.vpcf",
// 	// Brood
// 	"particles/units/heroes/hero_broodmother/broodmother_web_cast.vpcf",
// 	// Medusa
// 	"particles/units/heroes/hero_medusa/medusa_mystic_snake_projectile.vpcf",
// 	"particles/units/heroes/hero_medusa/medusa_mystic_snake_projectile_initial.vpcf",
// 	// Queen 
// 	"particles/units/heroes/hero_queenofpain/queen_shadow_strike.vpcf",
// 	"particles/econ/items/queen_of_pain/qop_ti8_immortal/queen_ti8_shadow_strike.vpcf",
// 	"particles/econ/items/queen_of_pain/qop_ti8_immortal/queen_ti8_golden_shadow_strike.vpcf",
// 	// Skywrath
// 	"particles/units/heroes/hero_skywrath_mage/skywrath_mage_arcane_bolt.vpcf",
// 	"particles/econ/items/skywrath_mage/skywrath_ti9_immortal_back/skywrath_mage_ti9_arcane_bolt.vpcf",
// 	"particles/econ/items/skywrath_mage/skywrath_ti9_immortal_back/skywrath_mage_ti9_arcane_bolt_crimson.vpcf",
// 	// Pantom assasin
// 	"particles/units/heroes/hero_phantom_assassin/phantom_assassin_stifling_dagger.vpcf",
// 	"particles/econ/items/phantom_assassin/phantom_assassin_arcana_elder_smith/phantom_assassin_stifling_dagger_arcana.vpcf",
// 	"particles/econ/items/phantom_assassin/pa_ti8_immortal_head/pa_ti8_immortal_stifling_dagger.vpcf",
// 	// Lancer
// 	"particles/units/heroes/hero_phantom_lancer/phantomlancer_spiritlance_projectile.vpcf",
// 	"particles/econ/items/phantom_lancer/phantom_lancer_immortal_ti6/phantom_lancer_immortal_ti6_spiritlance.vpcf",
// 	// Chaos
// 	"particles/units/heroes/hero_chaos_knight/chaos_knight_chaos_bolt.vpcf",
// 	// Morph
// 	"particles/units/heroes/hero_morphling/morphling_adaptive_strike_agi_proj.vpcf",
// 	"particles/units/heroes/hero_morphling/morphling_adaptive_strike_str_proj.vpcf",
// 	// Naga
// 	"particles/units/heroes/hero_siren/siren_net_projectile.vpcf",
// 	// venge
// 	"particles/units/heroes/hero_vengeful/vengeful_magic_missle.vpcf",
// 	"particles/econ/items/vengeful/vs_ti8_immortal_shoulder/vs_ti8_immortal_magic_missle.vpcf",
// 	"particles/econ/items/vengeful/vs_ti8_immortal_shoulder/vs_ti8_immortal_magic_missle_crimson.vpcf",
// 	// Ogre mage
// 	"particles/units/heroes/hero_ogre_magi/ogre_magi_ignite.vpcf",
// 	// oracle
// 	"particles/units/heroes/hero_oracle/oracle_fortune_prj.vpcf",
// 	"particles/econ/items/oracle/oracle_fortune_ti7/oracle_fortune_ti7_proj.vpcf",
// 	// Visage
// 	"particles/units/heroes/hero_visage/visage_soul_assumption_bolt.vpcf",
// 	// Windranger
// 	"particles/units/heroes/hero_windrunner/windrunner_shackleshot.vpcf",
// 	"particles/econ/items/windrunner/wr_ti8_immortal_shoulder/wr_ti8_shackleshot.vpcf",
// 	// Wyvern
// 	"particles/units/heroes/hero_winter_wyvern/wyvern_splinter.vpcf",
// 	// witch doctor
// 	"particles/units/heroes/hero_witchdoctor/witchdoctor_cask.vpcf",
// 	"particles/econ/items/witch_doctor/wd_ti8_immortal_bonkers/wd_ti8_immortal_bonkers_cask.vpcf",
// ]
// const proj_union: string[] = [
// 	// Chaos
// 	"particles/units/heroes/hero_chaos_knight/chaos_knight_chaos_bolt.vpcf",
// 	// Skywrath
// 	"particles/units/heroes/hero_skywrath_mage/skywrath_mage_arcane_bolt.vpcf",
// 	"particles/econ/items/skywrath_mage/skywrath_ti9_immortal_back/skywrath_mage_ti9_arcane_bolt.vpcf",
// 	"particles/econ/items/skywrath_mage/skywrath_ti9_immortal_back/skywrath_mage_ti9_arcane_bolt_crimson.vpcf",
// ]
// export let all_units: Unit[] = []
// export let proj_list: TrackingProjectile[] = []

// // // ability or items for IsInside
// // function UseAbility(unit: Unit, length: number) {
// // 	if (!unit.IsEnemy()) {
// // 		return false
// // 	}
// // 	let abil = Owner.GetAbilityByName("antimage_counterspell")
// // 	return EnemyIsInAbilityPhase.some(abil_ => {
// // 		let abils = unit.GetAbilityByName(abil_)
// // 		if (Sleep.Sleeping || abils === undefined || !abils.IsInAbilityPhase) {
// // 			return false
// // 		}
// // 		Owner.CastNoTarget(abil)
// // 		Sleep.Sleep(length * 5)
// // 		return true
// // 	})
// // }
// function UseProjectile(unit: Unit, length: number) {
// 	// if (LocalPlayer !== undefined)
// 	// 	if (unit === LocalPlayer.Hero)
// 	// 		unit.AbilitiesBook.Spells.map(e => {
// 	// 			if (e === undefined || e.IsHidden || e.IsPassive)
// 	// 				return false
// 	// 			console.log(e.Name)
// 	// 		})
// 	proj_list.some(proj => {
// 		if (!projList.includes(proj.ParticlePath))
// 			return false
// 		return MyAbility.map(ability => {
// 			let abil = ability.startsWith("_item") ? unit.GetItemByName(ability) : unit.GetAbilityByName(ability)
// 			if (abil === undefined || !abil.CanBeCasted() || !MenuAbility.IsEnabled(abil.Name)) {
// 				return false
// 			}
// 			console.log(abil.Name)
// 			let target_proj = proj.Target as Unit,
// 				HullRadius = unit.HullRadius + target_proj.HullRadius,
// 				Time = (unit.Distance(proj.Position) + HullRadius) / proj.Speed,
// 				TimeLeft = 0.3
// 			Time -= (Game.Ping / 2000) + 2
// 			if (proj_union.includes(proj.ParticlePath) || MyAbility_union.includes(abil.Name)) {
// 				Time -= abil?.CastPoint ?? 0 ? TimeLeft : abil.CastPoint - TimeLeft
// 			}
// 			if (Time >= TimeLeft || target_proj !== unit || Sleep.Sleeping) {
// 				return false
// 			}
// 			if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET)) {
// 				unit.CastNoTarget(abil)
// 			}
// 			if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT)) {
// 				unit.CastPosition(abil, unit.InFront(abil.CastRange))
// 			}
// 			Sleep.Sleep(length * 10)
// 			return true
// 		})
// 	})
// }

// EventsSDK.on("Tick", () => {
// 	if (!MenuState.value)
// 		return
// 	if (all_units.some((unit, i) => unit.IsControllable && (UseProjectile(unit, i) /*|| UseAbility(unit, i)*/)))
// 		return
// })

// EventsSDK.on("EntityCreated", x => {
// 	if (x instanceof Unit)
// 		all_units.push(x)
// })
// EventsSDK.on("EntityDestroyed", x => {
// 	if (x instanceof Unit)
// 		ArrayExtensions.arrayRemove(all_units, x)
// })
// export function GameEnded() {
// 	all_units = []
// 	proj_list = []
// }
// EventsSDK.on("TrackingProjectileCreated", (proj: TrackingProjectile) => {
// 	if (proj instanceof TrackingProjectile && proj.IsValid && !proj.IsAttack) {
// 		proj_list.push(proj)
// 	}
// })
// EventsSDK.on("TrackingProjectileDestroyed", (proj: TrackingProjectile) => {
// 	if (proj instanceof TrackingProjectile && proj.IsValid && !proj.IsAttack)
// 		ArrayExtensions.arrayRemove(proj_list, proj)
// })
// EventsSDK.on("GameEnded", GameEnded)