
// import { Ability, ArrayExtensions, Color, EventsSDK, Game, Hero, Item, Menu, ParticlesSDK, RendererSDK, Utils, Vector2, Vector3, GameSleeper, Creep, Tree, Entity, Team } from "wrapper/Imports"
// let sleeper = new GameSleeper();
// const menu = Menu.AddEntry(["Heroes", "Tinker"]),
// 	active = menu.AddToggle("Active"),
// 	binds = menu.AddNode("Keybinds"),
// 	comboKey = binds.AddKeybind("Combo Key"),
// 	spamKey = binds.AddKeybind("Spam rocket Key"),
// 	blinkKey = binds.AddKeybind("Blink Key"),
// 	debugKey = binds.AddKeybind("debug"),
// 	marshKey = binds.AddKeybind("Spam marsh Key"),
// 	optionHeroTinkerPanelKey = binds.AddKeybind("Panel Key"),
// 	rocketrearmFailsw = menu.AddToggle("Rocket and Rearm failswitch"),
// 	autoSoul = menu.AddToggle("Auto use soulring before r"),
// 	cursorRadius = menu.AddSlider("Nearest cursor radius", 200, 100, 1000),
// 	soulTresh = menu.AddSlider("HP Percent Threshold for soulring", 20, 0, 99),
// 	autop = menu.AddNode("Auto Pushing"),
// 	autoKey = autop.AddKeybind("Push Key"),
// 	autoMarsh = autop.AddSlider("N marshes", 2, 2, 4),
// 	TinkerPushModer = autop.AddSwitcher("Mode",["toggle","pressed"],0),
// 	linken_settings = menu.AddNode("Linken&Lotus settings"),
// 	popLinkV = linken_settings.AddToggle("Pop Linken"),
// 	popLinkItems = linken_settings.AddImageSelector(
// 		"Pop Linken with",
// 		[
// 			"tinker_laser",
// 			"item_sheepstick",
// 			"item_dagon_5",
// 			"item_nullifier",
// 			"item_cyclone",
// 			"item_rod_of_atos",
// 			"item_force_staff",
// 			"item_orchid",
// 			"item_bloodthorn",
// 			"item_hurricane_pike",

// 		],
// 	),
// 	bmcheck = linken_settings.AddToggle("Check BladeMail, Lotus, AM, Nyx"),
// 	blindn = menu.AddNode("Blink Settings"),
// 	blinkV = blindn.AddToggle("Enable Blink"),
// 	blinkRadius = blindn.AddSlider("Blink distance from enemy", 200, 0, 650),
// 	useP = blindn.AddToggle("Use Prediction", false, "Uses Prediction to blink in fog, blink distance may be ignored"),
// 	ability_items_settings = menu.AddNode("Abilities&Items"),
// 	soulRing = ability_items_settings.AddToggle("Enable SoulRing", true),
// 	abils = ability_items_settings.AddImageSelector(
// 		"Active abilities",
// 		[
// 			"tinker_laser",
// 			"tinker_heat_seeking_missile",
// 			"tinker_rearm",
// 		],
// 	),
// 	items = ability_items_settings.AddImageSelector(
// 		"Active items",
// 		[
// 			"item_sheepstick",
// 			"item_ethereal_blade",
// 			"item_dagon_5",
// 			"item_veil_of_discord",
// 			"item_orchid",
// 			"item_bloodthorn",
// 			"item_shivas_guard",
// 			"item_nullifier",
// 			"item_lotus_orb",
// 			"item_rod_of_atos",
// 			"item_guardian_greaves",
// 		],
// 	),
// 	helpF = ability_items_settings.AddToggle("Cast Lotus On Allies",true),
// 	etherD = ability_items_settings.AddToggle("Cast Laser Only in Ethereal", true),
// 	etherU = ability_items_settings.AddToggle("Stack Ethereal", true),
// 	drawable = menu.AddNode("Drawable"),
// 	drawTargetParticle = drawable.AddToggle("Draw line to target"),
// 	statusPosX = drawable.AddSlider("Position X (%)", 19, 0, 100),
// 	statusPosY = drawable.AddSlider("Position Y (%)", 4, 0, 100)

// let tinker: Hero,
// 	nearest: Hero,
// 	fountain: Vector3,
// 	target: Hero,
// 	heroes: Hero[] = [],
// 	fheroes: Hero[] = [],
// 	fcreeps: Creep[] = [],
// 	ecreeps: Creep[] = [],
// 	ncreeps: Creep[] = [],
// 	ftowers: Entity[] = [],
// 	trees: Tree[] = [],
// 		savespots: Vector3[] = [new Vector3(-7233, -1376, 384),
// 				new Vector3(-7200, -1017, 384),
// 				new Vector3(-7212, -551, 384),
// 				new Vector3(-7125, -81, 384),
// 				new Vector3(-7114, 337, 384),
// 				new Vector3(-7194, 732, 384),
// 				new Vector3(-7129, 1337, 384),
// 				new Vector3(-7140, 1645, 384),
// 				new Vector3(-7176, 2070, 384),
// 				new Vector3(-7089, 2307, 512),
// 				new Vector3(-6847, 3532, 384),
// 				new Vector3(-7226, 3989, 384),
// 				new Vector3(-6994, 4915, 384),
// 				new Vector3(-6900, 5118, 384),
// 				new Vector3(-6732, 5540, 384),
// 				new Vector3(-6581, 5919, 384),
// 				new Vector3(-6273, 6178, 384),
// 				new Vector3(-6104, 6542, 384),
// 				new Vector3(-5458, 6709, 384),
// 				new Vector3(-5130, 6783, 384),
// 				new Vector3(-4631, 6760, 384),
// 				new Vector3(-4308, 6977, 384),
// 				new Vector3(-3791, 6757, 384),
// 				new Vector3(-3497, 6873, 384),
// 				new Vector3(-3117, 6930, 384),
// 				new Vector3(-2696, 6878, 384),
// 				new Vector3(-2321, 6938, 384),
// 				new Vector3(-1731, 6864, 384),
// 				new Vector3(-1100, 6951, 384),
// 				new Vector3(-767, 7021, 384),
// 				new Vector3(-82, 6823, 384),
// 				new Vector3(183, 6728, 384),
// 				new Vector3(673, 6884, 384),
// 				new Vector3(1009, 6861, 384),
// 				new Vector3(1561, 6964, 384),
// 				new Vector3(2540, 6960, 384),
// 				new Vector3(3445, 6863, 384),
// 				new Vector3(7400, 2808, 384),
// 				new Vector3(7456, 2090, 256),
// 				new Vector3(7226, 866, 384),
// 				new Vector3(7029, 494, 384),
// 				new Vector3(7086, -37, 384),
// 				new Vector3(6850, -193, 384),
// 				new Vector3(7205, -493, 383),
// 				new Vector3(4987, -5374, 384),
// 				new Vector3(6918, -908, 384),
// 				new Vector3(7080, -1472, 384),
// 				new Vector3(7171, -1807, 384),
// 				new Vector3(7297, -2177, 384),
// 				new Vector3(7031, -3224, 384),
// 				new Vector3(6898, -3549, 384),
// 				new Vector3(7460, -4648, 384),
// 				new Vector3(6924, -4814, 384),
// 				new Vector3(6891, -5163, 384),
// 				new Vector3(6701, -5480, 384),
// 				new Vector3(6647, -5824, 384),
// 				new Vector3(6583, -6132, 384),
// 				new Vector3(6381, -6424, 384),
// 				new Vector3(6059, -6451, 384),
// 				new Vector3(6021, -6588, 384),
// 				new Vector3(5650, -6737, 384),
// 				new Vector3(5378, -6735, 384),
// 				new Vector3(4971, -6738, 384),
// 				new Vector3(4536, -6652, 384),
// 				new Vector3(4333, -6725, 384),
// 				new Vector3(3879, -6734, 384),
// 				new Vector3(3364, -6777, 384),
// 				new Vector3(3013, -6804, 384),
// 				new Vector3(2696, -6795, 384),
// 				new Vector3(2388, -6791, 384),
// 				new Vector3(1970, -6840, 384),
// 				new Vector3(1594, -6898, 384),
// 				new Vector3(1150, -6852, 384),
// 				new Vector3(759, -6957, 384),
// 				new Vector3(289, -6964, 384),
// 				new Vector3(-330, -6876, 384),
// 				new Vector3(-623, -6858, 384),
// 				new Vector3(-1073, -6927, 384),
// 				new Vector3(-2947, -6995, 256),
// 				new Vector3(-3990, -7001, 384),
// 				new Vector3(-530, -5611, 384),
// 				new Vector3(2463, -5622, 384),
// 				new Vector3(3951, -5522, 384),
// 				new Vector3(5655, -3890, 384),
// 				new Vector3(5565, -1369, 384),
// 				new Vector3(5690, 995, 384),
// 				new Vector3(2228, 2684, 256),
// 				new Vector3(2939, 1222, 256),
// 				new Vector3(1008, 1594, 256),
// 				new Vector3(489, 1282, 256),
// 				new Vector3(1283, 19, 256),
// 				new Vector3(-907, -1464, 256),
// 				new Vector3(-2041, -936, 256),
// 				new Vector3(-2490, -1083, 256),
// 				new Vector3(-1236, -1858, 256),
// 				new Vector3(-2032, -2420, 256),
// 				new Vector3(-2303, -2759, 256),
// 				new Vector3(-2832, -1435, 256),
// 				new Vector3(-3888, -2336, 256),
// 				new Vector3(-2676, 5523, 384),
// 				new Vector3(-1180, 5551, 384),
// 				new Vector3(-5025, 5136, 384),
// 				new Vector3(-5269, 5023, 384),
// 				new Vector3(-4234, 5335, 384),
// 				new Vector3(-3737, 5550, 384),
// 				new Vector3(4623, -5468, 384),
// 				new Vector3(2962, -5598, 383)],
// 	radiantSpot: Vector3[] = [new Vector3(-4620, 156, 256), new Vector3(-903, -4109, 384),	new Vector3(3670, -4655, 256), new Vector3(167, -3998, 384), new Vector3(-38,-2600, 256)],
// 	radiantCast: Vector3[] = [new Vector3(-4568, 252, 256),new Vector3(-1033, -3828, 256),new Vector3(3757, -4497, 256), new Vector3(100, -3847, 384), new Vector3(1, -2447, 256)],
// 	direSpot: Vector3[] = [new Vector3(3520, 155, 384), new Vector3(3377, 56, 384), new Vector3(-2406, 3738, 256),	new Vector3(474, 3788, 384), new Vector3(-992, 3061, 384), new Vector3(-1078.5,2815.9,384)],
// 	direCast: Vector3[] = [new Vector3(3696, 321, 384),  new Vector3(3592, 248, 384),   new Vector3(-2409, 3863, 256), new Vector3(583, 3650, 384), new Vector3(-921, 2952, 384), new Vector3(-927, 2891, 384)],
// 	_h: Hero,
// 	targetParticle: number,
// 	comboKeyPress = false,
// 	q: Ability,
// 	w: Ability,
// 	e: Ability,
// 	r: Ability,
// 	atos: Item,
// 	nullifier: Item,
// 	hex: Item,
// 	veil: Item,
// 	eblade: Item,
// 	dagon: Item,
// 	orchid: Item,
// 	blood: Item,
// 	shiva: Item,
// 	tpboots: Item,
// 	cyclone: Item,
// 	forcestaff: Item,
// 	hurricane: Item,
// 	soulring: Item,
// 	blink: Item,
// 	bottle: Item,
// 	lotus: Item,
// 	greaves: Item,
// 	debuffed = false,
// 	cshotparticle: number,
// 	ebladecasted: boolean,
// 	lastCheckTime: number[] = [0,0],
// 	pushstat: boolean,
// 	nextTick: number,
// 	status: string,
// 	a: RandomSource,
// 	lastTick: number,
// 	latency:number,
// 	ported:boolean,
// 	marched: number,
// 	TinkerPushDef: boolean,
// 	TinkerStatus: number,
// 	TinkerPushMode: boolean,
// 	TinkerPushCreeps: number,
// 	TinkerPushEnemies: number,
// 	TinkerPushAllies: number,
// 	TinkerJungle: boolean,
// 	TinkerPushSave: boolean,
// 	TinkerPusher: boolean,
// 	TinkerPanelX: number,
// 	TinkerPanelY: number,
// 	TinkerPushJungle: boolean,
// 	TinkerJungleFarmPos:Vector3[],
// 	Toggler: boolean,
// 	farmp: number,
// 	jungTick:number

