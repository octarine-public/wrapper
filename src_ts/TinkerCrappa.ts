import { Ability, ArrayExtensions, Color, EventsSDK, Game, Hero, LocalPlayer, Item, Menu, ParticlesSDK, RendererSDK, Utils, Vector2, Vector3, GameSleeper, Creep, Sleeper, Tower, Tree, Entity, Modifier } from "wrapper/Imports"
let sleeper = new GameSleeper();
const menu = Menu.AddEntry(["Heroes", "Tinker"]),
	active = menu.AddToggle("Active"),
	binds = menu.AddNode("Keybinds"),
	comboKey = binds.AddKeybind("Combo Key"),
	spamKey = binds.AddKeybind("Spam rocket Key"),
	blinkKey = binds.AddKeybind("Blink Key"),
	debugKey = binds.AddKeybind("debug"),
	marshKey = binds.AddKeybind("Spam marsh Key"),
	rocketrearmFailsw = menu.AddToggle("Rocket and Rearm failswitch"),
	autoSoul = menu.AddToggle("Auto use soulring before rearm"),
	cursorRadius = menu.AddSlider("Nearest cursor radius", 200, 100, 1000),
	soulTresh = menu.AddSlider("HP Percent Threshold for soulring", 20, 0, 99),
	autop = menu.AddNode("Auto Pushing"),
	autoKey = autop.AddKeybind("Push Key"),
	autoLane = autop.AddSwitcher("Mode", ["Farm"], 0),
	autoMarsh = autop.AddSlider("N marsh", 3, 1, 4),
	autoAlly = autop.AddToggle("Push lane with Ally hero"),
	autoEnemy = autop.AddToggle("Push lane with Enemy hero"),
	autoEscape = autop.AddToggle("Escape if under vision"),
	autoJungle = autop.AddToggle("Push Jungle"),
	linken_settings = menu.AddNode("Linken&Lotus settings"),
	popLinkV = linken_settings.AddToggle("Pop Linken"),
	popLinkItems = linken_settings.AddImageSelector(
		"Pop Linken with",
		[
			"tinker_laser",
			"item_sheepstick",
			"item_dagon_5",
			"item_nullifier",
			"item_cyclone",
			"item_rod_of_atos",
			"item_force_staff",
			"item_orchid",
			"item_bloodthorn",
			"item_hurricane_pike",

		],
	),
	bmcheck = linken_settings.AddToggle("Check BladeMail, Lotus, AM, Nyx"),
	soulRing = menu.AddToggle("Enable SoulRing"),
	blinkV = menu.AddToggle("Enable Blink"),
	blinkRadius = menu.AddSlider("Blink distance from enemy", 200, 0, 800),
	ability_items_settings = menu.AddNode("Active - Abilities/Items"),
	abils = ability_items_settings.AddImageSelector(
		"Active abilities",
		[
			"tinker_laser",
			"tinker_heat_seeking_missile",
			"tinker_rearm",
		],
	),
	items = ability_items_settings.AddImageSelector(
		"Active items",
		[
			"item_sheepstick",
			"item_ethereal_blade",
			"item_dagon_5",
			"item_veil_of_discord",
			"item_orchid",
			"item_bloodthorn",
			"item_shivas_guard",
			"item_nullifier",
			"item_lotus_orb",
			"item_rod_of_atos",
			"item_guardian_greaves",
		],
	),
	helpF = ability_items_settings.AddToggle("Cast Lotus On Allies"),
	etherD = ability_items_settings.AddToggle("Cast Dagon&Laser Only in Ethereal"),
	drawable = menu.AddNode("Drawable"),
	drawTargetParticle = drawable.AddToggle("Draw line to target"),
	drawStatus = drawable.AddToggle("Draw status"),
	statusPosX = drawable.AddSlider("Position X (%)", 19, 0, 100),
	statusPosY = drawable.AddSlider("Position Y (%)", 4, 0, 100),
	textSize = drawable.AddSlider("Text size", 15, 10, 30),
	debugDraw = drawable.AddToggle("Draw Debug")

