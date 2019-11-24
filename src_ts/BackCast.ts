import { Menu as MenuSDK, EventsSDK, Ability, Hero, RendererSDK, Color, Game } from "wrapper/Imports";
const Abilities: string[] = [
	"magnataur_skewer",
	"terrorblade_sunder",
	"pudge_dismember",
	"crystal_maiden_crystal_nova",
	"warlock_upheaval",
	"sniper_assassinate",
	"phantom_lancer_doppelwalk",
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
	"magnataur_shockwave",
	"phoenix_icarus_dive",
	"puck_illusory_orb",
	"shadow_demon_shadow_poison",
	"spectre_spectral_dagger",
	"tidehunter_gush",
	"tinker_march_of_the_machines",
	"ancient_apparition_ice_blast",
	"troll_warlord_whirling_axes_ranged",
]
let ignore_list = [
	"tinker_march_of_the_machines",
	"sniper_shrapnel",
	"venomancer_plague_ward",
]
const Menu = MenuSDK.AddEntry(["Utility", "Back Cast"])
const State = Menu.AddToggle("Enable")
const Drawing = Menu.AddNode("Drawing")
const DrawingState = Drawing.AddToggle("State", true)
const SuppAbils = Menu.AddImageSelector("Ability", Abilities, new Map(Abilities.map(name => [name, true])))
const DrawingColorSize = Drawing.AddSlider("Text Size", 16, 12, 50)
const DrawingPositionX = Drawing.AddSlider("Text Pos X", 34, -100, 250)
const DrawingPositionY = Drawing.AddSlider("Text Pos Y", -20, -100, 250)
const DrawingColorText = Drawing.AddColorPicker("Text Color", new Color(0, 255, 0, 101))

let Owner: Hero = undefined
let SpellsReady: boolean = false

EventsSDK.on("Update", () => {
	if (!State.value || Owner === undefined) {
		return
	}
	SpellsReady = !Owner.IsMoving && Owner.Spells.filter(abil => abil !== undefined
		&& abil.CanBeCasted()
		&& SuppAbils.IsEnabled(abil.Name)
		&& Abilities.includes(abil.Name)).length > 0
})

EventsSDK.on("Draw", () => {
	if (Owner === undefined
		|| !State.value
		|| !DrawingState.value
		|| !Game.IsInGame
		|| !SpellsReady
		|| Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME) {
		return
	}
	let wts = RendererSDK.WorldToScreen(Owner.Position)
	if (wts === undefined) {
		return
	}
	RendererSDK.Text(
		"Back cast: ready",
		wts.SubtractScalarX(DrawingPositionX.value).SubtractScalarY(DrawingPositionY.value),
		DrawingColorText.Color, "Calibri", DrawingColorSize.value
	)
})
EventsSDK.on("PrepareUnitOrders", (orders) => {
	if (Owner === undefined || !State.value || !SpellsReady || orders.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION) {
		return true
	}
	let abils = orders.Ability as Ability
	if (abils === undefined) {
		return true
	}
	let abil_name = Owner.GetAbilityByName(abils.Name)
	if (abil_name === undefined || ignore_list.includes(abil_name.Name)) {
		return true
	}
	if (abils.CastRange + Owner.CastRangeBonus < (orders.Position.Distance2D(Owner.Position))) {
		return true
	}
	Owner.CastPosition(abils, Owner.Position.Add((orders.Position.Subtract(Owner.Position)).Normalize().ScaleTo(1.3)))
	return false
})
EventsSDK.on("GameStarted", (hero) => {
	if (Owner === undefined) {
		Owner = hero
	}
})
EventsSDK.on("GameEnded", () => {
	Owner = undefined
	SpellsReady = false
})