// EventsSDK.on("GameStarted", hero => {
// 	if (hero instanceof Hero && !hero.IsEnemy() && hero.Name == "npc_dota_hero_tinker") {
//     if (hero === undefined)
//         return false;
// 	tinker = hero
// 	getAbils()
// 	fountain = (tinker.Team!==undefined && tinker.Team == 2)?new Vector3(-7167, - 6646, 520):new Vector3(7036, 6434, 520)
// 	pushstat = false
// 	TinkerStatus = 0
// 	TinkerPusher = false
// 	ported = false
// 	TinkerJungle = false
// 	marched = 0
// 	TinkerPanelX = 0
// 	TinkerPanelY = 0
// 	TinkerPushMode = false
// 	TinkerPushCreeps = 3
// 	TinkerPushEnemies = 0
// 	TinkerPushAllies = 0
// 	TinkerPushJungle = true
// 	TinkerPushSave = true
// 	TinkerPushDef = true
// 	}
// })
// EventsSDK.on("EntityDestroyed", ent => {
// 	if (ent instanceof Hero) {
// 		ArrayExtensions.arrayRemove(heroes, ent)
// 	}
// 	if (ent instanceof Creep) {
// 		ArrayExtensions.arrayRemove(fcreeps, ent)
// 		ArrayExtensions.arrayRemove(ecreeps, ent)
// 	}
// 	if (ent instanceof Tree) {
// 		ArrayExtensions.arrayRemove(trees, ent)
// 	}
// 	if (ent instanceof Creep && ent.Team === Team.Neutral ) {
// 		ArrayExtensions.arrayRemove(ncreeps, ent)
// 	}
// })
// EventsSDK.on("EntityCreated", npc => {
// 	if (npc instanceof Hero && !npc.IsIllusion) {
// 		if (npc.IsEnemy()) {
// 			heroes.push(npc)
// 		}
// 		else if (npc.IsAlive && !npc.IsEnemy()) {
// 			fheroes.push(npc)
// 		}
// 	}
// 	if (npc instanceof Creep && npc.Team === Team.Neutral) {
// 		ncreeps.push(npc)
// 	}
// 	if (npc instanceof Creep && npc.IsLaneCreep) {
// 		if (!npc.IsEnemy()) {
// 			fcreeps.push(npc)
// 		}
// 		else if (npc.IsEnemy()) {
// 			ecreeps.push(npc)
// 		}
// 	}
// 	if (npc instanceof Tree)
// 	{
// 		trees.push(npc)
// 	}

// })
// EventsSDK.on("GameEnded", () => {
// 	sleeper.FullReset();
// 	tinker = undefined
// 	heroes = []
// 	fheroes = []
// 	nearest = undefined
// 	fountain = undefined
// 	fcreeps = []
// 	ecreeps = []
// 	ncreeps = []
// 	trees = []
// 	_h = undefined
// 	target = undefined
// 	comboKeyPress = false
// 	q = undefined
// 	w = undefined
// 	status = undefined
// 	e = undefined
// 	r = undefined
// 	atos = undefined
// 	nullifier = undefined
// 	hex = undefined
// 	veil = undefined
// 	eblade = undefined
// 	dagon = undefined
// 	orchid = undefined
// 	pushstat = undefined
// 	blood = undefined
// 	tpboots = undefined
// 	shiva = undefined
// 	cyclone = undefined
// 	forcestaff = undefined
// 	hurricane = undefined
// 	soulring = undefined
// 	blink = undefined
// 	ebladecasted = undefined
// 	debuffed = false
// 	lotus = undefined
// 	greaves = undefined
// 	nextTick = undefined
// 	lastCheckTime = undefined
// 	if (targetParticle !== undefined) {
// 		ParticlesSDK.Destroy(targetParticle, true)
// 		targetParticle = undefined
// 	}
// })
// EventsSDK.on("PrepareUnitOrders", order => {
// 	if (!active.value || !Game.IsInGame || Game.IsPaused || tinker === undefined || !tinker.IsAlive)
// 	{
// 		return
// 	}
// 	else
// 	{
// 	if (order.Unit === tinker && order.OrderType === dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET) {
// 		if ((order.Ability as Ability).Name === "tinker_heat_seeking_missile" && rocketrearmFailsw) {
// 			if (_h == undefined || _h.IsMagicImmune) return false;
// 		}
// 		if ((order.Ability as Ability).Name === "tinker_rearm") {
// 			getAbils()
// 			getItems()
// 			let dy = false
// 			if (tinker.Items.some(e => e && !e.IsReady && e.Name != "item_bottle") || !q.IsReady || !w.IsReady || !e.IsReady) dy = true
// 			if (rocketrearmFailsw && dy == false) {
// 				return false;
// 			}
// 			if (autoSoul && soulring && soulring.IsReady) {
// 				tinker.OrderStop()
// 				tinker.CastNoTarget(soulring)
// 				order.Execute()
// 			}
// 		}
// 	}
// 	}
// 	return true
// })
// function spaM()
// {
// 	{
// 		if (!r.IsChanneling && _h !== undefined){// && !_h.IsMagicImmune && _h.IsVisible) {
// 			if (soulRing.value && soulring && soulring.CanBeCasted() && (tinker.HP/tinker.MaxHP*100 > soulTresh.value)) {
// 				tinker.CastNoTarget(soulring)
// 			}
// 			tinker.CastNoTarget(w)
// 			if (greaves && greaves.CanBeCasted() && items.IsEnabled("item_guardian_greaves"))
// 			{
// 				tinker.CastNoTarget(greaves)
// 			}
// 			if (r.CanBeCasted() && needRearm) {
// 				tinker.CastNoTarget(r);
// 				sleeper.Sleep(r.GetSpecialValue("channel_tooltip", r.Level) * 1000, "spam");
// 				return
// 			}
// 		}

// 	}
// }
// function fastBlink() {
// 	if (!r.IsChanneling) {
// 		if (blink.IsReady) {
// 			tinker.CastPosition(blink, Utils.CursorWorldVec, false, true)

// 		}
// 		else {
// 			if (soulRing.value && soulring !== undefined && soulring.CanBeCasted() && tinker.HP / tinker.MaxHP * 100 > soulTresh.value) tinker.CastNoTarget(soulring)
// 			if (r.CanBeCasted()) {
// 				tinker.CastNoTarget(r, false)
// 				sleeper.Sleep(r.GetSpecialValue("channel_tooltip", r.Level) * 1000+100, "blinker")
// 				return;
// 			}
// 		}
// 	}
// }
// function checkForTrees(vec: Vector3, range: number)
// {
// 	return trees.filter(Tree => Tree.IsInRange(vec, range) && Tree.IsAlive).length;
// }
// function mainCombo(target: Hero)
// {
// 	getItems()
// 	getAbils()
// 	if (target !== undefined && !sleeper.Sleeping("r")) {
// 		if (!target.IsAlive )
// 			target = undefined

// 		if (!target.IsMagicImmune) {

// 		if (!r.IsChanneling){
// 			if (bmcheck.value && target.ModifiersBook.HasAnyBuffByNames(["modifier_item_blade_mail_reflect","modifier_item_lotus_orb_active","modifier_antimage_counterspell","modifier_nyx_assassin_spiked_carapace"]) && !tinker.IsMagicImmune)
// 			{
// 				console.log("bmcheck")
// 				//target = undefined
// 				return false;

// 			}

// 			useBlink()
// 				if (popLinkV.value && target.HasLinkenAtTime()) {
// 				if (popLink(nullifier, popLinkItems.IsEnabled("item_nullifier"))) return
// 				if (popLink(cyclone, popLinkItems.IsEnabled("item_cyclone"))) return
// 				if (popLink(atos, popLinkItems.IsEnabled("item_rod_of_atos"))) return
// 				if (popLink(hex, popLinkItems.IsEnabled("item_sheepstick"))) return
// 				if (popLink(forcestaff, popLinkItems.IsEnabled("item_force_staff"))) return
// 				if (popLink(dagon, popLinkItems.IsEnabled("item_dagon_5"))) return
// 				if (popLink(orchid, popLinkItems.IsEnabled("item_orchid"))) return
// 				if (popLink(blood, popLinkItems.IsEnabled("item_bloodthorn"))) return
// 				if (popLink(q, popLinkItems.IsEnabled("tinker_laser"))) return
// 				if (popLink(hurricane, popLinkItems.IsEnabled("item_hurricane_pike"))) return
// 			}
// 			if (soulRing.value &&!sleeper.Sleeping("0")&& soulring && soulring.CanBeCasted() && (tinker.HP/tinker.MaxHP*100 > soulTresh.value)) {

// 				tinker.CastNoTarget(soulring)

// 			}
// 			if (shiva && shiva.CanBeCasted() && items.IsEnabled("item_shivas_guard")&&tinker.IsInRange(target, 800+tinker.CastRangeBonus))
// 			{
// 				tinker.CastNoTarget(shiva)

// 			}
// 			if (lotus && lotus.CanBeCasted() && items.IsEnabled("item_lotus_orb"))
// 			{
// 				if (helpF)
// 				{
// 					let xxxtentacion = ArrayExtensions.orderBy(fheroes.filter(hero => hero.Distance(tinker) <= 900+tinker.CastRangeBonus && hero.IsAlive && !hero.ModifiersBook.HasBuffByName("modifier_item_lotus_orb_active") ), ent => ent.Distance(Utils.CursorWorldVec))[0]
// 					let cast = (xxxtentacion != undefined)?tinker.CastTarget(lotus, xxxtentacion):tinker.CastTarget(lotus, tinker)

// 				}
// 				else
// 				{
// 					tinker.CastTarget(lotus, tinker)

// 				}
// 			}
// 			if (greaves && greaves.CanBeCasted() && items.IsEnabled("item_guardian_greaves"))
// 			{
// 				tinker.CastNoTarget(greaves)

// 			}
// 			if (hex &&  hex.CanBeCasted() && items.IsEnabled("item_sheepstick") && (!target.IsHexed||(Game.RawGameTime - lastCheckTime[0] )>(3.4-r.GetSpecialValue("channel_tooltip", r.Level))))
// 			{
// 				tinker.CastTarget(hex, target)
// 				lastCheckTime[0] = Game.RawGameTime

// 			}
// 			if (nullifier && nullifier.CanBeCasted() && items.IsEnabled("item_nullifier")&& !target.IsMuted)
// 			{
// 				tinker.CastTarget(nullifier, target)

// 			}
// 			if (orchid && orchid.CanBeCasted() && items.IsEnabled("item_orchid")&& !target.IsSilenced)
// 			{
// 				tinker.CastTarget(orchid, target)