let tinker: Hero,
	nearest: Hero,
	fountain: Vector3,
	target: Hero,
	heroes: Hero[] = [],
	fheroes: Hero[] = [],
	fcreeps: Creep[] = [],
	ecreeps: Creep[] = [],
	trees: Tree[] = [],
	savespots: Vector3[] = [new Vector3(-7233, -1376, 384),
				new Vector3(-7200, -1017, 384),
				new Vector3(-7212, -551, 384),
				new Vector3(-7125, -81, 384),
				new Vector3(-7114, 337, 384),
				new Vector3(-7194, 732, 384),
				new Vector3(-7129, 1337, 384),
				new Vector3(-7140, 1645, 384),
				new Vector3(-7176, 2070, 384),
				new Vector3(-7089, 2307, 512),
				new Vector3(-6847, 3532, 384),
				new Vector3(-7226, 3989, 384),
				new Vector3(-6994, 4915, 384),
				new Vector3(-6900, 5118, 384),
				new Vector3(-6732, 5540, 384),
				new Vector3(-6581, 5919, 384),
				new Vector3(-6273, 6178, 384),
				new Vector3(-6104, 6542, 384),
				new Vector3(-5458, 6709, 384),
				new Vector3(-5130, 6783, 384),
				new Vector3(-4631, 6760, 384),
				new Vector3(-4308, 6977, 384),
				new Vector3(-3791, 6757, 384),
				new Vector3(-3497, 6873, 384),
				new Vector3(-3117, 6930, 384),
				new Vector3(-2696, 6878, 384),
				new Vector3(-2321, 6938, 384),
				new Vector3(-1731, 6864, 384),
				new Vector3(-1100, 6951, 384),
				new Vector3(-767, 7021, 384),
				new Vector3(-82, 6823, 384),
				new Vector3(183, 6728, 384),
				new Vector3(673, 6884, 384),
				new Vector3(1009, 6861, 384),
				new Vector3(1561, 6964, 384),
				new Vector3(2540, 6960, 384),
				new Vector3(3445, 6863, 384),
				new Vector3(7400, 2808, 384),
				new Vector3(7456, 2090, 256),
				new Vector3(7226, 866, 384),
				new Vector3(7029, 494, 384),
				new Vector3(7086, -37, 384),
				new Vector3(6850, -193, 384),
				new Vector3(7205, -493, 383),
				new Vector3(4987, -5374, 384),
				new Vector3(6918, -908, 384),
				new Vector3(7080, -1472, 384),
				new Vector3(7171, -1807, 384),
				new Vector3(7297, -2177, 384),
				new Vector3(7031, -3224, 384),
				new Vector3(6898, -3549, 384),
				new Vector3(7460, -4648, 384),
				new Vector3(6924, -4814, 384),
				new Vector3(6891, -5163, 384),
				new Vector3(6701, -5480, 384),
				new Vector3(6647, -5824, 384),
				new Vector3(6583, -6132, 384),
				new Vector3(6381, -6424, 384),
				new Vector3(6059, -6451, 384),
				new Vector3(6021, -6588, 384),
				new Vector3(5650, -6737, 384),
				new Vector3(5378, -6735, 384),
				new Vector3(4971, -6738, 384),
				new Vector3(4536, -6652, 384),
				new Vector3(4333, -6725, 384),
				new Vector3(3879, -6734, 384),
				new Vector3(3364, -6777, 384),
				new Vector3(3013, -6804, 384),
				new Vector3(2696, -6795, 384),
				new Vector3(2388, -6791, 384),
				new Vector3(1970, -6840, 384),
				new Vector3(1594, -6898, 384),
				new Vector3(1150, -6852, 384),
				new Vector3(759, -6957, 384),
				new Vector3(289, -6964, 384),
				new Vector3(-330, -6876, 384),
				new Vector3(-623, -6858, 384),
				new Vector3(-1073, -6927, 384),
				new Vector3(-2947, -6995, 256),
				new Vector3(-3990, -7001, 384),
				new Vector3(-530, -5611, 384),
				new Vector3(2463, -5622, 384),
				new Vector3(3951, -5522, 384),
				new Vector3(5655, -3890, 384),
				new Vector3(5565, -1369, 384),
				new Vector3(5690, 995, 384),
				new Vector3(2228, 2684, 256),
				new Vector3(2939, 1222, 256),
				new Vector3(1008, 1594, 256),
				new Vector3(489, 1282, 256),
				new Vector3(1283, 19, 256),
				new Vector3(-907, -1464, 256),
				new Vector3(-2041, -936, 256),
				new Vector3(-2490, -1083, 256),
				new Vector3(-1236, -1858, 256),
				new Vector3(-2032, -2420, 256),
				new Vector3(-2303, -2759, 256),
				new Vector3(-2832, -1435, 256),
				new Vector3(-3888, -2336, 256),
				new Vector3(-2676, 5523, 384),
				new Vector3(-1180, 5551, 384),
				new Vector3(-5025, 5136, 384),
				new Vector3(-5269, 5023, 384),
				new Vector3(-4234, 5335, 384),
				new Vector3(-3737, 5550, 384),
				new Vector3(4623, -5468, 384),
				new Vector3(2962, -5598, 383)],
	jspotradiant: Vector3[] = [new Vector3(-4620, 156, 256),new Vector3(-903, -4109, 384),new Vector3(3670, -4655, 256)],
	jspotdire: Vector3[] = [new Vector3(3520, 155, 384), new Vector3(3377, 56, 384), new Vector3(-2406, 3738, 256),	new Vector3(474, 3788, 384)],
	_h: Hero,
	targetParticle: number,
	comboKeyPress = false,
	q: Ability,
	w: Ability,
	e: Ability,
	r: Ability,
	atos: Item,
	nullifier: Item,
	hex: Item,
	veil: Item,
	eblade: Item,
	dagon: Item,
	orchid: Item,
	blood: Item,
	shiva: Item,
	tpboots: Item,
	cyclone: Item,
	forcestaff: Item,
	hurricane: Item,
	soulring: Item,
	blink: Item,
	bottle: Item,
	tpscroll: Item,
	lotus: Item,
	greaves: Item,
	debuffed = false,
	cshotparticle: number,
	ebladecasted: boolean,
	lastCheckTime: number[] = [],
	pushstat: boolean,
	nextTick: number,
	status: string,
	a: RandomSource,
	b: any,
	c: any,
	creepg: any,
	creepf: any,
	creepd: any;



