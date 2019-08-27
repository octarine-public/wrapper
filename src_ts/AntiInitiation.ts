import { Ability, ArrayExtensions, EventsSDK, Game, Hero, LocalPlayer, Menu, Unit } from "wrapper/Imports"

// Menu
const MenuEntry = Menu.AddEntry(["Utility", "AntiInitiation"])
const MenuState = MenuEntry.AddToggle("State")
const Additionaldelay = MenuEntry.AddSliderFloat("Additional delay", 0.03, 0.03)

// loop-optimizer: KEEP
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
		["item_heavens_halberd", true, true],
		["item_nullifier", true, true],
		["item_abyssal_blade", true, true],
	],
].flat(1).map(([name, is_disable, instant]) => [name, is_disable, instant || false]) as Array<[string, boolean, boolean]>,
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
	]].flat(1).map(([item_name, is_disable, instant]) => [item_name, is_disable, instant || false]) as Array<[string, boolean, boolean]>,
	DisableBuffs: string[] = [
		"modifier_teleporting",
		"modifier_techies_suicide_leap",
		"modifier_monkey_king_bounce_leap",
		"modifier_spirit_breaker_charge_of_darkness",
	],
	Abils: Array<[string, boolean, boolean?]> = [],
	BuffsDisablers: Array<[string, boolean, boolean?]> = [],
	heroes: Unit[] = [],
	ignore_heroes = new Map<Unit, number>()

function GetAbilArray(abilNameToSearch: string) {
	return Abils_.find(abilAr => abilAr[0] === abilNameToSearch)
}

function Disable(Me: Hero, hero: Unit, DisableAr: Array<[string, boolean, boolean?]>, Abil?: Ability): boolean {
	let delta = Me.GetRotationTime(hero.NetworkPosition) / 1000 + Additionaldelay.value
	let AbilAr: [string, boolean, boolean?]
	if (hero === Me)
		return false
	if (
		Abil !== undefined
		&& (
			!Abil.IsInAbilityPhase
			|| Game.RawGameTime - Abil.CastStartTime < Abil.CastPoint - (GetLatency(Flow_t.IN) + GetLatency(Flow_t.OUT) + delta)
			|| (AbilAr = GetAbilArray(Abil.Name)) === undefined
			|| AbilAr[2]
		)
	)
		return false
	let disable_abil = DisableAr.filter(abilAr => abilAr[1]).map(abilAr => {
		let abil_name = abilAr[0]
		return abil_name.startsWith("item_") ? Me.GetItemByName(abil_name) : Me.GetAbilityByName(abil_name)
	}).find(abil =>
		abil !== undefined
		&& !abil.IsHidden
		&& abil.Level !== 0
		&& abil.Cooldown === 0
		&& Me.Mana >= abil.ManaCost
		&& (abil.CastRange <= 0 || Me.NetworkPosition.Distance2D(hero.NetworkPosition) <= abil.CastRange + hero.HullRadius * 2),
	)
	if (disable_abil === undefined)
		return false
	Me.UseSmartAbility(disable_abil, hero)
	ignore_heroes.set(hero, Game.RawGameTime + delta + GetLatency(Flow_t.OUT))
	return true
}

EventsSDK.on("Update", () => {
	if (!MenuState.value || Game.IsPaused || LocalPlayer === undefined)
		return
	const Me = LocalPlayer,
		hero = Me.Hero
	if (hero === undefined || !hero.IsAlive || hero.IsStunned)
		return
	let current_time = Game.RawGameTime
	// loop-optimizer: KEEP
	ignore_heroes.forEach((until, hero_) => {
		if (current_time > until)
			ignore_heroes.delete(hero_)
	})
	let needed_heroes = heroes.filter(hero_ => hero_.IsVisible && hero_.IsAlive)
	if (needed_heroes.some(hero_ =>
		!ignore_heroes.has(hero_)
		&& (
			hero_.Spells.some(abil => abil && Disable(hero, hero_, Abils, abil))
			|| hero_.Buffs.some(buff => DisableBuffs.includes(buff.Name) && Disable(Me.Hero, hero_, BuffsDisablers))
		),
	))
		return
})

EventsSDK.on("EntityCreated", (npc: Unit) => {
	if (npc.IsHero && npc.IsEnemy && !npc.IsIllusion)
		heroes.push(npc)
})

EventsSDK.on("EntityDestroyed", npc => npc instanceof Unit && ArrayExtensions.arrayRemove(heroes, npc))

function TransformToAvailable(hero: Hero, abil_arrays: Array<[string, boolean, boolean?]>): Array<[string, boolean, boolean?]> {
	if (hero.m_pBaseEntity instanceof C_DOTA_Unit_Hero_Rubick || hero.m_pBaseEntity instanceof C_DOTA_Unit_Hero_Morphling)
		return abil_arrays
	return abil_arrays.filter(abilData => abilData[0].startsWith("item_") || hero.GetAbilityByName(abilData[0]) !== undefined)
}

EventsSDK.on("GameStarted", hero => {
	Abils = TransformToAvailable(hero, Abils_)
	BuffsDisablers = TransformToAvailable(hero, BuffsDisablers_)
})