// 			}
// 			if (blood && blood.CanBeCasted() && items.IsEnabled("item_bloodthorn") && !target.IsSilenced)
// 			{
// 				tinker.CastTarget(blood, target)

// 			}
// 			if (atos && atos.CanBeCasted() && items.IsEnabled("item_rod_of_atos"))
// 			{
// 				tinker.CastTarget(atos, target)

// 			}
// 			if (veil && veil.CanBeCasted() && items.IsEnabled("item_veil_of_discord"))
// 			{
// 				tinker.CastPosition(veil, target.Position)

// 			}
// 			if (eblade && eblade.CanBeCasted() && items.IsEnabled("item_ethereal_blade") && (etherU|| (Game.RawGameTime - lastCheckTime[1] )>(4.1-r.GetSpecialValue("channel_tooltip", r.Level)-tinker.Distance2D(target)/1275)))
// 			{
// 				tinker.CastTarget(eblade, target)
// 				lastCheckTime[1] = Game.RawGameTime

// 			}
// 			if (w.CanBeCasted() && abils.IsEnabled("tinker_heat_seeking_missile")&& target.IsVisible)
// 			{
// 			   tinker.CastNoTarget(w)

// 			}
// 			if (q.CanBeCasted() && tinker.IsInRange(target, q.CastRange) && abils.IsEnabled("tinker_laser"))
// 			{
// 			   tinker.CastTarget(q, target)
// 			}
// 			if (dagon  && dagon.CanBeCasted() && items.IsEnabled("item_dagon_5"))
// 			{
// 				(etherD&&eblade && Game.GameTime > lastCheckTime[1]+0.05+tinker.Distance2D(target)/1275) ? tinker.CastTarget(dagon, target):tinker.CastTarget(dagon, target)

// 			}
// 			if (r.CanBeCasted() && abils.IsEnabled("tinker_rearm") && needRearm && target.IsAlive)
// 			{
// 				tinker.CastNoTarget(r)
// 				sleeper.Sleep(r.GetSpecialValue("channel_tooltip", r.Level)*1000, "r")

// 			}
// 		}
// 	}
// 	}
// }
// function needRearm() {
// 	let bool = true
// 	if (hex && hex.CanBeCasted()) bool = false
// 	if (veil && veil.CanBeCasted()) bool = false
// 	if (eblade && eblade.CanBeCasted()) bool = false
// 	if (dagon && dagon.CanBeCasted()) bool = false
// 	if (orchid && orchid.CanBeCasted()) bool = false
// 	if (blood && blood.CanBeCasted()) bool = false
// 	if (shiva && shiva.CanBeCasted()) bool = false
// 	if (nullifier && nullifier.CanBeCasted()) bool = false
// 	if (q.CanBeCasted()) bool = false
// 	if (w.CanBeCasted()) bool = false
// 	if (e.CanBeCasted()) bool = false
// 	return bool
// }
// function useBlink() {
// 	let a = 0
// 	if (blinkV.value && blink !== undefined && blink.IsReady) {
// 		if (target.IsInRange(tinker, 600))
// 			return false
// 		let castRange = blink.GetSpecialValue("blink_range") + tinker.CastRangeBonus,
// 			distance = target.Position.Subtract(tinker.Position),
// 			disToTarget = tinker.Distance(target)
// 		distance.SetZ(0)
// 		distance.Normalize()
// 		if (disToTarget > castRange) {
// 			let di = disToTarget - castRange,
// 				minus = 0
// 			if (di < blinkRadius.value)
// 				minus = blinkRadius.value - di
// 			distance.ScaleTo(castRange - 1 - minus)
// 		} else {
// 			if (useP) a = target.IdealSpeed*r.GetSpecialValue("channel_tooltip", r.Level)
// 			distance.ScaleTo(disToTarget - blinkRadius.value - 1 + a)
// 		}
// 		tinker.CastPosition(blink, tinker.Position.Add(distance))
// 		return true
// 	}

// 	return false
// }
// function getAbils() {
// 	q = tinker.GetAbilityByName("tinker_laser")
// 	w = tinker.GetAbilityByName("tinker_heat_seeking_missile")
// 	e = tinker.GetAbilityByName("tinker_march_of_the_machines")
// 	r = tinker.GetAbilityByName("tinker_rearm")
// }
// function getItems() {
// 	atos = tinker.GetItemByName("item_rod_of_atos",false)
// 	nullifier = tinker.GetItemByName("item_nullifier",false)
// 	hex = tinker.GetItemByName("item_sheepstick",false)
// 	veil = tinker.GetItemByName("item_veil_of_discord",false)
// 	eblade = tinker.GetItemByName("item_ethereal_blade",false)
// 	dagon = tinker.GetItemByName(/item_dagon/,false)
// 	orchid = tinker.GetItemByName("item_orchid",false)
// 	blood = tinker.GetItemByName("item_bloodthorn",false)
// 	bottle = tinker.GetItemByName("item_bottle",false)
// 	shiva = tinker.GetItemByName("item_shivas_guard",false)
// 	cyclone = tinker.GetItemByName("item_cyclone",false)
// 	forcestaff = tinker.GetItemByName("item_force_staff",false)
// 	hurricane = tinker.GetItemByName("item_hurricane_pike",false)
// 	soulring = tinker.GetItemByName("item_soul_ring",false)
// 	blink = tinker.GetItemByName("item_blink",false)
// 	//	tpscroll = tinker.GetItemByName("item_tpscroll")
// 	greaves = tinker.GetItemByName("item_guardian_greaves",false)
// 	lotus = tinker.GetItemByName("item_lotus_orb",false)
// 	tpboots = tinker.GetItemByName(/item_travel_boots/,false)
// }
// function popLink(item: Item | Ability, val: boolean) {
// 	if (val && item !== undefined && item.IsReady) {
// 		tinker.CastTarget(item, target, false, false)
// 		return true
// 	}
// 	return false
// }
// EventsSDK.on("Tick", () => {
// 	/*fcreeps = fcreeps.filter(e=>e.IsAlive&&e.IsSpawned)
// 	ecreeps = ecreeps.filter(e=>e.IsAlive&&e.IsSpawned)
// 	ncreeps = ncreeps.filter(e=>e.IsAlive&&e.IsSpawned)*/
// 	if (!active.value || !Game.IsInGame || tinker === undefined || !tinker.IsAlive || sleeper.Sleeping("blinker") || sleeper.Sleeping("spam") || sleeper.Sleeping("r") )
// 		return false;
// 	nearest = ArrayExtensions.orderBy(heroes.filter(hero => hero.Distance(Utils.CursorWorldVec) <= cursorRadius.value && hero.IsAlive), ent => ent.Distance(Utils.CursorWorldVec))[0]

// 	latency= GetLatency(0)+GetLatency(1)
// 	getAbils()
// 	getItems()
// 	if (debugKey.is_pressed)
// 	{
// 		console.log("n: "+ncreeps.length)
// 		console.log("f: "+fcreeps.length)
// 		console.log("e:"+ecreeps.length)
// 	}
// 	if (  comboKey.is_pressed ) {
// 		target = nearest
// 		mainCombo(target)
// 		TinkerStatus = 1
// 	} else {

// 		target = undefined
// 		if (TinkerStatus ==1) TinkerStatus=0
// 	}
// 	_h = heroes.find(hero => hero.Distance(tinker) <= 2500+tinker.CastRangeBonus)
// 	if (blinkKey.is_pressed && blink && !sleeper.Sleeping("blinker") && !r.IsChanneling) fastBlink()
// 	if (spamKey.is_pressed && !sleeper.Sleeping("spam"))  spaM()
// })
// function amionf(){
// 	if (!tinker.IsAlive) return false
// 	if (tinker.IsInRange(fountain, 1700)) return true
// 	return false
// }
// EventsSDK.on("Update", cmd => {

// 	if (!active.value || !Game.IsInGame || Game.IsPaused || tinker === undefined || !tinker.IsAlive)
// 		return
// 	//TinkerJungle = false
// 	autoKey.OnPressed(()=> TinkerPusher = !TinkerPusher)
// 	if (TinkerPusher)
// 	{
// 		TinkerStatus = 2
// 		TinkerPush()
// 	}
// 	else if (TinkerStatus == 2)
// 	{
// 		TinkerStatus = 0
// 	}

// })
// EventsSDK.on("Draw", () => {
// 	if (!active.value || !Game.IsInGame  || tinker === undefined || !tinker.IsAlive)
// 		return

// 	if (drawTargetParticle.value) {
// 		if (targetParticle === undefined && (nearest !== undefined || target !== undefined)) {
// 			targetParticle = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, nearest)
// 		}
// 		if (targetParticle !== undefined) {
// 			if (nearest === undefined && target === undefined) {
// 				ParticlesSDK.Destroy(targetParticle, true)
// 				targetParticle = undefined
// 			} else {
// 				ParticlesSDK.SetControlPoint(targetParticle, 2, tinker.Position)
// 				ParticlesSDK.SetControlPoint(targetParticle, 6, new Vector3(1))
// 				ParticlesSDK.SetControlPoint(targetParticle, 7, (target || nearest).Position)
// 			}
// 		}
// 	}
// 	drawTinkerPanel()
// 	/*if (drawStatus.value && Game.UIState === DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME) {
// 		let tar: string="",
// 			disp: any,
// 			suc:string = "",
// 			col:Color,
// 			model:string = "Casts",
// 			sec:string="",
// 			thr:string = "",
// 			numh:number = 0;

// 		if (spamKey.is_pressed)
// 		{
// 			tar = "RocketSpam"
// 			disp = display(1)
// 			model = "Rocket Damage"
// 			thr = disp[1].toString()+" casts"
// 			numh = heroes.filter(hero => hero.Distance(tinker) <= 2500+tinker.CastRangeBonus && hero != undefined && !hero.IsMagicImmune && hero.IsVisible).length
// 			if (tinker.HasScepter&&numh>4){numh=4}
// 			else if (numh>2){numh=2}
// 			sec = (disp[0]*numh).toFixed(0)
// 		}
// 		disp = display(0)
//  		if (nearest !== undefined&& !nearest.IsMagicImmune && Math.round(disp[0])*disp[1]/tinker.Mana<=1){
// 			suc = " "+(Math.round(disp[0])*disp[1]/tinker.Mana*100).toFixed(2)+" %"
// 			col = new Color(68, 108, 179, 255)
// 		}
// 		else if (nearest !== undefined)
// 		{
// 			suc = "not enough "+(((Math.round(disp[0])*disp[1]/tinker.Mana)*100).toFixed(3))+" %"
// 			col = new Color(255,0,0,255)
// 		}
// 		else
// 		{
// 			suc = ""
// 		}
// 		let text = ["tinker", `Target: ${nearest !== undefined ? nearest.Name : tar}`, `${model}: ${nearest !== undefined ? disp[0].toFixed(3) : sec}`,`Mana: ${(nearest !== undefined)?suc : thr}`,`${Utils.CursorWorldVec.x}`, `${Utils.CursorWorldVec.y}`, `${Utils.CursorWorldVec.z}`,`pushstat${pushstat}`,`status: ${status}` ]
// 		const wSize = RendererSDK.WindowSize
// 		for (var _i = 0; _i < text.length; _i++) {
// 			let kal = (_i==3)?col:new Color(255, 255, 255, 255)
// 			RendererSDK.Text(
// 				text[_i],
// 				new Vector2(
// 					wSize.x / 100 * statusPosX.value,
// 					wSize.y / 100 * statusPosY.value + (_i * textSize.value),
// 				),
// 				kal
// 				,
// 				"Consolas",
// 				textSize.value,
// 			)
// 		}

