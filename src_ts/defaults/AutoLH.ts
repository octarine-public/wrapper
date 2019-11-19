
// import { ArrayExtensions, Creep, EventsSDK, Game, Hero, LocalPlayer, Menu, RendererSDK, Unit, Utils } from "../wrapper/Imports"

// let root = Menu.AddEntry(["Utility", "Auto LastHit"]),
// 	hotkey = root.AddKeybind("Hotkey", "", "Hotkey is in toggle mode"),
// 	creep_hp_offset = root.AddSlider("Creep HP offset", 15, -15),
// 	melee_time_offset = root.AddSliderFloat("Melee attack time offset", -0.2, -0.2),
// 	delay_multiplier = root.AddSliderFloat("Melee attack time offset", -2.5, -2.5),
// 	glow_enabled = root.AddToggle("Glow mode", true),
// 	glow_finder_range = root.AddSlider("Glow finder range", 0, 0, 1500),
// 	glow_only = root.AddToggle("Glow only", false),
// 	mode = root.AddSwitcher("Mode", [
// 		"None",
// 		"Lasthit",
// 		"Deny",
// 		"Both",
// 	])

// enum AutoLH_Mode {
// 	LASTHIT = 1,
// 	DENY,
// 	BOTH,
// }

// var attack_anim_point = {
// 		npc_dota_hero_base: 0.75,
// 		npc_dota_hero_antimage: 0.3,
// 		npc_dota_hero_axe: 0.5,
// 		npc_dota_hero_bane: 0.3,
// 		npc_dota_hero_bloodseeker: 0.43,
// 		npc_dota_hero_crystal_maiden: 0.55,
// 		npc_dota_hero_drow_ranger: 0.65,
// 		npc_dota_hero_earthshaker: 0.467,
// 		npc_dota_hero_juggernaut: 0.33,
// 		npc_dota_hero_mirana: 0.3,
// 		npc_dota_hero_nevermore: 0.5,
// 		npc_dota_hero_morphling: 0.5,
// 		npc_dota_hero_phantom_lancer: 0.5,
// 		npc_dota_hero_puck: 0.5,
// 		npc_dota_hero_pudge: 0.5,
// 		npc_dota_hero_razor: 0.3,
// 		npc_dota_hero_sand_king: 0.53,
// 		npc_dota_hero_storm_spirit: 0.5,
// 		npc_dota_hero_sven: 0.4,
// 		npc_dota_hero_tiny: 0.4,
// 		npc_dota_hero_vengefulspirit: 0.33,
// 		npc_dota_hero_windrunner: 0.4,
// 		npc_dota_hero_zuus: 0.633,
// 		npc_dota_hero_kunkka: 0.4,
// 		npc_dota_hero_lina: 0.75,
// 		npc_dota_hero_lich: 0.46,
// 		npc_dota_hero_lion: 0.43,
// 		npc_dota_hero_shadow_shaman: 0.3,
// 		npc_dota_hero_slardar: 0.36,
// 		npc_dota_hero_tidehunter: 0.6,
// 		npc_dota_hero_witch_doctor: 0.4,
// 		npc_dota_hero_riki: 0.3,
// 		npc_dota_hero_enigma: 0.4,
// 		npc_dota_hero_tinker: 0.35,
// 		npc_dota_hero_sniper: 0.17,
// 		npc_dota_hero_necrolyte: 0.4,
// 		npc_dota_hero_warlock: 0.3,
// 		npc_dota_hero_beastmaster: 0.3,
// 		npc_dota_hero_queenofpain: 0.56,
// 		npc_dota_hero_venomancer: 0.3,
// 		npc_dota_hero_faceless_void: 0.5,
// 		npc_dota_hero_skeleton_king: 0.56,
// 		npc_dota_hero_death_prophet: 0.56,
// 		npc_dota_hero_phantom_assassin: 0.3,
// 		npc_dota_hero_pugna: 0.5,
// 		npc_dota_hero_templar_assassin: 0.3,
// 		npc_dota_hero_viper: 0.33,
// 		npc_dota_hero_luna: 0.46,
// 		npc_dota_hero_dragon_knight: 0.5,
// 		npc_dota_hero_dazzle: 0.3,
// 		npc_dota_hero_rattletrap: 0.33,
// 		npc_dota_hero_leshrac: 0.4,
// 		npc_dota_hero_furion: 0.4,
// 		npc_dota_hero_life_stealer: 0.39,
// 		npc_dota_hero_dark_seer: 0.59,
// 		npc_dota_hero_clinkz: 0.7,
// 		npc_dota_hero_omniknight: 0.433,
// 		npc_dota_hero_enchantress: 0.3,
// 		npc_dota_hero_huskar: 0.4,
// 		npc_dota_hero_night_stalker: 0.55,
// 		npc_dota_hero_broodmother: 0.4,
// 		npc_dota_hero_bounty_hunter: 0.59,
// 		npc_dota_hero_weaver: 0.64,
// 		npc_dota_hero_jakiro: 0.4,
// 		npc_dota_hero_batrider: 0.3,
// 		npc_dota_hero_chen: 0.5,
// 		npc_dota_hero_spectre: 0.3,
// 		npc_dota_hero_doom_bringer: 0.5,
// 		npc_dota_hero_ancient_apparition: 0.45,
// 		npc_dota_hero_ursa: 0.3,
// 		npc_dota_hero_spirit_breaker: 0.6,
// 		npc_dota_hero_gyrocopter: 0.2,
// 		npc_dota_hero_alchemist: 0.35,
// 		npc_dota_hero_invoker: 0.4,
// 		npc_dota_hero_silencer: 0.5,
// 		npc_dota_hero_obsidian_destroyer: 0.46,
// 		npc_dota_hero_lycan: 0.55,
// 		npc_dota_hero_brewmaster: 0.35,
// 		npc_dota_hero_shadow_demon: 0.35,
// 		npc_dota_hero_lone_druid: 0.33,
// 		npc_dota_hero_chaos_knight: 0.5,
// 		npc_dota_hero_meepo: 0.38,
// 		npc_dota_hero_treant: 0.6,
// 		npc_dota_hero_ogre_magi: 0.3,
// 		npc_dota_hero_undying: 0.3,
// 		npc_dota_hero_rubick: 0.4,
// 		npc_dota_hero_disruptor: 0.4,
// 		npc_dota_hero_nyx_assassin: 0.46,
// 		npc_dota_hero_naga_siren: 0.5,
// 		npc_dota_hero_keeper_of_the_light: 0.3,
// 		npc_dota_hero_wisp: 0.15,
// 		npc_dota_hero_visage: 0.46,
// 		npc_dota_hero_slark: 0.5,
// 		npc_dota_hero_medusa: 0.5,
// 		npc_dota_hero_troll_warlord: 0.3,
// 		npc_dota_hero_centaur: 0.3,
// 		npc_dota_hero_magnataur: 0.5,
// 		npc_dota_hero_shredder: 0.36,
// 		npc_dota_hero_bristleback: 0.3,
// 		npc_dota_hero_tusk: 0.36,
// 		npc_dota_hero_skywrath_mage: 0.4,
// 		npc_dota_hero_abaddon: 0.56,
// 		npc_dota_hero_elder_titan: 0.35,
// 		npc_dota_hero_legion_commander: 0.46,
// 		npc_dota_hero_ember_spirit: 0.4,
// 		npc_dota_hero_earth_spirit: 0.35,
// 		npc_dota_hero_terrorblade: 0.3,
// 		npc_dota_hero_phoenix: 0.35,
// 		npc_dota_hero_oracle: 0.3,
// 		npc_dota_hero_techies: 0.5,
// 		npc_dota_hero_target_dummy: 0.5,
// 		npc_dota_hero_winter_wyvern: 0.25,
// 		npc_dota_hero_arc_warden: 0.3,
// 		npc_dota_hero_abyssal_underlord: 0.45,
// 		npc_dota_hero_monkey_king: 0.45,
// 		npc_dota_hero_pangolier: 0.33,
// 		npc_dota_hero_dark_willow: 0.3,
// 		npc_dota_hero_grimstroke: 0.35,
// 		npc_dota_hero_mars: 0.4,
// 	},
// 	block_orders = false,
// 	attackable_ents: Creep[] = [],
// 	glow_ents: Creep[] = [],
// 	glow_ents_old: Creep[] = []

