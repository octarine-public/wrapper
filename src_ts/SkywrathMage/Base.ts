import { Hero, Modifier } from "../wrapper/Imports";

export default class Base {

	public Active(target: Hero, isstun: Modifier): boolean {
		let BorrowedTime = target.GetAbilityByName("abaddon_borrowed_time"),
			PowerCogs = target.GetAbilityByName("rattletrap_power_cogs"),
			BlackHole = target.GetAbilityByName("enigma_black_hole"),
			FiendsGrip = target.GetAbilityByName("bane_fiends_grip"),
			DeathWard = target.GetAbilityByName("witch_doctor_death_ward");

		return (target.Speed < 240
			|| (isstun !== undefined && isstun.Duration >= 1)
			|| target.GetBuffByName("modifier_skywrath_mystic_flare_aura_effect")
			|| target.HasModifier("modifier_rod_of_atos_debuff")
			|| target.HasModifier("modifier_crystal_maiden_frostbite")
			|| target.HasModifier("modifier_crystal_maiden_freezing_field")
			|| target.HasModifier("modifier_naga_siren_ensnare")
			|| target.HasModifier("modifier_meepo_earthbind")
			|| target.HasModifier("modifier_lone_druid_spirit_bear_entangle_effect")
			|| (target.HasModifier("modifier_legion_commander_duel") && target.HasScepter)
			|| target.HasModifier("modifier_kunkka_torrent")
			|| target.HasModifier("modifier_enigma_black_hole_pull")
			|| (BlackHole !== undefined && BlackHole.IsInAbilityPhase)
			|| target.HasModifier("modifier_ember_spirit_searing_chains")
			|| target.HasModifier("modifier_dark_troll_warlord_ensnare")
			|| target.HasModifier("modifier_rattletrap_cog_marker")
			|| (PowerCogs !== undefined && PowerCogs.IsInAbilityPhase)
			|| target.HasModifier("modifier_axe_berserkers_call")
			|| target.HasModifier("modifier_faceless_void_chronosphere_freeze")
			|| (FiendsGrip !== undefined && FiendsGrip.IsInAbilityPhase)
			|| (DeathWard !== undefined && DeathWard.IsInAbilityPhase)
			|| target.HasModifier("modifier_winter_wyvern_cold_embrace"))
			&& (BorrowedTime == null || BorrowedTime.Owner.HP > 2000 || BorrowedTime.Cooldown > 0)
			&& !target.HasModifier("modifier_dazzle_shallow_grave")
			&& !target.HasModifier("modifier_spirit_breaker_charge_of_darkness")
			&& !target.HasModifier("modifier_pugna_nether_ward_aura");
	}

	public Disable(target: Hero): boolean {
		let QueenofPainBlink = target.GetAbilityByName("queenofpain_blink"),
			AntiMageBlink = target.GetAbilityByName("antimage_blink"),
			ManaVoid = target.GetAbilityByName("antimage_mana_void"),
			Duel = target.GetAbilityByName("legion_commander_duel"),
			Doom = target.GetAbilityByName("doom_bringer_doom"),
			TimeWalk = target.GetAbilityByName("faceless_void_time_walk"),
			ChronoSphere = target.GetAbilityByName("faceless_void_chronosphere"),
			DeathWard = target.GetAbilityByName("witch_doctor_death_ward"),
			PowerCogs = target.GetAbilityByName("rattletrap_power_cogs"),
			Ravage = target.GetAbilityByName("tidehunter_ravage"),
			BerserkersCall = target.GetAbilityByName("axe_berserkers_call"),
			PrimalSplit = target.GetAbilityByName("brewmaster_primal_split"),
			GuardianAngel = target.GetAbilityByName("omniknight_guardian_angel"),
			SonicWave = target.GetAbilityByName("queenofpain_sonic_wave"),
			SlithereenCrush = target.GetAbilityByName("slardar_slithereen_crush"),
			FingerofDeath = target.GetAbilityByName("lion_finger_of_death"),
			LagunaBlade = target.GetAbilityByName("lina_laguna_blade");

		return (QueenofPainBlink !== undefined && QueenofPainBlink.IsInAbilityPhase)
			|| (AntiMageBlink !== undefined && AntiMageBlink.IsInAbilityPhase)
			|| (ManaVoid !== undefined && ManaVoid.IsInAbilityPhase)
			|| (Duel !== undefined && Duel.IsInAbilityPhase)
			|| (Doom !== undefined && Doom.IsInAbilityPhase)
			|| (TimeWalk !== undefined && TimeWalk.IsInAbilityPhase)
			|| (ChronoSphere !== undefined && ChronoSphere.IsInAbilityPhase)
			|| (DeathWard !== undefined && DeathWard.IsInAbilityPhase)
			|| (PowerCogs !== undefined && PowerCogs.IsInAbilityPhase)
			|| (Ravage !== undefined && Ravage.IsInAbilityPhase)
			|| (BerserkersCall !== undefined && BerserkersCall.IsInAbilityPhase)
			|| (PrimalSplit !== undefined && PrimalSplit.IsInAbilityPhase)
			|| (GuardianAngel !== undefined && GuardianAngel.IsInAbilityPhase)
			|| (SonicWave !== undefined && SonicWave.IsInAbilityPhase)
			|| (SlithereenCrush !== undefined && SlithereenCrush.IsInAbilityPhase)
			|| (FingerofDeath !== undefined && FingerofDeath.IsInAbilityPhase)
			|| (LagunaBlade !== undefined && LagunaBlade.IsInAbilityPhase);
	}

	public CancelCombo(target: Hero): boolean {
		return target.HasModifier("modifier_eul_cyclone")
			|| target.HasModifier("modifier_abaddon_borrowed_time")
			|| target.HasModifier("modifier_brewmaster_storm_cyclone")
			|| target.HasModifier("modifier_shadow_demon_disruption")
			|| target.HasModifier("modifier_obsidian_destroyer_astral_imprisonment_prison")
			|| target.HasModifier("modifier_tusk_snowball_movement")
			|| target.HasModifier("modifier_bane_nightmare")
			|| target.HasModifier("modifier_invoker_tornado")
			|| target.HasModifier("modifier_winter_wyvern_winters_curse");
	}
}