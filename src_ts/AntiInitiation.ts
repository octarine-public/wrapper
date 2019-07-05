import { Ability, LocalPlayer, MenuManager, EventsSDK, Game, ArrayExtensions, Unit, Vector3 } from "wrapper/Imports";

const rotation_speed = {
	npc_dota_hero_base: 0.5,
	npc_dota_hero_antimage: 0.5,
	npc_dota_hero_axe: 0.6,
	npc_dota_hero_bane: 0.6,
	npc_dota_hero_bloodseeker: 0.5,
	npc_dota_hero_crystal_maiden: 0.5,
	npc_dota_hero_drow_ranger: 0.7,
	npc_dota_hero_earthshaker: 0.9,
	npc_dota_hero_juggernaut: 0.6,
	npc_dota_hero_mirana: 0.5,
	npc_dota_hero_nevermore: 1,
	npc_dota_hero_morphling: 0.6,
	npc_dota_hero_phantom_lancer: 0.6,
	npc_dota_hero_puck: 0.5,
	npc_dota_hero_pudge: 0.7,
	npc_dota_hero_razor: 0.5,
	npc_dota_hero_sand_king: 0.5,
	npc_dota_hero_storm_spirit: 0.8,
	npc_dota_hero_sven: 0.6,
	npc_dota_hero_tiny: 0.5,
	npc_dota_hero_vengefulspirit: 0.6,
	npc_dota_hero_windrunner: 0.8,
	npc_dota_hero_zuus: 0.6,
	npc_dota_hero_kunkka: 0.6,
	npc_dota_hero_lina: 0.5,
	npc_dota_hero_lich: 0.5,
	npc_dota_hero_lion: 0.5,
	npc_dota_hero_shadow_shaman: 0.5,
	npc_dota_hero_slardar: 0.5,
	npc_dota_hero_tidehunter: 0.5,
	npc_dota_hero_witch_doctor: 0.5,
	npc_dota_hero_riki: 0.6,
	npc_dota_hero_enigma: 0.5,
	npc_dota_hero_tinker: 0.6,
	npc_dota_hero_sniper: 0.7,
	npc_dota_hero_necrolyte: 0.5,
	npc_dota_hero_warlock: 0.5,
	npc_dota_hero_beastmaster: 0.5,
	npc_dota_hero_queenofpain: 0.5,
	npc_dota_hero_venomancer: 0.5,
	npc_dota_hero_faceless_void: 1,
	npc_dota_hero_skeleton_king: 0.5,
	npc_dota_hero_death_prophet: 0.5,
	npc_dota_hero_phantom_assassin: 0.6,
	npc_dota_hero_pugna: 0.5,
	npc_dota_hero_templar_assassin: 0.7,
	npc_dota_hero_viper: 0.5,
	npc_dota_hero_luna: 0.6,
	npc_dota_hero_dragon_knight: 0.6,
	npc_dota_hero_dazzle: 0.6,
	npc_dota_hero_rattletrap: 0.6,
	npc_dota_hero_leshrac: 0.5,
	npc_dota_hero_furion: 0.6,
	npc_dota_hero_life_stealer: 1,
	npc_dota_hero_dark_seer: 0.6,
	npc_dota_hero_clinkz: 0.5,
	npc_dota_hero_omniknight: 0.6,
	npc_dota_hero_enchantress: 0.5,
	npc_dota_hero_huskar: 0.5,
	npc_dota_hero_night_stalker: 0.5,
	npc_dota_hero_broodmother: 0.5,
	npc_dota_hero_bounty_hunter: 0.6,
	npc_dota_hero_weaver: 0.5,
	npc_dota_hero_jakiro: 0.5,
	npc_dota_hero_batrider: 1,
	npc_dota_hero_chen: 0.6,
	npc_dota_hero_spectre: 0.5,
	npc_dota_hero_doom_bringer: 0.5,
	npc_dota_hero_ancient_apparition: 0.6,
	npc_dota_hero_ursa: 0.5,
	npc_dota_hero_spirit_breaker: 0.5,
	npc_dota_hero_gyrocopter: 0.6,
	npc_dota_hero_alchemist: 0.6,
	npc_dota_hero_invoker: 0.5,
	npc_dota_hero_silencer: 0.6,
	npc_dota_hero_obsidian_destroyer: 0.5,
	npc_dota_hero_lycan: 0.5,
	npc_dota_hero_brewmaster: 0.6,
	npc_dota_hero_shadow_demon: 0.6,
	npc_dota_hero_lone_druid: 0.5,
	npc_dota_hero_chaos_knight: 0.5,
	npc_dota_hero_meepo: 0.65,
	npc_dota_hero_treant: 0.5,
	npc_dota_hero_ogre_magi: 0.6,
	npc_dota_hero_undying: 0.6,
	npc_dota_hero_rubick: 0.7,
	npc_dota_hero_disruptor: 0.5,
	npc_dota_hero_nyx_assassin: 0.5,
	npc_dota_hero_naga_siren: 0.5,
	npc_dota_hero_keeper_of_the_light: 0.5,
	npc_dota_hero_wisp: 0.7,
	npc_dota_hero_visage: 0.5,
	npc_dota_hero_slark: 0.6,
	npc_dota_hero_medusa: 0.5,
	npc_dota_hero_troll_warlord: 0.5,
	npc_dota_hero_centaur: 0.5,
	npc_dota_hero_magnataur: 0.8,
	npc_dota_hero_shredder: 0.6,
	npc_dota_hero_bristleback: 1,
	npc_dota_hero_tusk: 0.7,
	npc_dota_hero_skywrath_mage: 0.5,
	npc_dota_hero_abaddon: 0.5,
	npc_dota_hero_elder_titan: 0.5,
	npc_dota_hero_legion_commander: 0.5,
	npc_dota_hero_ember_spirit: 0.5,
	npc_dota_hero_earth_spirit: 0.6,
	npc_dota_hero_terrorblade: 0.5,
	npc_dota_hero_phoenix: 1,
	npc_dota_hero_oracle: 0.7,
	npc_dota_hero_techies: 0.5,
	npc_dota_hero_target_dummy: 0.5,
	npc_dota_hero_winter_wyvern: 0.5,
	npc_dota_hero_arc_warden: 0.6,
	npc_dota_hero_abyssal_underlord: 0.6,
	npc_dota_hero_monkey_king: 0.6,
	npc_dota_hero_pangolier: 1,
	npc_dota_hero_dark_willow: 0.7,
	npc_dota_hero_grimstroke: 0.6,
	npc_dota_hero_mars: 0.8,
};
// Menu
const Menu = MenuManager.MenuFactory("AntiInitiation");
const MenuState = Menu.AddToggle("State");
const Additionaldelay = Menu.AddSliderFloat("Additional delay", 0.03, 0.03);