// 	}*/

// })
// function display(mode: number){
// 	getItems()
// 	getAbils()

// 	if (nearest !== undefined && mode == 0)
// 	{
// 	let pipe = (nearest.GetItemByName("item_pipe"))?0.35:0
// 	let hood = (nearest.GetItemByName("item_hood_of_defiance"))?0.25:0
// 	let pipeac = ((pipe)&&nearest.GetItemByName("item_pipe").IsReady)?400:0
// 	let ebalo = eblade?0.4:0
// 	let hoodac = ((hood)&&nearest.GetItemByName("item_hood_of_defiance").IsReady)?325:0
// 	let mana = -150+tinker.ManaRegen*3/r.Level
// 	let damage_d = 0
// 	let lasere = 0
// 	if(q&&abils.IsEnabled("tinker_laser")) lasere= (q.GetSpecialValue("laser_damage") + tinker.GetTalentValue("special_bonus_unique_tinker")),	 mana = mana+q.ManaCost
// 	if (w&&abils.IsEnabled("tinker_heat_seeking_missile")){
// 	switch (w.Level) {
// 		case 1: {
// 		   damage_d = damage_d+125
// 		   break;
// 		}
// 		case 2: {
// 			damage_d = damage_d+200
// 		   break;
// 		}
// 		case 3: {
// 			damage_d = damage_d+275
// 			break;
// 		 }
// 		 case 4: {
// 			damage_d = damage_d+350
// 			break;
// 		 }
// 	 }
// 	 mana = mana+w.ManaCost
// 	}
// 	if (dagon&&items.IsEnabled("item_dagon_5"))		 damage_d=damage_d+dagon.GetSpecialValue("damage"),		 mana = mana+dagon.ManaCost
// 	let c = etherU?1:r.Level
// 	if (eblade&&items.IsEnabled("item_ethereal_blade"))		 damage_d = damage_d + (75 + 2*tinker.TotalIntellect)/(c), mana = mana+eblade.ManaCost/c
// 	if (shiva&&items.IsEnabled("item_shivas_guard")) damage_d= damage_d+200,	 mana = mana+shiva.ManaCost
// 	if (hex&&items.IsEnabled("item_sheepstick")) mana = mana+hex.ManaCost
// 	if (r&&abils.IsEnabled("tinker_rearm")) mana = mana+r.ManaCost
//  	let factd = damage_d*(1 + tinker.SpellAmplification)*((1 - 0.25) * (1 - nearest.Strength * 0.0008) * (1 - pipe) * (1 - hood) * (1+ ebalo))+lasere
// 	let number1 = ((nearest.HP +pipeac+hoodac))//*(1 - magicres))
// 	let number2 = factd
// 	//return Math.abs(Math.floor(number))
// 	return [number1/number2, mana]
// 	}
// 	else if (mode == 1)
// 	{
// 		let mana = -150+tinker.ManaRegen*3/r.Level+r.ManaCost
// 		let damage_d = 0
// 		switch (w.Level) {
// 			case 1: {
// 			   damage_d = damage_d+125
// 			   break;
// 			}
// 			case 2: {
// 				damage_d = damage_d+200
// 			   break;
// 			}
// 			case 3: {
// 				damage_d = damage_d+275
// 				break;
// 			 }
// 			 case 4: {
// 				damage_d = damage_d+350
// 				break;
// 			 }
// 		 }
// 		 mana = mana+w.ManaCost

// 		 return [damage_d*(tinker.SpellAmplification+1)*0.75, Math.round(tinker.Mana/mana)]
// 	}
// 	else return [,]
// }
// function TinkerIsFarmTupleAlive(num: number)
// {
// 	console.log("isfarmtuplealive")
// 	if (tinker.Team==2)
// 	{
// 		if (num == 0)
// 		{
// 			if (ncreeps.filter(e=>e.IsInRange(radiantSpot[0], 1778)).length>=3)
// 			{
// 				console.log("rad tuple0 alive")
// 				return true
// 			}
// 		}
// 		else if (num == 1)
// 		{
// 			if (ncreeps.filter(e=>e.IsInRange(radiantSpot[1], 1284)).length>=3)
// 			{
// 				console.log("rad tuple1 alive")
// 				return true
// 			}
// 		}
// 		else if (num ==2)
// 		{
// 			if (ncreeps.filter(e=>e.IsInRange(radiantSpot[2], 1432)).length>=3)
// 			{
// 				console.log("rad tuple2 alive")
// 				 return true
// 			}
// 		}
// 		else if (num ==3)
// 		{
// 			if (ncreeps.filter(e=>e.IsInRange(radiantSpot[3], 1084)).length>=3)
// 			{
// 				console.log("rad tuple 3 alive")
// 				return true
// 			}
// 		}
// 		else if (num ==4)
// 		{
// 			if (ncreeps.filter(e=>e.IsInRange(radiantSpot[4], 1087)).length>=3)
// 			{
// 				console.log("rad tuple 4 alive")
// 				return true
// 			}

// 		}

// 	}
// 	else
// 	{
// 		switch(num)
// 		{
// 			case 0:if (ncreeps.filter(e=>e.IsAlive&&e.IsInRange(direSpot[0], 1235)).length>=3) return true
// 			case 1:if (ncreeps.filter(e=>e.IsAlive&&e.IsInRange(direSpot[1], 1087)).length>=3) return true
// 			case 2:if (ncreeps.filter(e=>e.IsAlive&&e.IsInRange(direSpot[2], 1440)).length>=3) return true
// 			case 3:if (ncreeps.filter(e=>e.IsAlive&&e.IsInRange(direSpot[3], 1136)).length>=3) return true
// 			case 4:if (ncreeps.filter(e=>e.IsAlive&&e.IsInRange(direSpot[4], 1087)).length>=3) return true
// 			case 5:if (ncreeps.filter(e=>e.IsAlive&&e.IsInRange(direSpot[5], 1383)).length>=3) return true
// 		}
// 	}
// 	console.log("farmtuple return false")
// 	return false

// }
// function TinkerGetJunglePos()
// {
// 	console.log("TinkerGetJunglePos")

// 	if  (!tinker.IsAlive || !e || !r)  return
// 	let marchCount = 3
// 	//if tinker.talent("special_bonus_unique_tinker_2") && Ability.GetLevel(NPC.GetAbility(myHero, "special_bonus_unique_tinker_2")) > 0
// 	//	marchCount = 2
// 	let neededMana = r.ManaCost * (marchCount - 1) + e.ManaCost * marchCount
// 	if (soulRing && soulring) neededMana = neededMana - (marchCount * 150)
// 	if ( tinker.MaxMana < neededMana)
// 	{	console.log("mana return")
// 	  return
// 	}
// 	if ((Game.GameTime-jungTick)/60<1)
// 	{
// 		TinkerJungleFarmPos = []
// 		return
// 	}
// 	if (TinkerJungleFarmPos == undefined || TinkerJungleFarmPos[0]== undefined ||TinkerJungleFarmPos[1]== undefined)
// 	{
// 		if (tinker.Team == 2)
// 		{
// 			if (TinkerIsFarmTupleAlive(0) )
// 			{
// 					TinkerJungleFarmPos = [radiantSpot[0],radiantCast[0] ]
// 					return
// 			}
// 			else if (TinkerIsFarmTupleAlive(1) )
// 			{
// 					TinkerJungleFarmPos = [radiantSpot[1],radiantCast[1] ]
// 					return
// 			}
// 			else if (TinkerIsFarmTupleAlive(2))
// 			{
// 					TinkerJungleFarmPos =[radiantSpot[2],radiantCast[2] ]
// 					return
// 			}
// 			else if (TinkerIsFarmTupleAlive(3))
// 			{
// 					TinkerJungleFarmPos =[radiantSpot[3],radiantCast[3] ]
// 					return
// 			}
// 			else if (TinkerIsFarmTupleAlive(4))
// 			{
// 					TinkerJungleFarmPos =[radiantSpot[4],radiantCast[4] ]
// 					return
// 			}
// 			else
// 			{
// 				return
// 			}

// 		}
// 		else
// 		{
// 			if (TinkerIsFarmTupleAlive(0))
// 			{
// 				TinkerJungleFarmPos = [direSpot[0],direCast[0]]
// 			}
// 			else if (TinkerIsFarmTupleAlive(1))
// 			{
// 				TinkerJungleFarmPos = [direSpot[1],direCast[1] ]
// 			}
// 			else if (TinkerIsFarmTupleAlive(2))
// 			{
// 				TinkerJungleFarmPos = [direSpot[2],direCast[2] ]
// 			}
// 			else if (TinkerIsFarmTupleAlive(3))
// 			{
// 				TinkerJungleFarmPos = [direSpot[3],direCast[3] ]
// 			}
// 			else if (TinkerIsFarmTupleAlive(4))
// 			{
// 				TinkerJungleFarmPos = [direSpot[4],direCast[4] ]
// 			}
// 			else if (TinkerIsFarmTupleAlive(5))
// 			{
// 				TinkerJungleFarmPos = [direSpot[5],direCast[5] ]
// 			}
// 			else
// 			{
// 				return undefined
// 			}
// 		}
// 	}
// }
// function TinkerJungleFarm()
// {
// 	console.log("tjunglefarm")
// 	if (!tinker.IsAlive) return
// 	if (TinkerJungleFarmPos == undefined || TinkerJungleFarmPos.length == 0) return
// 	let movePos = TinkerJungleFarmPos[0]
// 	let castPos = TinkerJungleFarmPos[1]
// 	let marchCount = 3
// 	//	if NPC.HasAbility(myHero, "special_bonus_unique_tinker_2") && Ability.GetLevel(NPC.GetAbility(myHero, "special_bonus_unique_tinker_2")) > 0
// 	//		marchCount = 2

// 	if (!tinker.IsInRange(movePos,35))
// 	{
// 		if (blink && blink.CanBeCasted()&&!sleeper.Sleeping("blpush") && (tinker.Position.Distance2D(movePos) > 500 ))
// 		{
// 			if (tinker.Position.Distance2D(movePos) > 1190 )
// 			{
// 				let blinkPos = tinker.Position.Add((movePos.Subtract(tinker.Position)).Normalize().ScaleTo(1190))
// 				if (checkForTrees(blinkPos, 150)<1)
// 				{
// 					tinker.CastPosition(blink, blinkPos)
// 					lastTick = Game.RawGameTime + 0.11 + latency
// 					tinker.HoldPosition(tinker.Position,true)
// 					console.log("cast blink, 1177, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 					sleeper.Sleep(119,"blpush")
// 					return
// 				}
// 			}
// 			else
// 			{
// 				tinker.CastPosition(blink, movePos)
// 				tinker.HoldPosition(tinker.Position,true)
// 				lastTick = Game.RawGameTime + 0.11 + latency
// 				console.log("cast blink, 1187, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 				return
// 			}