EventsSDK.on("GameStarted", hero => {
	if (hero.m_pBaseEntity instanceof C_DOTA_Unit_Hero_Tinker) {
		tinker = hero
		getAbils()
	}
	lastCheckTime[0] = 0;
	lastCheckTime[1] = 0;
	if (tinker.Team == 2) fountain = new Vector3(-7167, - 6646, 520)
	if (tinker.Team == 3) fountain = new Vector3(7036, 6434, 520)
	pushstat = false
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof Hero) {
		ArrayExtensions.arrayRemove(heroes, ent)
	}
	if (ent instanceof Creep) {
		ArrayExtensions.arrayRemove(fcreeps, ent)
		ArrayExtensions.arrayRemove(ecreeps, ent)
	}
	if (ent instanceof Tree) {
		ArrayExtensions.arrayRemove(trees, ent)
	}
})
EventsSDK.on("EntityCreated", npc => {

	if (npc instanceof Hero && !npc.IsIllusion) {
		if (npc.IsEnemy()) {
			heroes.push(npc)
		}
		else if (npc.IsAlive && !npc.IsEnemy()) {
			fheroes.push(npc)
		}
	}

	if (npc instanceof Creep && npc.IsAlive && !npc.IsWaitingToSpawn && npc.IsSpawned) {
		if (!npc.IsEnemy()) {
			fcreeps.push(npc)
		}
		else if (npc.IsVisible && npc.IsEnemy()) {
			ecreeps.push(npc)
		}
	}
	if (npc instanceof Tree && npc.IsAlive && npc.IsValid)
	{
		trees.push(npc)	
	}
})
EventsSDK.on("GameEnded", () => {
	sleeper.FullReset();
	tinker = undefined
	heroes = []
	fheroes = []
	nearest = undefined
	fountain = undefined
	fcreeps = []
	ecreeps = []
	trees = []
	_h = undefined
	target = undefined
	comboKeyPress = false
	q = undefined
	w = undefined
	status = undefined
	e = undefined
	r = undefined
	atos = undefined
	nullifier = undefined
	hex = undefined
	veil = undefined
	eblade = undefined
	dagon = undefined
	orchid = undefined
	pushstat = undefined
	blood = undefined
	tpboots = undefined
	shiva = undefined
	cyclone = undefined
	forcestaff = undefined
	hurricane = undefined
	soulring = undefined
	blink = undefined
	ebladecasted = undefined
	tpscroll = undefined
	debuffed = false
	lotus = undefined
	greaves = undefined
	nextTick = undefined
	lastCheckTime = undefined
	if (targetParticle !== undefined) {
		ParticlesSDK.Destroy(targetParticle, true)
		targetParticle = undefined
	}
})
EventsSDK.on("PrepareUnitOrders", order => {
	if (order.Unit === tinker && order.OrderType === dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET) {
		if ((order.Ability as Ability).Name === "tinker_heat_seeking_missile" && rocketrearmFailsw) {
			if (_h == undefined || !_h.IsVisible || _h.IsMagicImmune) return false
		}
		if ((order.Ability as Ability).Name === "tinker_rearm") {
			getAbils()
			getItems()
			let dy = false
			if (tinker.Items.some(e => e && !e.IsReady && e.Name != "item_bottle") || !q.IsReady || !w.IsReady || !e.IsReady) dy = true
			if (rocketrearmFailsw && dy == false) {
				return false;
			}
			if (autoSoul && soulring && soulring.IsReady) {
				tinker.OrderStop()
				tinker.CastNoTarget(soulring)
				order.Execute()
			}
		}
	}
	return true
})
EventsSDK.on("Tick", () => {

	if (!active.value || !Game.IsInGame || Game.IsPaused || tinker === undefined || !tinker.IsAlive || sleeper.Sleeping("blinker") || sleeper.Sleeping("spam") || sleeper.Sleeping("rearm") )
		return false;
	getAbils()
	getItems()
	if (  comboKey.is_pressed ) {
		target = nearest
		mainCombo(target)
	} else {
		target = undefined
	}
	
	if (debugKey.is_pressed) getBestLane()
	if (blinkKey.is_pressed && blink && !sleeper.Sleeping("blinker") && !r.IsChanneling) fastBlink()
	if (spamKey.is_pressed && !sleeper.Sleeping("spam")) {
		if (!r.IsChanneling && _h != undefined && !_h.IsMagicImmune && _h.IsVisible) {
			if (soulRing.value && soulring && soulring.CanBeCasted() && (tinker.HP/tinker.MaxHP*100 > soulTresh.value)) {
				tinker.CastNoTarget(soulring)
			}
			tinker.CastNoTarget(w)
			if (greaves && greaves.CanBeCasted() && items.IsEnabled("item_guardian_greaves"))
			{
				tinker.CastNoTarget(greaves)
			}
			if (r.CanBeCasted() && needRearm) {
				tinker.CastNoTarget(r);
				sleeper.Sleep(r.GetSpecialValue("channel_tooltip", r.Level) * 1000, "spam");
				return
			}
		}

	}

})