// function EnoughDamage(sender: Hero, target: Unit, cur_time: number): boolean {
// 	let delay = sender.SecondsPerAttack + Utils.GetProjectileDelay(sender, target) + sender.GetRotationTime(target.Position) / 1000
// 	return target.CalculateDamageByHand(sender) > Utils.GetHealthAfter(target, delay, true, false, sender, melee_time_offset.value) - creep_hp_offset.value
// }

// Events.on("Draw", () => {
// 	if (hotkey.is_pressed) {
// 		if (Game.UIState === DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
// 			RendererSDK.Text("Auto LastHit enabled")
// 	} else {
// 		glow_ents_old = glow_ents
// 		glow_ents = []
// 	}
// 	glow_ents_old.filter(ent => ent.IsValid && !glow_ents.includes(ent)).forEach(ent => {
// 		ent.m_pBaseEntity.m_bSuppressGlow = true
// 		ent.m_pBaseEntity.m_Glow.m_bGlowing = false
// 		ent.m_pBaseEntity.m_Glow.m_iGlowType = 0
// 	})
// 	glow_ents.filter(ent => ent.IsValid).forEach(ent => {
// 		ent.m_pBaseEntity.m_bSuppressGlow = false
// 		ent.m_pBaseEntity.m_Glow.m_bFlashing = false
// 		ent.m_pBaseEntity.m_Glow.m_bGlowing = true
// 		ent.m_pBaseEntity.m_Glow.m_iGlowType = 1
// 		IOBuffer[0] = 255
// 		IOBuffer[1] = IOBuffer[2] = 0
// 		ent.m_pBaseEntity.m_Glow.m_glowColorOverride = true
// 	})
// 	glow_ents_old = glow_ents
// })