// 		}
// 		tinker.MoveTo(movePos)
// 	}
// 	if (!tinker.IsMoving && tinker.IsInRange(movePos,35))
// 	{
// 		if (marched < marchCount)
// 		{
// 			if (e.CanBeCasted()&& e.IsReady&&!sleeper.Sleeping("epush"))
// 			{
// 				tinker.CastPosition(e, castPos)
// 				marched = marched + 1
// 				lastTick = Game.RawGameTime + 0.75 + latency
// 				console.log("cast e, 1200, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 				sleeper.Sleep(770+latency,"epush")
// 				return
// 			}
// 			else
// 			{
// 				if (r.CanBeCasted())
// 				{
// 					tinker.CastNoTarget(r)
// 					lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + 0.60 + latency
// 					console.log("cast r, 1210, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 					return
// 				}
// 				else
// 				{
// 					if (tpboots.CanBeCasted()&&tpboots.IsReady)
// 						tinker.CastPosition(tpboots, fountain)
// 						lastTick = Game.RawGameTime + 3.05 + latency
// 						jungTick = Game.GameTime+3.05+latency
// 						marched = 0
// 						TinkerJungle = false
// 						TinkerJungleFarmPos = []
// 						console.log("cast boot after jungle, 1218, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 						return
// 				}
// 			}

// 		}

// 		else
// 		{
// 			if (tpboots.CanBeCasted()&&tpboots.IsReady)
// 			{
// 				tinker.CastPosition(tpboots, fountain)
// 				lastTick = Game.RawGameTime + 3.05 + latency
// 				jungTick = Game.GameTime+3.05+latency
// 				marched = 0
// 				TinkerJungle = false
// 				TinkerJungleFarmPos = []
// 				console.log("cast boot after jungle, 1235, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 				return
// 			}
// 			else
// 			{
// 				if (r.CanBeCasted())
// 				{
// 					tinker.CastNoTarget(r)
// 					lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + 0.60 + latency
// 					console.log("cast r, 1248, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 					return
// 				}
// 			}
// 		}
// 	}
// 	return
// }
// function TinkerPush()
// {
// 	if (!tinker.IsAlive)
// 	{
// 		console.log("return 1267, rawgt: "+Game.RawGameTime)
// 		return
// 	}
// 	if (tinker.IsChanneling)
// 	{
// 		return
// 	}
// 	let mousePos = Utils.CursorWorldVec
// 	if (!tpboots )
// 	{
// 		console.log("return 1279, rawgt: "+Game.RawGameTime)
// 		return
// 	}
// 	if  (!e||e.Level<1)
// 	{
// 		console.log("return 1283, rawgt: "+Game.RawGameTime)
// 		return
// 	}
// 	if (Game.RawGameTime < lastTick)
// 	{
// 		return
// 	}
// 	else
// 	{
// 		if (tinker.IsMoving && TinkerJungle == false)
// 		{
// 			 tinker.HoldPosition(tinker.Position, false)
// 			 console.log("hold 1295")
// 		}
// 	}
// 	if (TinkerFarmDANGER())
// 	{
// 		if (TinkerPushDef)//tinkerPushDef - menu
// 		{
// 			if (ArrayExtensions.orderBy(heroes.filter(hero=>hero.IsAlive&&hero.IsInRange(tinker,750)),ent => ent.Distance(tinker))[0] != undefined)
// 			{
// 				let target = ArrayExtensions.orderBy(heroes.filter(hero=>hero.IsAlive&&hero.IsInRange(tinker,750)),ent => ent.Distance(tinker))[0]
// 				if (hex && hex.CanBeCasted())
// 				{
// 					tinker.CastTarget(hex, target)
// 					lastTick = Game.RawGameTime + 0.05 + latency
// 					return
// 				}
// 				if (eblade && eblade.CanBeCasted()&& !target.IsHexed)
// 				{
// 					tinker.CastTarget(eblade, target)
// 					lastTick = Game.RawGameTime + 0.05 + latency
// 					return
// 				}
// 				if (blood && blood.CanBeCasted()&& !target.IsHexed)
// 				{
// 					tinker.CastTarget(blood, target)
// 					lastTick = Game.RawGameTime + 0.05 + latency
// 					return
// 				}
// 				if (orchid && orchid.CanBeCasted()&& !target.IsHexed)
// 				{
// 					tinker.CastTarget(orchid, target)
// 					lastTick = Game.RawGameTime + 0.05 + latency
// 					return
// 				}
// 			}
// 		}
// 		if (blink && blink.CanBeCasted()&&!sleeper.Sleeping("blpush"))
// 		{
// 			let saveSpot = TinkerFarmGetSaveSpot(tinker, tinker)
// 			if (saveSpot != undefined && tinker.Distance2D(saveSpot) > 375)
// 			{
// 				tinker.CastPosition(blink, saveSpot)
// 				lastTick = Game.RawGameTime + 0.05 + latency
// 				console.log("cast blink, 1314, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 				sleeper.Sleep(119,"blpush")
// 				return
// 			}
// 			else
// 			{
// 				tinker.CastPosition(blink, (tinker.Position.Add(fountain.Subtract(tinker.Position))).Normalize().ScaleTo(1150))
// 				lastTick = Game.RawGameTime + 0.05 + latency
// 				console.log("cast blink, 1321, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 				sleeper.Sleep(119,"blpush")
// 				return
// 			}
// 		}
// 	}

// 	if (tinker.HasBuffByName("modifier_fountain_aura_buff") && amionf())
// 	{
// 		if (!e.IsReady || !tpboots.IsReady)
// 		{
// 			if (r.CanBeCasted())
// 				tinker.CastNoTarget(r)
// 				lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + 0.60 + latency
// 				console.log("cast r, 1334, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 				return
// 		}

// 		if (tinker.Mana / tinker.MaxMana > 0.8 )
// 		{
// 			if (ported)
// 			{
// 				ported = false
// 				TinkerJungleFarmPos = []
// 				TinkerJungle = false
// 				console.log("return 1372, rawgt: "+Game.RawGameTime)
// 				return
// 			}
// 		}
// 	}

// 	if  (!ported )
// 	{
// 		if (amionf())
// 		{
// 			if (tinker.Mana / tinker.MaxMana > 0.8 )
// 			{
// 				if (TinkerPort() != undefined)
// 				{
// 					if (tpboots.CanBeCasted()&&tpboots.IsReady)
// 					{
// 						tinker.CastPosition(tpboots, TinkerPort())
// 						lastTick = Game.RawGameTime + 3.05 + latency
// 						console.log("cast boot, 1365, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 						ported = true
// 						marched = 0
// 						return
// 					}
// 				}
// 				else
// 				{
// 					if (TinkerPushJungle)
// 					{
// 						TinkerGetJunglePos()
// 						if (TinkerJungleFarmPos!=undefined && TinkerJungleFarmPos[0]!=undefined && TinkerJungleFarmPos[1]!=undefined)
// 						{
// 							if (tpboots.CanBeCasted()&&tpboots.IsReady)
// 							{
// 								tinker.CastPosition(tpboots, TinkerJungleFarmPos[0])
// 								lastTick = Game.RawGameTime + 3.05 + latency
// 								console.log("cast boot to jngle, 1382, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 								ported = true
// 								TinkerJungle = true
// 								marched = 0
// 								return
// 							}
// 						}
// 					}
// 				}
// 			}
// 		}
// 		else
// 		{
// 			if (tinker.Mana / tinker.MaxMana > 0.6)
// 			{
// 				if (TinkerPort() != undefined)
// 				{
// 					if (tpboots.CanBeCasted()&&tpboots.IsReady)
// 						tinker.CastPosition(tpboots, TinkerPort())
// 						lastTick = Game.RawGameTime + 3.05 + latency
// 						console.log("cast boot, 1402, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 						ported = true
// 						marched = 0
// 						return
// 				}
// 				else
// 				{
// 					if (TinkerPushJungle)
// 					{
// 						TinkerGetJunglePos()
// 						if (TinkerJungleFarmPos != undefined  && TinkerJungleFarmPos[0]!=undefined && TinkerJungleFarmPos[1]!=undefined)
// 						{
// 							if (tpboots.CanBeCasted()&&tpboots.IsReady)
// 							{
// 								tinker.CastPosition(tpboots, TinkerJungleFarmPos[0])
// 								lastTick = Game.RawGameTime + 3.05 + latency
// 								console.log("cast boot to jngle, 1418, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 								ported = true
// 								TinkerJungle = true
// 								marched = 0
// 								return
// 							}
// 						}
// 					}
// 				}
// 			}
// 			else
// 			{
// 				if (tpboots.CanBeCasted()&&tpboots.IsReady)
// 					tinker.CastPosition(tpboots, fountain)
// 					lastTick = Game.RawGameTime + 3.05 + latency
// 					console.log("cast boot, 1433, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 					ported = false
// 					marched = 0
// 					TinkerJungle = false
// 					return
// 			}
// 		}

// 	}
// 	if (soulRing && soulring&& soulring.IsReady && soulring.CanBeCasted())
// 	{
// 			if (!amionf())
// 			{
// 				tinker.CastNoTarget(soulring,true)
// 				//tinker.HoldPosition(tinker.Position,true)
// 				lastTick = Game.RawGameTime + 0.15 + latency
// 				console.log("cast sr, 1440, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 				return
// 			}
// 			else
// 			{
// 				if (tinker.Mana / tinker.MaxMana > 0.7 )
// 				{
// 					tinker.CastNoTarget(soulring,true)
// 					//tinker.HoldPosition(tinker.Position,true)

// 					lastTick = Game.RawGameTime + 0.15 + latency
// 					console.log("cast sr, 1450, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 					sleeper.Sleep
// 					return
// 				}
// 			}
// 	}
// 	if (bottle && bottle.CurrentCharges>0&&!tinker.HasBuffByName("modifier_bottle_regeneration"))
// 	{
// 			let hpGap = tinker.HP / tinker.MaxHP
// 			let manaGap = tinker.Mana / tinker.MaxMana
// 			if (hpGap < 0.8 || manaGap < 0.8 && !sleeper.Sleeping("bpush"))
// 			{
// 				tinker.CastNoTarget(bottle)
// 				lastTick = Game.RawGameTime + 0.1 + latency
// 				console.log("cast bottle, 1475, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 				sleeper.Sleep(110+latency,"bpush")
// 				return
// 			}
// 	}

// 	let targetCreep:Creep = undefined
// 	let ecre = ecreeps.filter(Creep => Creep.IsInRange(tinker, 1350+tinker.CastRangeBonus))
// 	for (let unit of ecre)
// 	{
// 		if (TinkerPortGetCreepCount(tinker, 1250) >= 2 + marched)
// 		{
// 				targetCreep = unit
// 				break
// 		}
// 	}
// 	if (TinkerJungle)
// 	{
// 		TinkerJungleFarm()
// 	}
// 	else
// 	{
// 		if (targetCreep != undefined)
// 		{
// 			if (blink && blink.CanBeCasted() && !TinkerFarmAmISave() && !sleeper.Sleeping("blpush"))
// 			{
// 				let saveSpot = TinkerFarmGetSaveSpot(tinker, tinker)//targetCreep)
// 				if (saveSpot != undefined && tinker.Distance2D(saveSpot)>375)
// 				{
// 					tinker.CastPosition(blink, saveSpot)
// 					tinker.HoldPosition(tinker.Position)
// 					lastTick = Game.RawGameTime + 0.11 + latency
// 					console.log("cast blink, 1514, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 					sleeper.Sleep(119,"blpush")
// 					return
// 				}
// 			}
// 			if (marched <= autoMarsh.value)
// 			{
// 				if (e.CanBeCasted()&&!sleeper.Sleeping("epush"))
// 				{
// 					tinker.CastPosition(e, tinker.Position.Add((targetCreep.Position.Subtract(tinker.Position)).Normalize().ScaleTo(e.CastRange - 1)))
// 					lastTick = Game.RawGameTime + 0.75 + latency
// 					marched = marched + 1
// 					console.log("cast e, 1525, gametime: "+Game.RawGameTime+" lastTick: "+lastTick +" marched " + marched)
// 					sleeper.Sleep(770+latency,"epush")
// 					return
// 				}
// 				else
// 				{
// 					if (r.CanBeCasted())
// 					{
// 						tinker.CastNoTarget(r)
// 						lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + 0.60 + latency
// 						console.log("cast r, 1535, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 						return
// 					}
// 					else
// 					{
// 						if (tpboots.CanBeCasted())
// 						{
// 							tinker.CastPosition(tpboots, fountain)
// 							lastTick = Game.RawGameTime + 3.05 + latency
// 							console.log("cast e, 1544, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 							marched = 0
// 							return
// 						}
// 					}
// 				}
// 			}
// 			else
// 			{