function getBestLane() {
	console.log("getBestLane")
	let unit = null
	let blinkpos:Vector3 = null
	let num:number = 0
	let num2:number = 0
	let vector = null
	fcreeps.forEach(function(allyc: Creep)
		{
			//creepg = allyc.Index.toString
			console.log("creep"+allyc.Index)
			if ((autoAlly.value || !fheroes.some(x => x.IsInRange(allyc, 700, false))) && (autoEnemy.value || !heroes.some(x => x.IsInRange(allyc, 700, false))))
			{
				num2 = ecreeps.filter(Creep => Creep.IsInRange(allyc, 800, false)).length
				console.log("num2: "+num2+" ecreep length: "+ ecreeps.length)
				if (num2 > num)
					{
						num = num2
						if (blink)
						{
							let x = savespots.filter(Vector3 => Vector3.IsInRange(allyc.Position, 1200+tinker.CastRangeBonus) && checkForTrees(Vector3))
							let z = ArrayExtensions.orderBy(x, e => -e.Distance2D(allyc.Position))
							if (z.length != 0) 
							{
								unit = allyc
								blinkpos = z[0]
								console.log("safe spot, unit.Position",unit.Position)
								console.log("blink position", blinkpos.x, blinkpos.y, blinkpos.z)
								//	tinker.CastTarget(tpboots, unit)
								//	tinker.CastPosition(blink, blinkpos)
								if (unit != undefined)	return [unit, blinkpos];
								if (unit == undefined && autoJungle)
								{
									console.log("flag3, unit undef, jungle")
									if(tinker.Team==2) return [jspotradiant[Math.floor(Math.random() * (3))], 1337];
									else return [jspotdire[Math.floor(Math.random() * (4))], 1337];
								}
								else return [1337,1337];
							}
							else
							{
								unit = allyc
								console.log("no safespot: unit.Position",unit.Position)
								if (unit != undefined) return [unit, 1337];
							}
						}
						else
						{
							unit = allyc
							console.log("no blink: unit.Position",unit.Position)
							if (unit != undefined) return [unit, 1337];
						}
					}
			}
		})
	}