// Events.on("Tick", () => {
// 	if (!hotkey.is_pressed || Game.IsPaused)
// 		return
// 	let pl_ent = LocalPlayer.Hero
// 	if (pl_ent === undefined || !pl_ent.IsAlive)
// 		return
// 	let cur_time = Game.RawGameTime,
// 		attack_range = pl_ent.AttackRange * (pl_ent.HasAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK) ? 1 : 1.5) + pl_ent.HullRadius,
// 		max_range = Math.max(attack_range, glow_finder_range.value)
// 	// loop-optimizer: FORWARD
// 	let filtered = ArrayExtensions.orderBy((attackable_ents.filter(ent => {
// 		if (!ent.IsAlive || !ent.IsVisible)
// 			return false
// 		let use_enemy = mode.selected_id === AutoLH_Mode.LASTHIT || mode.selected_id === AutoLH_Mode.BOTH,
// 			use_ally = mode.selected_id === AutoLH_Mode.DENY || mode.selected_id === AutoLH_Mode.BOTH
// 		if (use_enemy && ent.IsEnemy(pl_ent))
// 			return true
// 		if (use_ally && !ent.IsEnemy(pl_ent) && ent.IsDeniable)
// 			return true
// 		return false
// 	}).map(ent => [ent, ent.Position.Distance2D(pl_ent.Position)]) as Array<[Creep, number]>).filter(([ent, dist]) => dist <= max_range).filter(([ent, dist]) => EnoughDamage(pl_ent, ent, cur_time)), ([creep]) => creep.HP)
// 	glow_ents = (glow_enabled.value && glow_finder_range.value !== 0 ? filtered.filter(([ent, dist]) => dist <= glow_finder_range.value) : filtered).map(a => a[0])
// 	if (!glow_only.value && !block_orders) {
// 		let ent_pair = filtered.filter(([ent, dist]) => dist <= (attack_range + ent.HullRadius))[0]
// 		if (ent_pair === undefined)
// 			return
// 		let ent = ent_pair[0]
// 		pl_ent.AttackTarget(ent, false)
// 		block_orders = true
// 		let done = false
// 		let data = setInterval(in_data => {
// 			if (!ent.IsValid || !ent.IsAlive) {
// 				block_orders = false
// 				done = true
// 				in_data.Destroy()
// 			}
// 		}, 30)
// 		setTimeout(() => {
// 			if (!done) {
// 				data.Destroy()
// 				block_orders = false
// 				done = true
// 			}
// 		}, pl_ent.SecondsPerAttack * 1000 - (attack_anim_point[pl_ent.Name] * delay_multiplier.value))
// 	}
// })
// EventsSDK.on("EntityCreated", npc => {
// 	if (npc instanceof Creep)
// 		attackable_ents.push(npc)
// })
// Events.on("EntityDestroyed", ent => {
// 	if (ent instanceof Creep)
// 		ArrayExtensions.arrayRemove(attackable_ents, ent)
// })
// Events.on("PrepareUnitOrders", order => hotkey.is_pressed && !glow_only.value ? Utils.OrdersWithoutSideEffects.includes(order.order_type) || !block_orders : true)

// EventsSDK.on("GameEnded", () => glow_ents = glow_ents_old = [])