var Abils_ = [
	[ // HexAbils
		["lion_voodoo", true, true],
		["shadow_shaman_voodoo", true, true],
	],
	[ // DisableAbils
		["axe_berserkers_call", true],
		["puck_waning_rift", true],
		["crystal_maiden_frostbite", true],
		["skywrath_mage_ancient_seal", true],
		["doom_bringer_doom", false],
	],
	[ // StunAbils
		["dragon_knight_dragon_tail", true],
		["tidehunter_ravage", true],
		["earthshaker_echo_slam", false, true],
		["earthshaker_fissure", false],
		["magnataur_reverse_polarity", false],
		["beastmaster_primal_roar", true],
		["treant_overgrowth", false],
		["faceless_void_chronosphere", false],
		["batrider_flaming_lasso", true],
		["slardar_slithereen_crush", false],
		["enigma_black_hole", false],
		["shadow_shaman_shackles", false],
		["sven_storm_bolt", true],
		["lion_impale", true],
		["centaur_hoof_stomp", false],
		["vengefulspirit_magic_missile", true],
		["sand_king_burrowstrike", true],
		["nyx_assassin_impale", true],
		["chaos_knight_chaos_bolt", false],
		["tiny_avalanche", true],
		["ogre_magi_fireblast", true],
		["obsidian_destroyer_astral_imprisonment", true],
		["rubick_telekinesis", true],
		["pudge_dismember", true],
		["invoker_cold_snap", true],
		["invoker_tornado", true],
		["dark_seer_vacuum", true],
		["bane_nightmare", true],
		["rattletrap_hookshot", true],
		["tusk_walrus_kick", true],
	],
	[ // OtherAbils
		["dark_seer_wall_of_replica", false],
		["queenofpain_sonic_wave", false],
		["queenofpain_blink", false],
		["antimage_blink", false],
		["faceless_void_time_walk", false],
		["antimage_mana_void", false],
		["legion_commander_duel", false],
		["witch_doctor_death_ward", false],
		["rattletrap_power_cogs", false],
		["brewmaster_primal_split", false],
		["omniknight_guardian_angel", false],
		["lion_finger_of_death", false],
		["lina_laguna_blade", false],
		["juggernaut_omni_slash", false],
		["slark_pounce", false],
		["axe_culling_blade", false],
		["phoenix_supernova", false],
		["riki_smoke_screen", false],
		["riki_tricks_of_the_trade", false],
		["riki_blink_strike", false],
	],
	[ // AntiInitItems
		["item_sheepstick", true, true],
		["item_orchid", true, true],
		["item_bloodthorn", true, true],
		["item_cyclone", true, true],
		["item_blink", false, true],
		["item_heavens_halberd", true, true],
		["item_nullifier", true, true],
		["item_abyssal_blade", true, true],
	],
].flat(1) as Array<[string, boolean, boolean?]>,
	BuffsDisablers_ = [[ // any _target_ (micro-)stun
		["lion_voodoo", true, true],
		["shadow_shaman_voodoo", true, true],
		["crystal_maiden_frostbite", true],
		["ogre_magi_fireblast", true],
		["lion_impale", true],
		["sven_storm_bolt", true],
		["beastmaster_primal_roar", true],
		["rubick_telekinesis", true],
		["sand_king_burrowstrike", true],
		["item_sheepstick", true, true],
		["item_cyclone", true, true],
		["item_heavens_halberd", true, true],
	]].flat(1) as Array<[string, boolean, boolean?]>,
	DisableBuffs: string[] = [
		"modifier_teleporting",
		"modifier_techies_suicide_leap",
		"modifier_monkey_king_bounce_leap",
		"modifier_spirit_breaker_charge_of_darkness",
	],
	Abils: Array<[string, boolean, boolean?]> = [],
	BuffsDisablers: Array<[string, boolean, boolean?]> = [],
	heroes: Unit[] = [];

