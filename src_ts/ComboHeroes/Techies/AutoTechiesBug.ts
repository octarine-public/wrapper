import { Ability, EntityManager, EventsSDK, GameSleeper, Hero, Menu, Vector3 } from "wrapper/Imports"

let root = Menu.AddEntry(["Heroes", "Techies", "5 year old bug"]),
	state = root.AddToggle("State", true),
	selected_ability = root.AddSwitcher("Ability to bug", [
		"techies_stasis_trap",
		"techies_suicide",
		"techies_remote_mines",
	], 1),
	sleeper = new GameSleeper(),
	last_abil: Ability

EventsSDK.on("Tick", () => {
	if (!state.value)
		return
	let techies = EntityManager.GetEntitiesByClass(Hero).find(ent =>
		ent.m_pBaseEntity instanceof C_DOTA_Unit_Hero_Techies
		&& ent.IsAlive
		&& ent.IsControllable,
	) as Hero
	if (techies === undefined)
		return
	if (techies.IsStunned && !sleeper.Sleeping("detonate")) {
		let abil = techies.GetAbilityByName("techies_focused_detonate")
		if (abil !== undefined && abil.CanBeCasted()) {
			techies.CastPosition(abil, new Vector3(-5000, -5000), false, true)
			sleeper.Sleep(100, "detonate")
		}
		return
	}
	let abil = techies.GetAbilityByName(selected_ability.values[selected_ability.selected_id])
	if (abil === undefined)
		return
	if (
		!EntityManager.GetEntitiesByClass(Hero)
			.filter(hero => hero !== techies && hero.FindRotationAngle(techies) <= 0.1)
			.some(hero => hero.Spells.some(abil_ => {
				if (
					abil_ !== undefined
					&& !sleeper.Sleeping(abil_)
					&& abil_.IsInAbilityPhase
					&& (
						abil_.Name === "bane_nightmare"
						|| abil_.Name === "shadow_demon_disruption"
						|| abil_.Name === "obsidian_destroyer_astral_imprisonment"
					)
					&& techies.IsInRange(hero, abil_.CastRange)
				) {
					last_abil = abil_
					return true
				}
				return false
			}))
	)
		return
	techies.CastPosition(abil, techies.InFront(50), false, true)
	sleeper.Sleep((last_abil.CastPoint + (
		last_abil.GetSpecialValue("disruption_duration")
		|| last_abil.GetSpecialValue("duration")
		|| last_abil.GetSpecialValue("prison_duration")
	)) * 1000 + 30, last_abil)
})

EventsSDK.on("GameStarted", () => sleeper.FullReset())