// 					if (tinker.Mana / tinker.MaxMana < 0.6)
// 					{
// 						if (tpboots.CanBeCasted()&&tpboots.IsReady)
// 						{
// 							if (blink && blink.IsReady && !TinkerFarmAmISave() && !sleeper.Sleeping("blpush"))
// 							{
// 								let saveSpot = TinkerFarmGetSaveSpot(tinker, tinker)
// 								if (saveSpot != undefined && tinker.Distance2D(saveSpot)>375)
// 								{
// 									tinker.CastPosition(blink, saveSpot)
// 									tinker.HoldPosition(tinker.Position, true)
// 									lastTick = Game.RawGameTime + 0.11 + latency
// 									tinker.HoldPosition(tinker.Position, true)
// 									console.log("cast blink, 1607, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 									sleeper.Sleep(119,"blpush")
// 									return
// 								}
// 								else
// 								{
// 									tinker.CastPosition(blink, tinker.Position.Add((fountain.Subtract(tinker.Position)).Normalize().ScaleTo(1150)))
// 									tinker.HoldPosition(tinker.Position)
// 									lastTick = Game.RawGameTime + 0.11 + latency
// 									console.log("cast blink, 1614, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 									sleeper.Sleep(119,"blpush")
// 									return
// 								}
// 							}

// 							tinker.CastPosition(tpboots, fountain)
// 							lastTick = Game.RawGameTime + 3.05 + latency
// 							console.log("cast boot, 1621, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 							marched = 0
// 							return
// 						}
// 						else
// 						{
// 							if (r.CanBeCasted())
// 							{
// 								tinker.CastNoTarget(r)
// 								lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + 0.60 + latency
// 								console.log("cast r, 1631, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 								return
// 							}
// 						}

// 					}
// 					else
// 					{
// 						if (TinkerPort() != undefined)
// 						{
// 							if (tpboots.CanBeCasted()&&tpboots.IsReady)
// 							{
// 								if (blink && blink.CanBeCasted() && !TinkerFarmAmISave()&&!sleeper.Sleeping("blpush"))
// 								{
// 									let saveSpot = TinkerFarmGetSaveSpot(tinker, tinker)
// 									if (saveSpot != undefined && tinker.Distance2D(saveSpot)>375)
// 									{
// 										tinker.CastPosition(blink, saveSpot)
// 										tinker.HoldPosition(tinker.Position)
// 										lastTick = Game.RawGameTime + 0.11 + latency
// 										console.log("cast blink, 1650, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 										sleeper.Sleep(119,"blpush")
// 										return
// 									}
// 									else
// 									{
// 										tinker.CastPosition(blink, tinker.Position.Add((fountain.Subtract(tinker.Position)).Normalize().ScaleTo(1150)))
// 										tinker.HoldPosition(tinker.Position)
// 										lastTick = Game.RawGameTime + 0.11 + latency
// 										console.log("cast blink, 1657, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 										sleeper.Sleep(119,"blpush")
// 										return
// 									}
// 								}
// 								if (blink && blink.IsReady)
// 								{
// 									ported = false
// 									marched = 0
// 									return
// 								}
// 								else
// 								{
// 									tinker.CastPosition(tpboots, fountain)
// 									lastTick = Game.RawGameTime + 3.05 + latency
// 									console.log("cast boot, 1671, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 									marched = 0
// 									return
// 								}
// 							}
// 							else
// 							{
// 								if (r.CanBeCasted())
// 								{
// 									tinker.CastNoTarget(r)
// 									lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + 0.60 + latency
// 									console.log("cast r, 1682, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 									return
// 								}
// 							}
// 						}
// 						else
// 						{
// 							if (tpboots.CanBeCasted()&&tpboots.IsReady)
// 							{
// 								if (blink && blink.CanBeCasted() && !TinkerFarmAmISave()&&!sleeper.Sleeping("blpush"))
// 								{
// 									let saveSpot = TinkerFarmGetSaveSpot(tinker, tinker)
// 									if (saveSpot != undefined && tinker.Distance2D(saveSpot)>375)
// 									{
// 										tinker.CastPosition(blink, saveSpot)
// 										tinker.HoldPosition(tinker.Position, true)
// 										lastTick = Game.RawGameTime + 0.11 + latency
// 										console.log("cast blink, 1698, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 										sleeper.Sleep(119,"blpush")
// 										return
// 									}
// 									else
// 									{
// 										tinker.CastPosition(blink, tinker.Position.Add((fountain.Subtract(tinker.Position)).Normalize().ScaleTo(1150)))
// 										tinker.HoldPosition(tinker.Position, true)
// 										lastTick = Game.RawGameTime + 0.11 + latency
// 										console.log("cast blink, 1707, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 										sleeper.Sleep(119,"blpush")
// 										return
// 									}
// 								}
// 								tinker.CastPosition(tpboots, fountain)
// 								lastTick = Game.RawGameTime + 3.05 + latency
// 								console.log("cast boot, 1711, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 								marched = 0
// 								return
// 							}
// 							else
// 							{
// 								if (r.CanBeCasted())
// 								{
// 									tinker.CastNoTarget(r)
// 									lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + 0.60 + latency
// 									console.log("cast r, 1721, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 									return
// 								}
// 							}
// 						}
// 					}

// 			}
// 		}
// 		else
// 		{
// 			if (!amionf())
// 			{

// 					if (tinker.Mana / tinker.MaxMana < 0.6)
// 					{
// 						if (ported)
// 						{
// 							if (tpboots.CanBeCasted()&&tpboots.IsReady)
// 							{
// 								if (blink && blink.CanBeCasted() && !TinkerFarmAmISave()&&!sleeper.Sleeping("blpush"))
// 								{
// 									let saveSpot = TinkerFarmGetSaveSpot(tinker, tinker)
// 									if (saveSpot != undefined && tinker.Distance2D(saveSpot)>375)
// 									{
// 										tinker.CastPosition(blink, saveSpot)
// 										tinker.HoldPosition(tinker.Position, true)
// 										lastTick = Game.RawGameTime + 0.11 + latency
// 										console.log("cast blink, 1790, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 										sleeper.Sleep(119,"blpush")
// 										return
// 									}
// 									else
// 									{
// 										tinker.CastPosition(blink, tinker.Position.Add((fountain.Subtract(tinker.Position)).Normalize().ScaleTo(1150)))
// 										tinker.HoldPosition(tinker.Position, true)
// 										lastTick = Game.RawGameTime + 0.11 + latency
// 										console.log("cast blink, 1797, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 										sleeper.Sleep(119,"blpush")
// 										return
// 									}
// 								}
// 								tinker.CastPosition(tpboots, fountain)
// 								lastTick = Game.RawGameTime + 3.05 + latency
// 								console.log("cast boot, 1805, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 								marched = 0
// 								return
// 							}
// 							else
// 							{
// 								if (r.CanBeCasted())
// 								{
// 									tinker.CastNoTarget(r)
// 									lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + 0.60 + latency
// 									console.log("cast r, 1811, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 									return
// 								}
// 							}

// 						}
// 					}
// 					else
// 					{
// 						if (TinkerPort() != undefined)
// 						{
// 							if (tpboots.IsReady&& tpboots.CanBeCasted())
// 							{
// 								if (blink && blink.CanBeCasted() && !TinkerFarmAmISave()&&!sleeper.Sleeping("blpush"))
// 								{
// 									let saveSpot = TinkerFarmGetSaveSpot(tinker, tinker)
// 									if (saveSpot != undefined && tinker.Distance2D(saveSpot)>375)
// 									{
// 										tinker.CastPosition(blink, saveSpot)
// 										tinker.HoldPosition(tinker.Position)
// 										lastTick = Game.RawGameTime + 0.11 + latency
// 										console.log("cast blink, 1833, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 										sleeper.Sleep(119,"blpush")
// 										return
// 									}
// 									else
// 									{
// 										tinker.CastPosition(blink, tinker.Position.Add((fountain.Subtract(tinker.Position)).Normalize().ScaleTo(1150)))
// 										tinker.HoldPosition(tinker.Position)
// 										lastTick = Game.RawGameTime + 0.11 + latency
// 										console.log("cast blink, 1840, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 										sleeper.Sleep(119,"blpush")
// 										return
// 									}
// 								}
// 								if (blink && blink.IsReady)
// 								{
// 									ported = false
// 									marched = 0
// 									console.log("return 1875, rawgt: "+Game.RawGameTime)
// 									return
// 								}
// 								else
// 								{
// 									tinker.CastPosition(tpboots, fountain)
// 									lastTick = Game.RawGameTime + 3.05 + latency
// 									console.log("cast boot, 1854, gametime: "+Game.RawGameTime+" lastTick: "+lastTick+" marched: "+ marched)
// 									marched = 0
// 									return
// 								}
// 							}
// 							else
// 							{
// 								if (r.CanBeCasted())
// 								{
// 									tinker.CastNoTarget(r)
// 									lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + 0.60 + latency
// 									console.log("cast r, 1865, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 									return
// 								}
// 							}
// 						}
// 						else
// 						{
// 							if (ported)
// 							{
// 								if (tpboots.CanBeCasted()&&tpboots.IsReady)
// 								{
// 									if (blink && blink.CanBeCasted() && !TinkerFarmAmISave()&&!sleeper.Sleeping("blpush"))
// 									{
// 										let saveSpot = TinkerFarmGetSaveSpot(tinker, tinker)
// 										if (saveSpot != undefined && tinker.Distance2D(saveSpot)>375)
// 										{
// 											tinker.CastPosition(blink, saveSpot)
// 											tinker.OrderStop()
// 											lastTick = Game.RawGameTime + 0.1 + latency
// 											console.log("cast blink, 1883, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 											sleeper.Sleep(119,"blpush")
// 											return
// 										}
// 										else
// 										{
// 											tinker.CastPosition(blink, tinker.Position.Add((fountain.Subtract(tinker.Position)).Normalize().ScaleTo(1150)))
// 											tinker.OrderStop()
// 											lastTick = Game.RawGameTime + 0.1 + latency
// 											console.log("cast blink, 1890, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 											sleeper.Sleep(119,"blpush")
// 											return
// 										}

// 									}
// 									tinker.CastPosition(tpboots, fountain)
// 									lastTick = Game.RawGameTime + 3.05 + latency
// 									console.log("cast boot, 1897, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 									marched = 0
// 									return
// 								}
// 								else
// 								{
// 									if (r.CanBeCasted())
// 									{
// 										tinker.CastNoTarget(r)
// 										lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + 0.60 + latency
// 										console.log("cast r, 1907, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
// 										return
// 									}
// 								}
// 							}
// 						}
// 					}

