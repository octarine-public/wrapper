import { Ability, ArrayExtensions, Color, EventsSDK, Game, Hero, Item, Menu, ParticlesSDK, RendererSDK, Utils, Vector2, Vector3 } from "wrapper/Imports"

const menu = Menu.AddEntry(["Heroes", "SkyWrathCombo"]),
	active = menu.AddToggle("Active"),
	ezKill = menu.AddToggle("Check for EZ Kill"),
	comboToggle = menu.AddToggle("Clamp combo key"),
	comboKey = menu.AddKeybind("Combo Key"),
	harrasKey = menu.AddKeybind("Harras Key"),
	cursorRadius = menu.AddSlider("Nearest cursor radius", 200, 100, 1000),
	linken_settings = menu.AddNode("Linken Settings"),
	popLinkV = linken_settings.AddToggle("Pop Linken"),
	popLinkItems = linken_settings.AddImageSelector(
			"Pop Linken with",
		[
			"item_nullifier",
			"item_cyclone",
			"item_rod_of_atos",
			"item_sheepstick",
			"item_force_staff",
			"item_dagon_5",
			"item_orchid",
			"item_bloodthorn",
			"skywrath_mage_ancient_seal",
			"skywrath_mage_arcane_bolt",
			"item_hurricane_pike",
		],
	),
	bmcheck = menu.AddToggle("Check BladeMail"),
	soulRing = menu.AddToggle("Enable SoulRing"),
	blinkV = menu.AddToggle("Enable Blink"),
	blinkRadius = menu.AddSlider("Blink distance from enemy", 200, 0, 800),
	doubleFlare = menu.AddToggle("Double Mystic Flare"),
	ability_items_settings = menu.AddNode("Active - Abilities/Items"),
	abils = ability_items_settings.AddImageSelector(
			"Active abilities",
		[
			"skywrath_mage_arcane_bolt",
			"skywrath_mage_concussive_shot",
			"skywrath_mage_ancient_seal",
			"skywrath_mage_mystic_flare",
		],
	),
	items = ability_items_settings.AddImageSelector(
			"Active items",
		[
			"item_rod_of_atos",
			"item_sheepstick",
			"item_ethereal_blade",
			"item_veil_of_discord",
			"item_dagon_5",
			"item_orchid",
			"item_bloodthorn",
			"item_shivas_guard",
			"item_nullifier",
		],
	),
	drawable = menu.AddNode("Drawable"),
	// heroMenu = menu.AddNode("Hero Specifics"),
	// amReflect = heroMenu.AddToggle("Enabled Pop AM Reflect"),
	// amReflectItems = heroMenu.AddImageSelector(
	// 		"Pop AM Reflect",
	// 	[
	// 		"item_nullifier",
	// 		"item_cyclone",
	// 		"item_rod_of_atos",
	// 		"item_force_staff",
	// 		"item_dagon_5",
	// 		"skywrath_mage_arcane_bolt",
	// 	],
	// ), 
	drawTargetParticle = drawable.AddToggle("Draw line to target"),
	concShot = drawable.AddToggle("Draw concusive shot indicator"),
	drawStatus = drawable.AddToggle("Draw status"),
	statusPosX = drawable.AddSlider("Position X (%)", 19, 0, 100),
	statusPosY = drawable.AddSlider("Position Y (%)", 4, 0, 100),
	textSize = drawable.AddSlider("Text size", 15, 10, 30),
	FarPredict = 390,
	DoubleMFRootedPredict = 610,
	DoubleMFUnrootedPredict = 750,
	mods = ["modifier_winter_wyvern_winters_curse", "modifier_item_lotus_orb_active", "modifier_medusa_stone_gaze_stone", "modifier_oracle_fates_edict"],
	CloseInPredict = 300

let sky: Hero,
	nearest: Hero,
	target: Hero,
	heroes: Hero[] = [],
	targetParticle: number,
	comboKeyPress = false,
	bolt: Ability,
	shot: Ability,
	seal: Ability,
	flare: Ability,
	atos: Item,
	nullifier: Item,
	hex: Item,
	veil: Item,
	eblade: Item,
	dagon: Item,
	orchid: Item,
	blood: Item,
	shiva: Item,
	cyclone: Item,
	forcestaff: Item,
	hurricane: Item,
	soulring: Item,
	blink: Item,
	debuffed = false,
	IsEZKillable = false,
	cshotenemy: Hero,
	currentcshot: Hero,
	cshotparticle: number,
	lastCheckTime: number

comboKey.OnValue(caller => comboKeyPress = caller.is_pressed)