function GetAbilityByName(ent: Unit, name: string): Ability {
	let abils = ent.Spells;
	for (let i = 0, len = abils.length; i < len; i++) {
		let abil = (abils[i] as Ability);
		if (abil === undefined)
			continue;
		if (abil.AbilityData.Name === name)
			return abil;
	}
	return undefined;
}
function GetAbilArray(abilNameToSearch: string) {
	return Abils_.find(abilAr => abilAr[0] === abilNameToSearch);
}
function GetAngle(npc: Unit, vec: Vector3): number {
	let npc_pos = npc.NetworkPosition,
		angle = Math.abs(Math.atan2(npc_pos.y - vec.y, npc_pos.x - vec.x) - npc.Forward.Angle);
	if (angle > Math.PI)
		angle = Math.abs((Math.PI * 2) - angle);
	return angle;
}
function GetRotationTime(npc: Unit, vec: Vector3): number {
	let turn_rad = Math.PI - 0.25,
		ang = GetAngle(npc, vec)
	if (ang > turn_rad)
		return 0;
	return 30 * ang / rotation_speed[npc.Name];
}
function Disable(Me: Unit, hero: Unit, DisableAr: Array<[string, boolean, boolean?]>, Abil?: Ability) {
	let delta = (GetLatency(Flow_t.IN) + GetLatency(Flow_t.OUT)) - GetRotationTime(hero, hero.NetworkPosition) / 1000 + Additionaldelay.value;
	let AbilAr: [string, boolean, boolean?];
	if (Abil !== undefined) {
		if (!Abil.IsInAbilityPhase || Game.GameTime - Abil.ChannelStartTime < Abil.CastPoint - delta || (AbilAr = GetAbilArray(Abil.Name)) === undefined || AbilAr[2])
			return false;
	}
	let disable_abil = DisableAr.filter(abilAr => abilAr[1]).map(abilAr => {
		let abil_name = abilAr[0];
		return abil_name.startsWith("item_") ? Me.Inventory.GetItemByName(abil_name) : GetAbilityByName(Me, abil_name);
	}).find(abil => {
		if (abil === undefined)
			return false;
		return !abil.IsHidden
			&& abil.Cooldown === 0
			&& Me.Mana >= abil.ManaCost
			&& (abil.CastRange <= 0 || Me.NetworkPosition.Distance2D(hero.NetworkPosition) <= abil.CastRange + hero.HullRadius * 2);
	});
	if (disable_abil === undefined)
		return false;
	Me.UseSmartAbility(disable_abil, hero);
	return true;
}
Events.on("Tick", () => {
	if (!MenuState.value || Game.IsPaused || LocalPlayer === undefined)
		return;
	const Me = LocalPlayer;
	if (Me.Hero === undefined)
		return;
	if (!Me.Hero.IsAlive || Me.Hero.IsIllusion || Me.Hero.IsInvulnerable || Me.Hero.IsStunned)
		return;
	let needed_heroes = heroes.filter(hero => hero.IsVisible && hero.IsAlive && hero !== undefined);
	if (needed_heroes.some(hero => hero.Spells.some(abil => abil && Disable(Me.Hero, hero, Abils, abil))))
		return;
	if (needed_heroes.some(hero => hero.Buffs.some(buff => DisableBuffs.includes(buff.Name)) && Disable(Me.Hero, hero, BuffsDisablers)))
		return;
});
EventsSDK.on("EntityCreated", (npc: Unit) => {
	if (!MenuState.value || LocalPlayer.Hero === undefined || npc === undefined || LocalPlayer.Hero === npc)
		return;
	if (!npc.IsValid || !npc.IsHero || !npc.IsEnemy || !npc.IsAlive || npc.IsIllusion || !npc.IsVisible)
		return;
	heroes.push(npc);
});
EventsSDK.on("EntityDestroyed", (npc: Unit) => ArrayExtensions.arrayRemove(heroes, npc));
function TransformToAvailable(abil_arrays: Array<[string, boolean, boolean?]>): Array<[string, boolean, boolean?]> {
	let Me = LocalPlayer;
	if (Me.Hero === undefined)
		return;
	let name = Me.Hero.Name;
	if (name === "npc_dota_hero_rubick" || name === "npc_dota_hero_morphling")
		return abil_arrays;
	return abil_arrays.filter(abilData => abilData[0].startsWith("item_") || GetAbilityByName(Me.Hero, abilData[0]) !== undefined);
}
Events.on("GameStarted", (Me: C_DOTA_BaseNPC_Hero) => {
	let Player = LocalPlayer;
	if (Player.Hero === undefined || Me === undefined)
		return;
	Abils = TransformToAvailable(Abils_);
	BuffsDisablers = TransformToAvailable(BuffsDisablers_);
});