// 			}
// 		}
// 	}
// 	//console.log("return 1948, rawgt: "+Game.RawGameTime)
// 	return
// }
// function TinkerFarmAmISave()
// {
// 	if (!tinker.IsAlive) return false
// 	let myPos = tinker.Position
// 	for (let enemy of heroes)
// 	{
// 		if (enemy.IsAlive && enemy != target && tinker.IsInRange(enemy, 200)) return false
// 	}
// 	for (let spot of savespots)
// 	{
// 		if (tinker.Distance2D(spot)<75) return true
// 	}
// 	if (checkForTrees(myPos, 250)>=4) return true
// 	return false
// }
// function TinkerFarmDANGER()
// {
// 	if (!tinker.IsAlive) return false
// 	if (amionf())  return false
// 	//if next(dodgeItTable) != nil  return true
// 	//if TargetGotDisableModifier(myHero, myHero) == true  return true
// 	if (tinker.IsSilenced || tinker.IsStunned || tinker.IsHexed)  return true
// 	for (let enema of heroes.filter(hero => hero.IsAlive && hero.IsInRange(tinker,888)))
// 		{
// 			if (tinker.IsInRange(enema, enema.AttackRange+140)) return true
// 		}
// 	return false
// }
// function TinkerFarmGetSaveSpot(myHero ,target)
// {
// 	if (!tinker.IsAlive) return
// 	if (!target)  return
// 	if (!blink)  return
// 	let targetPos = target.Position
// 	let myPos = myHero.Position
// 	for (let spot of savespots)
// 	{
// 		if (checkForTrees(spot, 251)>=3)
// 		{
// 			if(myPos.Distance2D(spot)>200 && myPos.Distance2D(spot)<1125+tinker.CastRangeBonus)
// 				{
// 					if (spot.Distance2D(targetPos)<1050+tinker.CastRangeBonus)
// 						return spot
// 				}
// 		}
// 	}
// 	let treeCount = 0
// 	let targetTree:Tree = undefined
// 	for (let t of trees.filter(e=>e.IsInRange(targetPos, 900)&&e.IsAlive))
// 	{
// 		if (myPos.Distance2D(t.Position)>315 &&myPos.Distance2D(t.Position)<1100)
// 			{
// 				let treesAround = checkForTrees(t.Position, 350)
// 				if (treesAround>treeCount)
// 					treeCount
// 					targetTree = t
// 			}
// 	}
// 	let treeTargetPos:Vector3 = undefined
// 	if (treeCount >= 4)
// 	{
// 		if (targetTree != undefined )
// 		{
// 			if (treeTargetPos.Distance2D(targetPos)<1000&&myPos.Distance2D(treeTargetPos)< 1125+tinker.CastRangeBonus && checkForTrees(treeTargetPos,400)>=3)
// 				treeTargetPos = targetTree.Position
// 		}
// 	}
// 	if (treeTargetPos != undefined )
// 	{
// 		if (checkForTrees(treeTargetPos,30)>0)
// 		{
// 			return ((treeTargetPos.Add(treeTargetPos.Subtract(tinker.Position))).Normalize().ScaleTo(35))
// 		}
// 		else
// 		{
// 			return treeTargetPos
// 		}
// 	}
// 	else
// 	{
// 		let myFountainPos = fountain
// 		let myDist = myPos.Distance2D(targetPos)
// 		let gap = 1050 - myDist
// 		let searchPosition = (myPos.Add(myFountainPos.Subtract(myPos))).Normalize().ScaleTo(gap)
// 		let treesArcoundPos = trees.filter(e=>e.IsAlive && e.IsInRange(searchPosition, gap))
// 		let myPosZ = myPos.z
// 		for (let t of treesArcoundPos)
// 		{
// 			if (myPos.Distance2D(t.Position)<1050)
// 			{
// 				if (t.Position.z>myPosZ && Math.abs(t.Position.z - myPosZ)>50)
// 				{
// 					return (myPos.Add(t.Position.Subtract(myPos))).ScaleTo(0.9)
// 				}
// 			}
// 		}

// 	}
// 	return
// }
// function TinkerPortGetCreepCount(target, range:number)
// {
// 	if (!tinker.IsAlive) return 0
// 	if (!target) return 0
// 	let count = 0
// 	for (let npc of ecreeps.filter(e=>e.IsAlive&&!e.IsWaitingToSpawn&&e.IsInRange(target, range)))
// 	{
// 		if (npc.HP/npc.MaxHP >0.6)
// 			count = count+1
// 	}
// 	return count
// }
// function TinkerPortGetHeroCount(target, range:number)
// {
// 	if (!tinker.IsAlive) return 0
// 	if (!target)return 0
// 	let count = heroes.filter(e=>e.IsAlive&&e.IsInRange(target, range)).length
// 	return count
// }
// function TinkerPort()
// {
// 	if (!tinker.IsAlive) return

// 		let targetCreep = undefined
// 		let creepCount = 0
// 		for (let npc of fcreeps.filter(e=>!e.IsWaitingToSpawn))
// 		{
// 			if (npc.HP/npc.MaxHP>=0.6&&fcreeps.filter(e=>e.IsInRange(npc, 600)).length>=1 && tinker.Distance2D(npc)>=1700)
// 			{
// 				if (TinkerPortGetCreepCount(npc, 1300)>=TinkerPushCreeps && TinkerPortGetHeroCount(npc,900)<=TinkerPushEnemies && fheroes.filter(e=>e.IsAlive&&e.IsInRange(npc,900)).length<=TinkerPushAllies)
// 				{
// 					if (TinkerPushSave)
// 					{
// 						if (!blink)
// 						{
// 							if (TinkerPortGetCreepCount(npc,1300)> creepCount)
// 							{
// 								creepCount = TinkerPortGetCreepCount(npc,1300)
// 								targetCreep = npc
// 							}
// 						}
// 						else
// 						{
// 							if (TinkerFarmGetSaveSpot(npc, npc)!=undefined)
// 							{
// 								if (TinkerPortGetCreepCount(npc, 1300)>creepCount)
// 								{
// 									creepCount = TinkerPortGetCreepCount(npc, 1300)
// 									targetCreep = npc
// 								}
// 							}
// 						}
// 					}
// 					else
// 					{
// 						if (TinkerPortGetCreepCount(npc, 1300) > creepCount )
// 						{
// 								creepCount = TinkerPortGetCreepCount(npc, 1300)
// 								targetCreep = npc
// 						}
// 					}
// 				}
// 			}
// 		if (targetCreep == undefined)
// 			creepCount = 0
// 		}
// 		if (targetCreep == undefined)
// 			creepCount = 0
// 		if (targetCreep != undefined )
// 			return targetCreep.Position

// 	return
// }
// function   drawTinkerPanel()
// {
// 	if (!active.value) return
// 	optionHeroTinkerPanelKey.OnPressed(()=>Toggler = !Toggler )
// 	if (Toggler) return
// 	let w = RendererSDK.WindowSize.x,
// 		h = RendererSDK.WindowSize.y
// 	TinkerPanelX = w / 100 * statusPosX.value
// 	TinkerPanelY = h/ 100* statusPosY.value
// 	let startX = TinkerPanelX
// 	let startY = TinkerPanelY

// 	let width = 140
// 	let height = 320
// 	RendererSDK.FilledRect(new Vector2(startX, startY), new Vector2(width, height), new Color(0, 0, 0, 125))
// 	RendererSDK.OutlinedRect(new Vector2(startX, startY), new Vector2(width, height), new Color(0, 0, 0, 255))
// 	RendererSDK.Text("PUSH OPTIONS", new Vector2(startX + 23, startY +7), new Color(255,0,0,255), "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 	RendererSDK.FilledRect(new Vector2(startX+1, startY+1), new Vector2( width-2, 20-2), new Color(0, 0, 0, 45))
// 	RendererSDK.Text("PUSH target", new Vector2(startX + 32, startY + 30 - 7), new Color(0, 191, 255, 255), "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 	//Wrap.DrawTextCentered(arcWardenfont, startX + width/2, startY + 30, "Push target", 1)
// 	//new Color(255, 255, 255, 45)
// 	RendererSDK.FilledRect(new Vector2(startX+1, startY+21), new Vector2(width-2, 20-2), new Color(255, 255, 255, 45))
// 	//RendererSDK.DrawFilledRect(startX+1, startY+21, width-2, 20-2)
// 	new Color(0, 0, 0, 255)
// 	RendererSDK.OutlinedRect(new Vector2(startX, startY+40), new Vector2( width/2, 20),new Color(0, 0, 0, 255) )
// 	RendererSDK.OutlinedRect(new Vector2(startX + width/2, startY+40), new Vector2( width/2, 20),new Color(0, 0, 0, 255) )
// 	// RendererSDK.OutlinedRect(new Vector2(startX, startY+40, width/2, 20)
// 	// RendererSDK.OutlinedRect(new Vector2(startX + width/2, startY+40, width/2, 20)

// 	let hoveringOverAuto = RendererSDK.CursorOnScreen.IsUnderRectangle(startX, startY+40, width/2, 20)

// 	let hoveringOverCursor = RendererSDK.CursorOnScreen.IsUnderRectangle(startX + width/2, startY+40, width/2, 20)
// 	if (!TinkerPushMode)
// 	{
// 		RendererSDK.Text("auto", new Vector2( startX + 21, startY + 40),new Color(0, 255, 0, 255), "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 		RendererSDK.Text("cursor", new Vector2(startX + 86, startY + 40),new Color(255, 255, 255, 75),"Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 	}
// 	else
// 	{
// 		RendererSDK.Text("auto", new Vector2( startX + 21, startY + 40),new Color(255, 255, 255, 75), "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 		RendererSDK.Text("cursor", new Vector2( startX + 86, startY + 40),new Color(0, 255, 0, 255), "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)

// 	}

// 	RendererSDK.Text("Auto line options", new Vector2( startX + 17, startY + 70-7), new Color(0, 191, 255, 255),"Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 	//Wrap.DrawTextCentered(arcWardenfont, startX + width/2, startY + 70, "Auto line options", 1)
// 	RendererSDK.FilledRect(new Vector2(startX+1, startY+61), new Vector2(width-2, 20-2), new Color(255, 255, 255, 45))
// 	//RendererSDK.DrawFilledRect(startX+1, startY+61, width-2, 20-2)

// 	RendererSDK.OutlinedRect(new Vector2(startX + width/4*3, startY+80), new Vector2( width/4, 20), new Color(0, 0, 0, 255))
// //	RendererSDK.OutlinedRect(new Vector2(startX + width/4*3, startY+80, width/4, 20)

// 	RendererSDK.Text("Min creeps", new Vector2( startX + 5, startY + 81), new Color(0, 255, 0, 255),"Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// //	RendererSDK.DrawText(arcWardenfont, startX + 5, startY + 81, "Min. creeps", 1)

// 	let hoveringOverCreeps = RendererSDK.CursorOnScreen.IsUnderRectangle(startX + width/4*3, startY+80, width/4, 20)
// 	let a:Color
// 	if (TinkerPushCreeps > 0) {
// 		if (!TinkerPushMode) {
// 			a =new Color(0, 255, 0, 255)
// 		}
// 		else
// 		{
// 			a =new Color(255, 255, 255, 75)
// 		}
// 		RendererSDK.Text(TinkerPushCreeps.toFixed(0),new Vector2(startX + width/4*3 + 18, startY + 81), a, "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)

// 	}
// 	else
// 	{
// 		RendererSDK.Text(TinkerPushCreeps.toFixed(0),new Vector2(startX + width/4*3 + 18, startY + 81), new Color(255, 255, 255, 75), "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 	}

// 	RendererSDK.OutlinedRect(new Vector2(startX + width/4*3, startY+100), new Vector2( width/4, 20), new Color(0, 0, 0, 255))
// 	//RendererSDK.OutlinedRect(new Vector2(,)