EventsSDK.on("GameStarted", hero => {
	if (hero.m_pBaseEntity instanceof C_DOTA_Unit_Hero_Skywrath_Mage) {
		sky = hero
		getAbils()
	}
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof Hero)
		ArrayExtensions.arrayRemove(heroes, ent)
})
EventsSDK.on("EntityCreated", npc => {
	if (
		npc instanceof Hero
		&& npc.IsEnemy()
		&& !npc.IsIllusion
	)
		heroes.push(npc)
})
EventsSDK.on("GameEnded", () => {
	sky = undefined
	heroes = []
	nearest = undefined
	target = undefined
	comboKeyPress = false
	bolt = undefined
	shot = undefined
	seal = undefined
	flare = undefined
	atos = undefined
	nullifier = undefined
	hex = undefined
	veil = undefined
	eblade = undefined
	dagon = undefined
	orchid = undefined
	blood = undefined
	shiva = undefined
	cyclone = undefined
	forcestaff = undefined
	hurricane = undefined
	soulring = undefined
	blink = undefined
	debuffed = false
	IsEZKillable = false
	lastCheckTime = undefined
	if (targetParticle !== undefined) {
		ParticlesSDK.Destroy(targetParticle, true)
		targetParticle = undefined
	}
	if (cshotparticle !== undefined) {
		ParticlesSDK.Destroy(cshotparticle, true)
		cshotparticle = undefined
		currentcshot = undefined
		cshotenemy = undefined
	}
})
EventsSDK.on("Tick", () => {
	if (!active.value || !Game.IsInGame || Game.IsPaused || sky === undefined || !sky.IsAlive)
		return
	if (!comboToggle.value && comboKeyPress) {
		if (target !== undefined) {
			target = undefined
		}else if (nearest !== undefined) {
			target = nearest
		}
		comboKeyPress = false
	} else if (comboToggle.value && comboKey.is_pressed) {
		target = nearest
	} else if (comboToggle.value && !comboKey.is_pressed) {
		target = undefined
	}
	if (target !== undefined) {
		if (!target.IsAlive)
			target = undefined
		if (sky.CanAttack(target))
			sky.AttackTarget(target)
		if (checkMods() && !target.IsMagicImmune) {
			getAbils()
			getItems()
			debuffed = IsDebuffed()
			// if (amReflect.value && target.Name === "npc_dota_hero_antimage"
			// 	&& !target.ModifiersBook.HasAnyBuffByNames(["modifier_silver_edge_debuff", "modifier_viper_nethertoxin"])
			// 	&& target.GetAbilityByName("antimage_spell_shield").IsReady) {
			// 	if (popLink(forcestaff, amReflectItems.IsEnabled("item_force_staff"))) return
			// 	if (popLink(cyclone, amReflectItems.IsEnabled("item_cyclone"))) return
			// 	if (popLink(atos, amReflectItems.IsEnabled("item_rod_of_atos"))) return
			// 	if (popLink(bolt, amReflectItems.IsEnabled("skywrath_mage_arcane_bolt"))) return
			// 	if (popLink(dagon, amReflectItems.IsEnabled("item_dagon_5"))) return
			// 	if (popLink(nullifier, amReflectItems.IsEnabled("item_nullifier"))) return
			// 	return
			// }
			if (popLinkV.value && target.HasLinkenAtTime()) {
				if (popLink(nullifier, popLinkItems.IsEnabled("item_nullifier"))) return
				if (popLink(cyclone, popLinkItems.IsEnabled("item_cyclone"))) return
				if (popLink(atos, popLinkItems.IsEnabled("item_rod_of_atos"))) return
				if (popLink(hex, popLinkItems.IsEnabled("item_sheepstick"))) return
				if (popLink(forcestaff, popLinkItems.IsEnabled("item_force_staff"))) return
				if (popLink(dagon, popLinkItems.IsEnabled("item_dagon_5"))) return
				if (popLink(orchid, popLinkItems.IsEnabled("item_orchid"))) return
				if (popLink(blood, popLinkItems.IsEnabled("item_bloodthorn"))) return
				if (popLink(seal, popLinkItems.IsEnabled("skywrath_mage_ancient_seal"))) return
				if (popLink(bolt, popLinkItems.IsEnabled("skywrath_mage_arcane_bolt"))) return
				if (popLink(hurricane, popLinkItems.IsEnabled("item_hurricane_pike"))) return
				return
			}
			if (!target.IsStunned && !target.IsHexed)
				if (useItem(hex, items.IsEnabled("item_sheepstick"))) return
			if (sky.IsInRange(target, 700) && !target.ModifiersBook.HasAnyBuffByNames(["modifier_teleporting"]))
				IsEZKillable = killCheck()
			if (soulRing.value && soulring !== undefined && soulring.IsReady) {
				sky.CastNoTarget(soulring)
				return
			}
			if (
				useBlink()
				|| aeonDispelling()
				|| castAbility(shot, abils.IsEnabled("skywrath_mage_concussive_shot"))
				|| useItem(atos, items.IsEnabled("item_rod_of_atos"))
				|| castAbility(seal, abils.IsEnabled("skywrath_mage_ancient_seal"))
				|| useItem(veil, items.IsEnabled("item_veil_of_discord"))
				|| useItem(eblade, items.IsEnabled("item_ethereal_blade"))
				|| castAbility(bolt, abils.IsEnabled("skywrath_mage_arcane_bolt"))
				|| castAbility(flare, abils.IsEnabled("skywrath_mage_mystic_flare"))
				|| useItem(orchid, items.IsEnabled("item_orchid"))
				|| useItem(dagon, items.IsEnabled("item_dagon_5"))
				|| useItem(blood, items.IsEnabled("item_bloodthorn"))
				|| useItem(shiva, items.IsEnabled("item_shivas_guard"))
			)
				return
			if (!target.ModifiersBook.HasAnyBuffByNames(["modifier_item_nullifier_mute"]) && !target.IsHexed) {
				const item = target.GetItemByName("item_aeon_disk")
				if (item !== undefined && !item.IsReady && useItem(nullifier, items.IsEnabled("item_nullifier")))
					return
				else if (item === undefined && useItem(nullifier, items.IsEnabled("item_nullifier")))
					return
				return
			}
		}
	}
	if (harrasKey.is_pressed) {
		if (nearest !== undefined) {
			if (sky.CanAttack(nearest))
				sky.AttackTarget(nearest)
			if (!checkMods(true) || nearest.IsMagicImmune)
				return
			getAbils()
			if (castAbility(bolt, abils.IsEnabled("skywrath_mage_arcane_bolt"), true))
				return
		}
	}
})
function aeonDispelling() {
	if (nullifier !== undefined && nullifier.IsReady) {
		const buff = target.ModifiersBook.GetBuffByName("modifier_item_aeon_disk_buff"),
			aeon = target.GetItemByName("item_aeon_disk")
		if (aeon !== undefined && (target.HPPercent < (aeon.GetSpecialValue("health_threshold_pct") + 3) * 0.01 || buff !== undefined)) {
			sky.CastTarget(nullifier, target)
			return true
		}
	}
	return false
}
function killCheck() {
	if (!ezKill.value)
		return false
	if (Game.GameTime < lastCheckTime + 4) return IsEZKillable
	const int = sky.TotalIntelligence
	let amp = sky.SpellAmplification + sky.GetTalentValue("special_bonus_unique_skywrath_3") * -0.01,
		reqMana = 0,
		damage = 0
	if (veil && veil.IsReady && items.IsEnabled("item_veil_of_discord")) {
		amp += veil.GetSpecialValue("resist_debuff") * -0.01
		reqMana += veil.ManaCost
	}
	if (seal && seal.IsReady && abils.IsEnabled("skywrath_mage_mystic_flare")) {
		amp += seal.GetSpecialValue("resist_debuff") * -0.01
		reqMana += seal.ManaCost
	}
	if (eblade && eblade.IsReady && items.IsEnabled("item_ethereal_blade")) {
		amp += eblade.GetSpecialValue("ethereal_damage_bonus") * -0.01
		reqMana += eblade.ManaCost
		damage += eblade.GetSpecialValue("blast_damage_base") + eblade.GetSpecialValue("blast_agility_multiplier") * int
	}
	if (dagon && dagon.IsReady && items.IsEnabled("item_dagon_5")) {
		reqMana += dagon.ManaCost
		damage += dagon.GetSpecialValue("dagon")
	}
	if (bolt && bolt.IsReady && abils.IsEnabled("skywrath_mage_arcane_bolt")) {
		const mult = bolt.CooldownLenght <= 2 ? 2 : 1
		damage += (bolt.GetSpecialValue("bolt_damage") + bolt.GetSpecialValue("int_multiplier") * int) * mult
		reqMana += bolt.ManaCost * mult
	}
	if (shot && shot.IsReady && abils.IsEnabled("skywrath_mage_concussive_shot")) {
		damage += shot.GetSpecialValue("damage")
		reqMana += shot.ManaCost
	}
	damage *= 1 + amp - target.MagicDamageResist * 0.01
	if (reqMana < sky.Mana && target.HP <= damage) {
		lastCheckTime = Game.GameTime
		return true
	}
	return false
}
function useItem(item: Item, val: boolean) {
	if (item !== undefined && val && item.IsReady && sky.IsInRange(target, item.CastRange)) {
		if (item === shiva) {
			sky.CastNoTarget(item)
			return true
		}
		if (item === dagon && debuffed) {
			sky.CastTarget(item, target)
			return true
		}
		if (item === veil) {
			sky.CastPosition(item, target.NetworkPosition)
			return true
		}
		if (item !== dagon) {
			sky.CastTarget(item, target)
			return true
		}
	}
	return false
}
function castAbility(ability: Ability, val: boolean, near= false) {
	if (ability !== undefined && val && ability.IsReady) {
		if (ability === shot) {
			sky.CastNoTarget(ability)
			return true
		}
		if (ability === flare) {
			if (debuffed && !IsEZKillable) {
				CastToPrediction(near)
				return true
			}
		}else {
			let trgt = near ? nearest : target
			sky.CastTarget(ability, trgt)
			return true
		}
	}
	return false
}
function CastToPrediction(near= false) {
	let trgt = near ? nearest : target
	if (doubleFlare.value && sky.HasScepter) {
		if (trgt.IsRooted || trgt.IsStunned)
			sky.CastPosition(flare, IsFront(DoubleMFRootedPredict, near))
		else if (trgt.IsMoving)
			sky.CastPosition(flare, IsFront(DoubleMFUnrootedPredict, near))
		else
			sky.CastPosition(flare, IsFront(630, near))
		return
	}
	if (trgt.ModifiersBook.HasAnyBuffByNames(["modifier_rune_haste"])) {
		if (trgt.IsRooted)
			sky.CastPosition(flare, IsFront(CloseInPredict, near))
		else
			return
	}
	if (trgt.IsHexed || trgt.IsRooted) {
		sky.CastPosition(flare, IsFront(CloseInPredict, near))
		return
	}
	sky.CastPosition(flare, IsFront(FarPredict, near))
}
function IsFront(delay, near= false) {
	let trgt = near ? nearest : target,
		adjusment = 0
	if (delay === 610)
		adjusment = 300
	else
		adjusment = trgt.IdealSpeed
	return trgt.InFront(delay / 1000 * adjusment)
}
function useBlink() {
	if (blinkV.value && blink !== undefined && blink.IsReady) {
		if (target.IsInRange(sky, 600))
			return false
		let castRange = blink.GetSpecialValue("blink_range") + sky.CastRangeBonus,
			distance = target.NetworkPosition.Subtract(sky.NetworkPosition),
			disToTarget = sky.Distance(target)
		distance.SetZ(0)
		distance.Normalize()
		if (disToTarget > castRange) {
			let di = disToTarget - castRange,
				minus = 0
			if (di < blinkRadius.value)
				minus = blinkRadius.value - di
			distance.ScaleTo(castRange - 1 - minus)
		}else {
			distance.ScaleTo(disToTarget - blinkRadius.value - 1)
		}
		sky.CastPosition(blink, sky.NetworkPosition.Add(distance))
		return true
	}
	return false
}
function getAbils() {
	bolt = sky.GetAbilityByName("skywrath_mage_arcane_bolt")
	shot = sky.GetAbilityByName("skywrath_mage_concussive_shot")
	seal = sky.GetAbilityByName("skywrath_mage_ancient_seal")
	flare = sky.GetAbilityByName("skywrath_mage_mystic_flare")
}
function getItems() {
	atos = sky.GetItemByName("item_rod_of_atos")
	nullifier = sky.GetItemByName("item_nullifier")
	hex = sky.GetItemByName("item_sheepstick")
	veil = sky.GetItemByName("item_veil_of_discord")
	eblade = sky.GetItemByName("item_ethereal_blade")
	nullifier = sky.GetItemByName("item_nullifier")
	dagon = sky.GetItemByName(/item_dagon/)
	orchid = sky.GetItemByName("item_orchid")
	blood = sky.GetItemByName("item_bloodthorn")
	shiva = sky.GetItemByName("item_shivas_guard")
	cyclone = sky.GetItemByName("item_cyclone")
	forcestaff = sky.GetItemByName("item_force_staff")
	hurricane = sky.GetItemByName("item_hurricane_pike")
	soulring = sky.GetItemByName("item_soul_ring")
	blink = sky.GetItemByName("item_blink")
}
function IsDebuffed() {
	if (atos && atos.IsReady && items.IsEnabled("item_rod_of_atos") && target.ModifiersBook.HasBuffByName("modifier_item_rod_of_atos"))
		return false
	if (veil && veil.IsReady && items.IsEnabled("item_veil_of_discord") && target.ModifiersBook.HasBuffByName("modifier_item_veil_of_discord"))
		return false
	if (orchid && orchid.IsReady && items.IsEnabled("item_orchid") && target.ModifiersBook.HasBuffByName("modifier_item_orchid_malevolence"))
		return false
	if (eblade && eblade.IsReady && items.IsEnabled("item_ethereal_blade") && target.ModifiersBook.HasBuffByName("modifier_item_ethereal_blade_slow"))
		return false
	if (blood && blood.IsReady && items.IsEnabled("item_bloodthorn") && target.ModifiersBook.HasBuffByName("modifier_item_bloodthorn"))
		return false
	if (seal  && seal.IsReady && target.ModifiersBook.HasBuffByName("modifier_skywrath_mage_ancient_seal"))
		return false
	if (shot  && shot.IsReady && target.ModifiersBook.HasBuffByName("modifier_skywrath_mage_concussive_shot_slow"))
		return false
	return true
}
function checkMods(near= false) {
	let trgt  = near ? nearest : target
	if (trgt === undefined)
		return false
	if (bmcheck.value && trgt.ModifiersBook.HasAnyBuffByNames(["modifier_item_blade_mail_reflect"]))
		return false
	if (trgt.ModifiersBook.HasAnyBuffByNames(mods))
		return false
	return true
}
function popLink(item: Item|Ability, val: boolean) {
	if (val && item !== undefined && item.IsReady) {
		sky.CastTarget(item, target, false, false)
		return true
	}
	return false
}
EventsSDK.on("Update", cmd => {
	if (!active.value || !Game.IsInGame || Game.IsPaused || sky === undefined || !sky.IsAlive)
		return
	nearest = ArrayExtensions.orderBy(heroes.filter(hero => hero.Distance(Utils.CursorWorldVec) <= cursorRadius.value && hero.IsAlive), ent => ent.Distance(Utils.CursorWorldVec))[0]
	if (concShot.value && shot !== undefined) {
		cshotenemy = ArrayExtensions.orderBy(heroes.filter(hero => hero.Distance(sky) <= shot.CastRange && hero.IsAlive && hero.IsVisible), ent => ent.Distance(sky))[0]
	}
})
EventsSDK.on("Draw", () => {
	if (!active.value || !Game.IsInGame || Game.IsPaused || sky === undefined || !sky.IsAlive)
		return
	if (drawTargetParticle.value) {
		if (targetParticle === undefined && (nearest !== undefined || target !== undefined)) {
			targetParticle = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, nearest)
		}
		if (targetParticle !== undefined) {
			if (nearest === undefined && target === undefined) {
				ParticlesSDK.Destroy(targetParticle, true)
				targetParticle = undefined
			}else {
				ParticlesSDK.SetControlPoint(targetParticle, 2, sky.Position)
				ParticlesSDK.SetControlPoint(targetParticle, 6, new Vector3(1))
				ParticlesSDK.SetControlPoint(targetParticle, 7, (target || nearest).Position)
			}
		}
	}
	if (concShot.value) {
		if (!shot.IsReady || (cshotenemy === undefined && cshotparticle !== undefined) || (currentcshot !== cshotenemy && cshotparticle !== undefined)) {
			if (cshotparticle !== undefined)
				ParticlesSDK.Destroy(cshotparticle, true)
			cshotparticle = undefined
			currentcshot = cshotenemy
		}
		if (cshotparticle === undefined && cshotenemy !== undefined && shot.IsReady)
			cshotparticle = ParticlesSDK.Create("particles/units/heroes/hero_skywrath_mage/skywrath_mage_concussive_shot.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN)
		if (cshotparticle !== undefined && shot.IsReady) {
			const pos = cshotenemy.Position
			pos.AddScalarZ(310)
			ParticlesSDK.SetControlPoint(cshotparticle, 0, pos)
			ParticlesSDK.SetControlPoint(cshotparticle, 1, pos)
			ParticlesSDK.SetControlPoint(cshotparticle, 2, new Vector3(cshotenemy.IdealSpeed))
		}
	}
	if (drawStatus.value && Game.UIState === DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME) {
		let text = ["SkyCombo", `Current target: ${target !== undefined ? target.Name : "none"}`]
		const wSize = RendererSDK.WindowSize
		text.forEach((val, i) => {
			RendererSDK.Text (
				val,
				new Vector2 (
					wSize.x / 100 * statusPosX.value,
					wSize.y / 100 * statusPosY.value + (i * textSize.value),
				),
				new Color(255, 255, 255, 255),
				"Radiance",
				textSize.value,
			)
		})
	}
})
