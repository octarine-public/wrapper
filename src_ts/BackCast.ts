import { Menu as MenuSDK, EventsSDK, Ability, LocalPlayer, Unit, ArrayExtensions, Entity } from "wrapper/Imports";
const Abilities: string[] = [
	"magnataur_skewer",
	"pudge_meat_hook",
	"windrunner_powershot",
	"death_prophet_carrion_swarm",
	"vengefulspirit_wave_of_terror",
	"rattletrap_hookshot",
	"mirana_arrow",
	"queenofpain_sonic_wave",
	"keeper_of_the_light_illuminate",
	"drow_ranger_wave_of_silence",
	"dragon_knight_breathe_fire",
	"nyx_assassin_impale",
	"earthshaker_fissure",
	"shredder_timber_chain",
	"jakiro_ice_path",
	"venomancer_venomous_gale",
	"weaver_the_swarm",
	"invoker_deafening_blast",
	"invoker_tornado",
	"jakiro_dual_breath",
	"jakiro_macropyre",
	"lina_dragon_slave",
	"lion_impale",
	"snapfire_scatterblast",
	"magnataur_shockwave",
	"phoenix_icarus_dive",
	"puck_illusory_orb",
	"shadow_demon_shadow_poison",
	"spectre_spectral_dagger",
	// "tidehunter_gush", // TODO: aghs only
	"tinker_march_of_the_machines",
	"ancient_apparition_ice_blast",
	"troll_warlord_whirling_axes_ranged",
	"earth_spirit_rolling_boulder",
	"elder_titan_earth_splitter",
]
const Menu = MenuSDK.AddEntry(["Utility", "Back Cast"])
const State = Menu.AddToggle("Enable")
const StateMiltiUnit = Menu.AddSwitcher("Multi units", ["Only your hero", "All Heroes"], 0)
const SuppAbils = Menu.AddImageSelector("Ability", Abilities, new Map(Abilities.map(name => [name, true])))

let Units: Unit[] = []
let SpellsReady: boolean = false
// let casted = false
// let order_pos = new Vector3
function IsReadyUnit(x: Unit): boolean {
	return x.IsEnemy() || !x.IsAlive || !x.IsHero || x.IsMoving
		|| !x.IsControllable || x.HasBuffByName("modifier_teleporting")
		|| x.IsStunned || x.IsHexed || x.IsIllusion || x.IsInvulnerable
}
EventsSDK.on("Tick", () => {
	if (!State.value || Units.length <= 0 || LocalPlayer === undefined) {
		return
	}
	Units.filter(x => {
		if (IsReadyUnit(x)) {
			return
		}
		if (StateMiltiUnit.selected_id === 0) {
			if (LocalPlayer.Hero !== x && Units.length >= 5) {
				ArrayExtensions.arrayRemove(Units, x)
				x = LocalPlayer.Hero
			}
		} else {
			if (LocalPlayer.Hero !== x && Units.length < 5) {
				Units.push(x)
			}
		}
	})
	SpellsReady = Units.some(unit => !unit.IsEnemy() && unit.IsAlive && unit.IsHero
		&& unit.IsControllable && !unit.IsMoving
		&& unit.Spells.filter(abil => abil !== undefined
			&& abil.CanBeCasted()
			&& SuppAbils.IsEnabled(abil.Name)
			&& Abilities.includes(abil.Name)).length > 0)
})
EventsSDK.on("PrepareUnitOrders", order => {
	if (!State.value || !SpellsReady || (StateMiltiUnit.selected_id !== 1 && order.Unit !== LocalPlayer?.Hero))
		return true
	let abil = order.Ability as Ability
	if (abil === undefined || !SuppAbils.IsEnabled(abil.Name))
		return true
	let target_pos = order.Target instanceof Entity ? order.Target.Position : order.Position
	order.Unit.CastPosition(abil, order.Unit.Position.Extend(target_pos, 1.3))
	return false
})
EventsSDK.on("EntityCreated", x => {
	if (x instanceof Unit)
		Units.push(x)
})
EventsSDK.on("EntityDestroyed", x => {
	if (x instanceof Unit)
		ArrayExtensions.arrayRemove(Units, x)
})
EventsSDK.on("GameEnded", () => {
	Units = []
	SpellsReady = false
})