// 	RendererSDK.Text("Max enemies", new Vector2(startX + 5, startY + 101),new Color(0, 255, 0, 255), "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 	//RendererSDK.DrawText(arcWardenfont, startX + 5, startY + 101, "Max. enemies", 1)

// 	 let hoveringOverEnemies = RendererSDK.CursorOnScreen.IsUnderRectangle(startX + width/4*3, startY+100, width/4, 20)

// 	let b:Color
// 	if (TinkerPushEnemies > 0) {
// 		if (!TinkerPushMode) {
// 			b = new Color(255, 64, 64, 255)
// 		}
// 		else
// 		{
// 			b = new Color(255, 255, 255, 75)
// 		}
// 		RendererSDK.Text(TinkerPushEnemies.toFixed(0), new Vector2( startX + width/4*3 + 18, startY + 101), b, "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 	}
// 	else
// 	{
// 		RendererSDK.Text(TinkerPushEnemies.toFixed(0), new Vector2( startX + width/4*3 + 18, startY + 101), new Color(255, 255, 255, 75), "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 	}

// 	RendererSDK.OutlinedRect(new Vector2(startX + width/4*3, startY+120),new Vector2( width/4, 20), new Color(0, 0, 0, 255))

// 	RendererSDK.Text("Max allies", new Vector2(startX + 5, startY + 121), new Color(0, 255, 0, 255), "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)

// 	 let hoveringOverAllies = RendererSDK.CursorOnScreen.IsUnderRectangle(startX + width/4*3, startY+120, width/4, 20)
// 	let c:Color
// 	if (TinkerPushAllies > 0) {
// 		if (!TinkerPushMode) {
// 			c = new Color(0, 255, 255, 255)
// 		}
// 		else
// 		{
// 			c =new Color(255, 255, 255, 75)
// 		}
// 		RendererSDK.Text(TinkerPushAllies.toFixed(0), new Vector2( startX + width/4*3 + 18, startY + 121), c, "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 	}
// 	else
// 	{

// 		RendererSDK.Text(TinkerPushAllies.toFixed(0), new Vector2( startX + width/4*3 + 18, startY + 121), new Color(255, 255, 255, 75), "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 	}
// 	RendererSDK.OutlinedRect(new Vector2(startX + width/4*3, startY+140),new Vector2( width/4, 20),new Color(0, 0, 0, 255))

// 	RendererSDK.Text("Save TP only", new Vector2(startX + 5, startY + 141), new Color(0, 255, 0, 255), "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 	let hoveringOverSave = RendererSDK.CursorOnScreen.IsUnderRectangle(startX + width/4*3, startY+140, width/4, 20)

// 	let d:Color
// 	if (TinkerPushSave) {
// 		if (!TinkerPushMode) {
// 			d = new Color(0, 255, 0, 255)
// 		}
// 		else
// 		{
// 			d = new Color(255, 255, 255, 75)
// 		}
// 		//Wrap.DrawTextCenteredX(arcWardenfont, startX + width/4*3 + 18, startY + 141, "on", 0)
// 		RendererSDK.Text("on", new Vector2(startX + width/4*3 + 18, startY + 141), d,"Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 	}
// 	else
// 	{
// 		RendererSDK.Text("off", new Vector2(startX + width/4*3 + 18, startY + 141), new Color(255, 255, 255, 75),"Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 	}

// 	RendererSDK.OutlinedRect(new Vector2(startX + width/4*3, startY+160) ,new Vector2( width/4, 20), new Color(0, 0, 0, 255))
// 	new Color(0, 0, 0, 255)
// 	RendererSDK.Text("Auto disable", new Vector2(startX + 5, startY + 161), new Color(0, 255, 0, 255), "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 	//RendererSDK.DrawText(arcWardenfont, startX + 5, startY + 161, "Auto defend", 1)

// 	let hoveringOverDefend = RendererSDK.CursorOnScreen.IsUnderRectangle(startX + width/4*3, startY+160, width/4, 20)

// 	if (TinkerPushDef) {
// 		RendererSDK.Text("on", new Vector2(startX + width/4*3 + 18, startY + 161), new Color(0, 255, 0, 255), "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 	}
// 	else
// 	{
// 		RendererSDK.Text("off", new Vector2(startX + width/4*3 + 18, startY + 161), new Color(255, 255, 255, 75), "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 	}

// 	RendererSDK.OutlinedRect(new Vector2(startX + width/4*3, startY+180),new Vector2(width/4, 20), new Color(0, 0, 0, 255))

// 	RendererSDK.Text("Allow Jungle", new Vector2(startX + 5, startY + 181), new Color(0, 255, 0, 255), "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 	//RendererSDK.DrawText(arcWardenfont, , "Allow jungle", 1)

// 	let hoveringOverJungle = RendererSDK.CursorOnScreen.IsUnderRectangle(startX + width/4*3, startY+180, width/4, 20)

// 	let e:Color
// 	if (TinkerPushJungle) {
// 		if (!TinkerPushMode) {
// 			e =new Color(0, 255, 0, 255)
// 		}
// 		else
// 		{
// 			e =new Color(255, 255, 255, 75)
// 		}
// 		RendererSDK.Text("on", new Vector2(startX + width/4*3 + 18, startY + 181), e, "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 	}
// 	else
// 	{
// 		RendererSDK.Text("off", new Vector2(startX + width/4*3 + 18, startY + 181), new Color(255, 255, 255, 75), "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 	}

// 	let startXinfo = startX
// 	let startYinfo = startY + 210

// 	new Color(255, 0, 0, 255)
// 	RendererSDK.Text("information", new Vector2(startXinfo + 34, startYinfo), new Color(255, 0, 0, 255),"Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 	RendererSDK.FilledRect(new Vector2(startXinfo+1, startYinfo+1), new Vector2(width-2, 20-2), new Color(0, 0, 0, 45))
// 	RendererSDK.Text("Tinker action", new Vector2( startXinfo + 30, startYinfo + 23), new Color(0, 191, 255, 255),"Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 	RendererSDK.FilledRect(new Vector2(startX+1, startYinfo+21), new Vector2(width-2, 20-2),new Color(255, 255, 255, 45) )
// 		if (TinkerStatus == 0) {

// 			RendererSDK.Text("manual", new Vector2( startX + 47, startYinfo + 40), new Color(255, 100, 0, 255),"Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)

// 		}
// 		else if (TinkerStatus == 1 && target != undefined) {

// 			RendererSDK.Text("combo", new Vector2( startXinfo + 50, startYinfo + 40), new Color(0, 255, 0, 255),"Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 			//Wrap.DrawTextCenteredX(arcWardenfont,, "comboing", 0)
// 			let heroNameShort = target.Name.replace("npc_dota_hero_", "")
// 			RendererSDK.Image("panorama/images/heroes/icons/"+target.Name+"_png.vtex_c", new Vector2(startX + width/2 - 35, startYinfo + 58),new Vector2(67, 48), new Color(255, 255, 255, 255))
// 			new Color(255, 255, 255, 255)
// 			//RendererSDK.DrawImage(imageH&&le, startX + width/2 - 35, startYinfo + 58, 67, 48)
// 		}
// 		else if (TinkerStatus == 2) {

// 			RendererSDK.Text("TP push", new Vector2(startXinfo +45 , startYinfo + 40), new Color(0, 255, 0, 255), "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 			//Wrap.DrawTextCenteredX(arcWardenfont, , "TP pushing", 0)
// 		}
// 		else if (TinkerStatus == 3) {

// 			RendererSDK.Text("Rocket Spam",new Vector2(startXinfo + 30, startYinfo + 40), new Color(0, 255, 0, 255),  "Verdana", 14, FontFlags_t.ANTIALIAS||FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
// 			//Wrap.DrawTextCenteredX(arcWardenfont, , "Rocket spam", 0)
// 		}
// }
// Events.on("WndProc", (msg_type, wParam, lParam)=>{
// 	let m_pos:Vector2
// 	if (msg_type == 0x201)//LBUTTONDOWN
// 	{
// 		if (RendererSDK.CursorOnScreen.IsUnderRectangle(TinkerPanelX, TinkerPanelY+40, 140/2, 20))
// 		{
// 			if (TinkerPushMode)
// 			{
// 				TinkerPushMode = !TinkerPushMode
// 			}
// 		}
// 		if (RendererSDK.CursorOnScreen.IsUnderRectangle(TinkerPanelX + 140/2, TinkerPanelY+40, 140/2, 20))
// 		{
// 			if (!TinkerPushMode)
// 			{
// 			TinkerPushMode = !TinkerPushMode
// 			}
// 		}
// 		if (RendererSDK.CursorOnScreen.IsUnderRectangle(TinkerPanelX + 140/4*3, TinkerPanelY+80, 140/4, 20)&&!TinkerPushMode)
// 		{
// 			if (TinkerPushCreeps < 5) {
// 				TinkerPushCreeps = TinkerPushCreeps + 1
// 			}
// 		}
// 		if (RendererSDK.CursorOnScreen.IsUnderRectangle(TinkerPanelX + 140/4*3, TinkerPanelY+100, 140/4, 20)&&TinkerPushMode)
// 		{
// 			if (TinkerPushEnemies < 5) {
// 				TinkerPushEnemies = TinkerPushEnemies + 1
// 			}
// 		}
// 		if (RendererSDK.CursorOnScreen.IsUnderRectangle(TinkerPanelX + 140/4*3, TinkerPanelY+120, 140/4, 20)&&!TinkerPushMode)
// 		{
// 			if (TinkerPushAllies < 5) {
// 				TinkerPushAllies = TinkerPushAllies + 1
// 			}
// 		}
// 		if (RendererSDK.CursorOnScreen.IsUnderRectangle(TinkerPanelX + 140/4*3, TinkerPanelY+140, 140/4, 20)&&!TinkerPushMode)
// 		{
// 				TinkerPushSave = !TinkerPushSave
// 		}
// 		if (RendererSDK.CursorOnScreen.IsUnderRectangle(TinkerPanelX + 140/4*3, TinkerPanelY+160, 140/4, 20))
// 		{
// 			TinkerPushDef = !TinkerPushDef
// 		}
// 		if (RendererSDK.CursorOnScreen.IsUnderRectangle(TinkerPanelX + 140/4*3, TinkerPanelY+180, 140/4, 20)&&!TinkerPushMode)
// 		{
// 			TinkerPushJungle = !TinkerPushJungle
// 		}
// 	return true
// 	}
// 	if (msg_type == 0x204)//RBUTTONDOWN
// 	{
// 		if (RendererSDK.CursorOnScreen.IsUnderRectangle(TinkerPanelX + 140/4*3, TinkerPanelY+80, 140/4, 20)&&!TinkerPushMode)
// 		{
// 			if (TinkerPushCreeps > 1) {
// 				TinkerPushCreeps = TinkerPushCreeps - 1
// 			}
// 		}
// 		if (RendererSDK.CursorOnScreen.IsUnderRectangle(TinkerPanelX + 140/4*3, TinkerPanelY+100, 140/4, 20)&&!TinkerPushMode)
// 		{
// 			if (TinkerPushEnemies > 0) {
// 				TinkerPushEnemies = TinkerPushEnemies - 1
// 			}
// 		}
// 		if (RendererSDK.CursorOnScreen.IsUnderRectangle(TinkerPanelX + 140/4*3, TinkerPanelY+120, 140/4, 20)&&!TinkerPushMode)
// 		{
// 			if (TinkerPushAllies > 0) {
// 				TinkerPushAllies = TinkerPushAllies - 1
// 				}
// 		}
// 	return true
// 	}
// })