function fastBlink() {
	if (!r.IsChanneling) {
		if (blink.IsReady) {
			tinker.CastPosition(blink, Utils.CursorWorldVec, false, true)

		}
		else {
			if (soulRing.value && soulring !== undefined && soulring.CanBeCasted() && tinker.HP / tinker.MaxHP * 100 > soulTresh.value) tinker.CastNoTarget(soulring)
			if (r.CanBeCasted()) {
				tinker.CastNoTarget(r, false)
				sleeper.Sleep(r.GetSpecialValue("channel_tooltip", r.Level) * 1000, "blinker")
				return;
			}
		}
	}
}
function checkForTrees(vec: Vector3)
{
	return (trees.filter(Tree => Tree.IsInRange(vec, 200) && Tree.IsValid && Tree.IsAlive).length >= 3);
}

function mainCombo(target: Hero)
{
	getItems()
	getAbils()
	if (target !== undefined && !sleeper.Sleeping("rearm")) {
		if (!target.IsAlive )
			target = undefined
		
		if (!target.IsMagicImmune) {
			
		if (!r.IsChanneling){
			if (bmcheck.value && target.ModifiersBook.HasAnyBuffByNames(["modifier_item_blade_mail_reflect","modifier_item_lotus_orb_active","modifier_antimage_counterspell","modifier_nyx_assassin_spiked_carapace"]) && !tinker.IsMagicImmune)
			{
				console.log("bmcheck")
				//target = undefined
				return false;
			
			}
			
			useBlink()
				if (popLinkV.value && target.HasLinkenAtTime()) {
				if (popLink(nullifier, popLinkItems.IsEnabled("item_nullifier"))) return
				if (popLink(cyclone, popLinkItems.IsEnabled("item_cyclone"))) return
				if (popLink(atos, popLinkItems.IsEnabled("item_rod_of_atos"))) return
				if (popLink(hex, popLinkItems.IsEnabled("item_sheepstick"))) return
				if (popLink(forcestaff, popLinkItems.IsEnabled("item_force_staff"))) return
				if (popLink(dagon, popLinkItems.IsEnabled("item_dagon_5"))) return
				if (popLink(orchid, popLinkItems.IsEnabled("item_orchid"))) return
				if (popLink(blood, popLinkItems.IsEnabled("item_bloodthorn"))) return
				if (popLink(q, popLinkItems.IsEnabled("tinker_laser"))) return
				if (popLink(hurricane, popLinkItems.IsEnabled("item_hurricane_pike"))) return
			}
			if (soulRing.value && soulring && soulring.CanBeCasted() && (tinker.HP/tinker.MaxHP*100 > soulTresh.value)) {
				tinker.CastNoTarget(soulring)
			}
			if (shiva && shiva.CanBeCasted() && items.IsEnabled("item_shivas_guard")&&tinker.IsInRange(target, 800+tinker.CastRangeBonus))
			{
				tinker.CastNoTarget(shiva)
			}
			if (lotus && lotus.CanBeCasted() && items.IsEnabled("item_lotus_orb"))
			{ 
				if (helpF)
				{
					let xxxtentacion = ArrayExtensions.orderBy(fheroes.filter(hero => hero.Distance(tinker) <= 900+tinker.CastRangeBonus && hero.IsAlive && !hero.ModifiersBook.HasBuffByName("modifier_item_lotus_orb_active") ), ent => ent.Distance(Utils.CursorWorldVec))[0]
					let cast = (xxxtentacion != undefined)?tinker.CastTarget(lotus, xxxtentacion):tinker.CastTarget(lotus, tinker)
				}
				else
				{
					tinker.CastTarget(lotus, tinker)	
				}
			}
			if (greaves && greaves.CanBeCasted() && items.IsEnabled("item_guardian_greaves"))
			{
				tinker.CastNoTarget(greaves)
			}
			if (hex &&  hex.CanBeCasted() && items.IsEnabled("item_sheepstick") && (!target.IsHexed||(Game.RawGameTime - lastCheckTime[0] )>(3.4-r.GetSpecialValue("channel_tooltip", r.Level))))
			{
				tinker.CastTarget(hex, target)
				lastCheckTime[0] = Game.RawGameTime
			}
			if (nullifier && nullifier.CanBeCasted() && items.IsEnabled("item_nullifier")&& !target.IsMuted)
			{
				tinker.CastTarget(nullifier, target)	
			}	
			if (orchid && orchid.CanBeCasted() && items.IsEnabled("item_orchid")&& !target.IsSilenced)
			{
				tinker.CastTarget(orchid, target)
			}
			if (blood && blood.CanBeCasted() && items.IsEnabled("item_bloodthorn") && !target.IsSilenced)
			{
				tinker.CastTarget(blood, target)	
			}
			if (atos && atos.CanBeCasted() && items.IsEnabled("item_rod_of_atos"))
			{
				tinker.CastTarget(atos, target)
			}		
			if (veil && veil.CanBeCasted() && items.IsEnabled("item_veil_of_discord"))
			{
				tinker.CastPosition(veil, target.NetworkPosition)
				lastCheckTime[2] = Game.RawGameTime
			}
			if (eblade && eblade.CanBeCasted() && items.IsEnabled("item_ethereal_blade") &&  (Game.RawGameTime - lastCheckTime[1] )>(4.1-r.GetSpecialValue("channel_tooltip", r.Level)-tinker.Distance2D(target)/1275))
			{
				tinker.CastTarget(eblade, target)
				lastCheckTime[1] = Game.RawGameTime
			}
			if (w.CanBeCasted() && abils.IsEnabled("tinker_heat_seeking_missile"))
			{
			   tinker.CastNoTarget(w) 
			}
			if (q.CanBeCasted() && tinker.IsInRange(target, q.CastRange) && abils.IsEnabled("tinker_laser"))
			{
			   (etherD&&eblade && Game.GameTime > lastCheckTime[1]+0.05+q.CastPoint)?tinker.CastTarget(q, target):tinker.CastTarget(q, target)
			}
			if (dagon && dagon.CanBeCasted() && items.IsEnabled("item_dagon_5"))
			{
				(etherD&&eblade && Game.GameTime > lastCheckTime[1]+0.05+tinker.Distance2D(target)/1275) ? tinker.CastTarget(dagon, target):tinker.CastTarget(dagon, target)
			}
			if (r.CanBeCasted() && abils.IsEnabled("tinker_rearm") && needRearm)
			{
				tinker.CastNoTarget(r)
				sleeper.Sleep(r.GetSpecialValue("channel_tooltip", r.Level)*1000, "rearm")
				
			}			
		}
	}
	}
}
function needRearm() {
	let bool = true
	if (hex && hex.CanBeCasted()) bool = false
	if (veil && veil.CanBeCasted()) bool = false
	if (eblade && eblade.CanBeCasted()) bool = false
	if (dagon && dagon.CanBeCasted()) bool = false
	if (orchid && orchid.CanBeCasted()) bool = false
	if (blood && blood.CanBeCasted()) bool = false
	if (shiva && shiva.CanBeCasted()) bool = false
	if (nullifier && nullifier.CanBeCasted()) bool = false
	if (tpscroll && tpscroll.CanBeCasted()) bool = false
	if (q.CanBeCasted()) bool = false
	if (w.CanBeCasted()) bool = false
	if (e.CanBeCasted()) bool = false
	return bool
}
function useBlink() {
	if (blinkV.value && blink !== undefined && blink.IsReady) {
		if (target.IsInRange(tinker, 600))
			return false
		let castRange = blink.GetSpecialValue("blink_range") + tinker.CastRangeBonus,
			distance = target.NetworkPosition.Subtract(tinker.NetworkPosition),
			disToTarget = tinker.Distance(target)
		distance.SetZ(0)
		distance.Normalize()
		if (disToTarget > castRange) {
			let di = disToTarget - castRange,
				minus = 0
			if (di < blinkRadius.value)
				minus = blinkRadius.value - di
			distance.ScaleTo(castRange - 1 - minus)
		} else {
			distance.ScaleTo(disToTarget - blinkRadius.value - 1)
		}
		tinker.CastPosition(blink, tinker.NetworkPosition.Add(distance))
		return true
	}
	
	return false
}
function arrayDuplicates(arr: Modifier[], k: any){
    for (let i1 = 0; i1 < arr.length; i1++) {
        for (let i2 = i1 + 1; i2 < arr.length; i2++) {
            if (arr[i1].Name == arr[i2].Name == k && arr[i1].RemainingTime == arr[i2].RemainingTime == null ) {
                return true;
            }
        }
    }
    return false;
}
function getAbils() {
	q = tinker.GetAbilityByName("tinker_laser")
	w = tinker.GetAbilityByName("tinker_heat_seeking_missile")
	e = tinker.GetAbilityByName("tinker_march_of_the_machines")
	r = tinker.GetAbilityByName("tinker_rearm")
}
function getItems() {
	atos = tinker.GetItemByName("item_rod_of_atos",false)
	nullifier = tinker.GetItemByName("item_nullifier",false)
	hex = tinker.GetItemByName("item_sheepstick",false)
	veil = tinker.GetItemByName("item_veil_of_discord",false)
	eblade = tinker.GetItemByName("item_ethereal_blade",false)
	dagon = tinker.GetItemByName(/item_dagon/,false)
	orchid = tinker.GetItemByName("item_orchid",false)
	blood = tinker.GetItemByName("item_bloodthorn",false)
	bottle = tinker.GetItemByName("item_bottle",false)
	shiva = tinker.GetItemByName("item_shivas_guard",false)
	cyclone = tinker.GetItemByName("item_cyclone",false)
	forcestaff = tinker.GetItemByName("item_force_staff",false)
	hurricane = tinker.GetItemByName("item_hurricane_pike",false)
	soulring = tinker.GetItemByName("item_soul_ring",false)
	blink = tinker.GetItemByName("item_blink",false)
	//	tpscroll = tinker.GetItemByName("item_tpscroll")
	greaves = tinker.GetItemByName("item_guardian_greaves",false)
	lotus = tinker.GetItemByName("item_lotus_orb",false)
	tpboots = tinker.GetItemByName(/item_travel_boots/,false)
}
function popLink(item: Item | Ability, val: boolean) {
	if (val && item !== undefined && item.IsReady) {
		tinker.CastTarget(item, target, false, false)
		return true
	}
	return false
}

