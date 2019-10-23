import { ArrayExtensions, Color, EventsSDK, Game, LocalPlayer, RendererSDK, Vector2, Vector3, Menu as MenuSDK, Utils, EntityManager, Unit } from "./wrapper/Imports"

const Menu = MenuSDK.AddEntry(["Utility", "Kunkka Autostacker"])
const State = Menu.AddToggle("State", false)
const Visuals = Menu.AddToggle("Draw visuals over stackable spots", false)
const DynamicYotkey = Menu.AddKeybind("Dynamic hotkey (reqires spot vision)")
DynamicYotkey.OnPressed(() => {
	const MyEnt = LocalPlayer.Hero,
		torrent = MyEnt.GetAbilityByName("kunkka_torrent"),
		torrent_radius = torrent.GetSpecialValue("radius")
	var ancients = EntityManager.AllEntities.filter(ent =>
		ent instanceof Unit
		&& ent.IsInRange(Utils.CursorWorldVec, 1000)
		&& ent.IsEnemy(MyEnt)
		&& ent.IsCreep
		&& !ent.IsLaneCreep
		// && !ent.IsWaitingToSpawn
	)
	var ancientsPosition = ancients.reduce((sum, ent) => sum.AddForThis(ent.Position), new Vector3()).DivideScalarForThis(ancients.length)
	var failed = ancients.some(ancient => ancient.Distance(ancientsPosition) >= torrent_radius)
	if (!failed) {
		console.log(ancientsPosition)
		MyEnt.CastPosition(torrent, ancientsPosition, false)
	} else
		console.log("can't stack it.")
})

// loop-optimizer: KEEP
var spots: Vector3[] = /*Utils.orderBy(*/[
		new Vector3(4205.449707, -399.444458, 384.000000),
		new Vector3(-2533.218750, -552.533875, 385.125000), // calibrated
		new Vector3(-1865.487549, 4438.296875, 386.390900), // calibrated
		new Vector3(2546.226563, 41.390625, 384.000000), // calibrated
		new Vector3(-4255.669922, 3469.897461, 256.000000), // calibrated
		new Vector3(-255.859379, -3266.130127, 384.000000), // calibrated
		new Vector3(424.332947, -4665.735352, 396.747070), // calibrated
		new Vector3(-3744.976563, 853.449219, 385.992188), // calibrated
	],
	is_stacking = false

EventsSDK.on("Draw", () => {
	if (!Visuals.value || !Game.IsInGame || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
		return
	spots.forEach((spot, i) => {
		let screen_pos = RendererSDK.WorldToScreen(spot)
		if (screen_pos === undefined)
			return
		RendererSDK.FilledRect(screen_pos.SubtractScalar(25), new Vector2(50, 50), new Color(255, 0, 0))
		RendererSDK.Text((i + 1).toString(), screen_pos, new Color(0, 255, 0))
	})
})
EventsSDK.on("Tick", () => {
	if (!State.value || is_stacking)
		return
	var MyEnt = LocalPlayer.Hero
	if (MyEnt === undefined)
		return
	var torrent = MyEnt.AbilitiesBook.GetAbilityByName("kunkka_torrent")
	if (torrent === undefined || !torrent.CanBeCasted())
		return

	var cur_time = Game.GameTime
	if (cur_time < 60)
		return
	/*if (
		Math.abs (
			(cur_time % 60) - 47
		) <= Fusion.MyTick
	)
		KunkkaAutoStack_Notify(cur_time)*/
	if (
		Math.abs (
			(cur_time % 60) -
			(60 - (torrent.CastPoint + torrent.GetSpecialValue("delay") + 0.6)), // it tooks ~0.6sec to raise y coord of creeps
		) >= 1 / 30
	)
		return

	var my_vec = MyEnt.NetworkPosition,
		cast_range = torrent.CastRange
	// loop-optimizer: KEEP
	ArrayExtensions.orderBy(spots.filter(spot => spot.Distance2D(my_vec) < cast_range), spot => spot.Distance2D(my_vec)).every(spot => {
		MyEnt.CastPosition(torrent, spot)
		is_stacking = true
		setTimeout(() => is_stacking = false, torrent.CastPoint * 1000 + 30)
		return false
	})
})

EventsSDK.on("PrepareUnitOrders", order => order.Unit !== LocalPlayer.Hero || !is_stacking) // cancel orders while stacking
