import { EventsSDK, EntityManager, LocalPlayer } from "./wrapper/Imports"
import { orderBy } from "wrapper/Utils/ArrayExtensions"
import { GetHealthAfter, GetRotationTime } from "Utils"

EventsSDK.on("onTick", () => {
	let pl_ent = LocalPlayer.Hero;
	if (pl_ent === undefined || !pl_ent.IsAlive)
		return;
	let mist_coil = pl_ent.AbilitiesBook.GetAbilityByName("abaddon_death_coil");
	if (mist_coil === undefined || !mist_coil.CanBeCasted())
		return;
	let dmg = mist_coil.GetSpecialValue("self_damage");
	{
		let talent = pl_ent.AbilitiesBook.GetAbilityByName("special_bonus_unique_abaddon_2");
		if (talent !== undefined && talent.Level !== 0)
			dmg += talent.GetSpecialValue("value");
	}
	if (GetHealthAfter(pl_ent.m_pBaseEntity, mist_coil.CastPoint, false) > dmg)
		return;
	let targets = orderBy (
		EntityManager.GetEntitiesInRange(pl_ent.Position, mist_coil.CastRange)
			.filter(ent => ent.m_pBaseEntity instanceof C_DOTA_BaseNPC_Hero || ent.m_pBaseEntity instanceof C_DOTA_BaseNPC_Creep),
		ent => GetRotationTime(pl_ent.m_pBaseEntity, ent.Position)
	);
	if (targets.length !== 0)
		pl_ent.CastTarget(mist_coil, targets[0], false);
})
