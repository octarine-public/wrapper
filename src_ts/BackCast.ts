import { Menu as MenuSDK, EventsSDK, Ability, RendererSDK, Color, Game, Unit, LocalPlayer, ArrayExtensions } from "wrapper/Imports";
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
const Drawing = Menu.AddNode("Drawing")
const DrawingState = Drawing.AddToggle("State", true)
const SuppAbils = Menu.AddImageSelector("Ability", Abilities, new Map(Abilities.map(name => [name, true])))
const DrawingColorSize = Drawing.AddSlider("Text Size", 16, 12, 50)
const DrawingPositionX = Drawing.AddSlider("Text Pos X", 34, -100, 250)
const DrawingPositionY = Drawing.AddSlider("Text Pos Y", -20, -100, 250)
const DrawingColorText = Drawing.AddColorPicker("Text Color", new Color(0, 255, 0, 101))

let Units: Unit[] = []
let SpellsReady: boolean = false

function IsReadyUnit(x: Unit): boolean {
	return x.IsEnemy() || !x.IsAlive || !x.IsHero || x.IsMoving
		|| !x.IsControllable || x.HasBuffByName("modifier_teleporting")
		|| x.IsStunned || x.IsHexed || x.IsIllusion || x.IsInvulnerable
}
EventsSDK.on("Update", () => {
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

EventsSDK.on("Draw", () => {
	if (Units.length <= 0
		|| !State.value
		|| !DrawingState.value
		|| !Game.IsInGame
		|| !SpellsReady
		|| Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME) {
		return
	}
	Units.filter(unit => {
		if (unit.IsEnemy() || !unit.IsAlive || !unit.IsHero || !unit.IsControllable) {
			return
		}
		let wts = RendererSDK.WorldToScreen(unit.Position)
		if (wts === undefined || unit.IsMoving) {
			return
		}
		return RendererSDK.Text(
			"Back cast: ready",
			wts.SubtractScalarX(DrawingPositionX.value).SubtractScalarY(DrawingPositionY.value),
			DrawingColorText.Color, "Calibri", DrawingColorSize.value
		)
	})
})
EventsSDK.on("PrepareUnitOrders", (orders) => {
	if (Units.length <= 0 || !State.value || !SpellsReady || orders.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION) {
		return true
	}
	let abils = orders.Ability as Ability
	if (abils === undefined) {
		return true
	}
	if (!SuppAbils.IsEnabled(abils.Name)) {
		return true
	}
	let units_ = Units.filter(unit => !unit.IsEnemy() && unit.IsAlive
		&& unit.IsHero && unit.IsControllable && !unit.IsMoving)
	if (!units_.some(x => x.FindRotationAngle(orders.Position) > 0.4))
		return true
	units_.map(unit => {
		if (abils.CastRange + unit.CastRangeBonus < (orders.Position.Distance2D(unit.Position))) {
			return false
		}
		unit.CastPosition(abils, unit.Position.Add((orders.Position.Subtract(unit.Position)).Normalize().ScaleTo(1.3)))
		return true
	})
	return false
})
EventsSDK.on("GameEnded", () => {
	Units = []
	SpellsReady = false
})

EventsSDK.on("EntityCreated", x => {
	if (x instanceof Unit) {
		Units.push(x)
	}
})