EventsSDK.on("Update", cmd => {
	if (!active.value || !Game.IsInGame || Game.IsPaused || tinker === undefined || !tinker.IsAlive)
		return
	nearest = ArrayExtensions.orderBy(heroes.filter(hero => hero.Distance(Utils.CursorWorldVec) <= cursorRadius.value && hero.IsAlive), ent => ent.Distance(Utils.CursorWorldVec))[0]
	_h = heroes.find(hero => hero.Distance(tinker) <= 2500)
	if (autoKey.is_pressed && !sleeper.Sleeping("key")) {
		pushstat = !pushstat
		status = "init"
		sleeper.Sleep(500, "key")
	//	if (pushstat) setTimeout(pusher,200)
		return

	}
	if(pushstat && !sleeper.Sleeping("push") && status == "init")
	{
		sleeper.Sleep(50, "push")
	}
		// if (getBestLane() != undefined)
		// {
		// 	tinker.CastTarget(tpboots, getBestLane()[0])//tp to lane
		// 	console.log("BEFORE sleep"+Game.RawGameTime)
			
		// 	console.log("sleep ,cast blink"+Game.RawGameTime)
		// 	if (blink && getBestLane()[1] != 1337) tinker.CastPosition(blink, getBestLane()[1])
		// 	for (var _i = 0; _i < autoMarsh.value; _i++) {
		// 		if (soulring && soulRing) tinker.CastNoTarget(soulring, true)
		// 		tinker.CastPosition(e, getBestLane()[0], true)
						

		// 		if (blink && tinker.IsVisibleForEnemies && autoEscape)
		// 		{
		// 		 let x = savespots.filter(Vec => Vec.IsInRange(tinker.Position, 1200 + tinker.CastRangeBonus) && checkForTrees(Vec))
		// 		 if (x.length>0) tinker.CastPosition(blink, ArrayExtensions.orderBy(x, e => -e.Distance2D(tinker.Position))[0])
		// 		}
		// 		tinker.CastNoTarget(r, true)
		// 		if (bottle) tinker.CastNoTarget(bottle, true)
		// 		status = "marshing"
		// 	}
		// 	let sleept = 3300+autoMarsh.value*(1900+(r.GetSpecialValue("channel_tooltip", r.Level) * 1000))
		// 	setTimeout(function(){
		// 		tinker.CastPosition(tpboots,fountain,true)
		// 		status = "tp home+rearm"
		// 		if (soulring && soulRing) tinker.CastNoTarget(soulring, true)
		// 		tinker.CastNoTarget(r, true)
		// 		setTimeout(function(){status = "init"}, 5500+r.GetSpecialValue("channel_tooltip", r.Level) *1000)
		// 	}, sleept)
		// 	sleeper.Sleep(sleept+3300*2,"push")
		// }
		// else
		// {
		// 	getBestLane()
		// }
		
		// }
	
	// if (pushstat && status === "regen" && tinker.Mana/tinker.MaxMana > 0.9 && tinker.Position.Distance2D(fountain)<100)
	// {
	// 	//clearTimeout(a)
	//   	//clearTimeout(b)
	//   	console.log("timeoutcleared, mana, calling pusher:", tinker.Mana/tinker.MaxMana)  
	//   	c = setTimeout(pusher,700)
	//   	return  
	// }

})
EventsSDK.on("Draw", () => {
	if (debugDraw)
	{
	/*	
		let text = ["\n", `${Utils.CursorWorldVec.x}` , "\n", `${Utils.CursorWorldVec.y}`, "\n", `${Utils.CursorWorldVec.z}` , ")"]
		text.forEach((vac, i) => {
			RendererSDK.TextAroundMouse(vac, false, new Color(255, 255, 255, 255))
			RendererSDK.TextAroundMouse("\n", false, new Color(255, 255, 255, 255))
		})*/
	}
	if (!active.value || !Game.IsInGame  || tinker === undefined || !tinker.IsAlive)
		return
	if (drawTargetParticle.value) {
		if (targetParticle === undefined && (nearest !== undefined || target !== undefined)) {
			targetParticle = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, nearest)
		}
		if (targetParticle !== undefined) {
			if (nearest === undefined && target === undefined) {
				ParticlesSDK.Destroy(targetParticle, true)
				targetParticle = undefined
			} else {
				ParticlesSDK.SetControlPoint(targetParticle, 2, tinker.Position)
				ParticlesSDK.SetControlPoint(targetParticle, 6, new Vector3(1))
				ParticlesSDK.SetControlPoint(targetParticle, 7, (target || nearest).Position)
			}
		}
	}

	if (drawStatus.value && Game.UIState === DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME) {
		
	
		
		let disp= display()
		let text = ["tinker", `Target: ${target !== undefined ? target.Name : "none"}`, `N of casts: ${target !== undefined ? disp[0].toFixed(3) : ""}`,`Mana: ${(target !== undefined)?target.m_pBaseEntity.m_flManaThinkRegen : "no"}`] //,`Current pushstat: ${pushstat}`, , `Current mode: ${autoLane.values[autoLane.selected_id]}`, `Status: ${status}`, "\n" ]
		const wSize = RendererSDK.WindowSize
		text.forEach((val, i) => {
			RendererSDK.Text(
				val,
				new Vector2(
					wSize.x / 100 * statusPosX.value,
					wSize.y / 100 * statusPosY.value + (i * textSize.value),
				),
				new Color(255, 255, 255, 255), 
				"Calibri",
				textSize.value,
			)
		})
		
	}
})
function display(){
	if (target !== undefined)
	{
	let pipe = (target.GetItemByName("item_pipe"))?0.35:0
	let hood = (target.GetItemByName("item_hood_of_defiance"))?0.25:0
	let pipeac = ((pipe)&&target.GetItemByName("item_pipe").IsReady)?400:0
	let ebalo = eblade?0.4:0
	let hoodac = ((hood)&&target.GetItemByName("item_hood_of_defiance").IsReady)?325:0
	let mana = -150+tinker.ManaRegen
	let damage_d = 0
	let lasere = 0
	if(q&&abils.IsEnabled("tinker_laser")) lasere= (q.GetSpecialValue("laser_damage") + tinker.GetTalentValue("special_bonus_unique_tinker"))*(1+tinker.SpellAmplification),	 mana = mana+q.ManaCost
	if (w&&abils.IsEnabled("tinker_heat_seeking_missile")){
	switch (w.Level) { 
		case 1: { 
		   damage_d = damage_d+125
		   break; 
		} 
		case 2: { 
			damage_d = damage_d+200 
		   break; 
		} 
		case 3: { 
			damage_d = damage_d+275
			break; 
		 }
		 case 4: { 
			damage_d = damage_d+350 
			break; 
		 } 
	 } 
	 mana = mana+w.ManaCost
	}
	if (dagon&&items.IsEnabled("item_dagon_5"))		 damage_d=damage_d+dagon.GetSpecialValue("damage"),		 mana = mana+dagon.ManaCost
	if (eblade&&items.IsEnabled("item_ethereal_blade"))		 damage_d = damage_d + (75 + 2*tinker.TotalIntelligence)/(r.Level), mana = mana+eblade.ManaCost/r.Level
	if (shiva&&items.IsEnabled("item_shivas_guard")) damage_d= damage_d+200,	 mana = mana+shiva.ManaCost
	if (hex&&items.IsEnabled("item_sheepstick")) mana = mana+hex.ManaCost
	if (r&&abils.IsEnabled("tinker_rearm")) mana = mana+r.ManaCost
 	let factd = damage_d*(1 + tinker.SpellAmplification)*((1 - 0.25) * (1 - target.Strength * 0.0008) * (1 - pipe) * (1 - hood) * (1+ ebalo))+lasere
	let number1 = ((target.HP +pipeac+hoodac))//*(1 - magicres))
	let number2 = factd
	//return Math.abs(Math.floor(number))
	return [number1/number2, mana]
	}
}