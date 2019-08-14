import { Ability, ArrayExtensions, Color, Debug, Entity, EntityManager, EventsSDK, Game, Hero, Item, MenuManager, Modifier, RendererSDK, Unit, Utils, Vector2, Vector3 } from "wrapper/Imports"
let { MenuFactory } = MenuManager
const menu = MenuFactory("SkyWrathCombo"),
	active = menu.AddToggle("Active"),
	ezKill = menu.AddToggle("Check for EZ Kill"),
	comboToggle = menu.AddCheckBox("Clamp combo key"),
	comboKey = menu.AddKeybind("Combo Key"),
	harrasKey = menu.AddKeybind("Harras Key"),
	cursorRadius = menu.AddSlider("Nearest cursor radius", 200, 100, 1000),
	popLinkV = menu.AddCheckBox("Pop Linken"),
	popLinkItems = menu.AddListBox("Pop Linken with", ["Pop with Nullifier", "Pop with Eul's Scepter of Divinity", "Pop with Rod of Atos", "Pop with Scythe of Vyse", "Pop with Force Staff", "Pop with Dagon", "Pop with Orchid", "Pop with Bloodthorn", "Pop with Ancient Seal", "Pop with Arcane Bolt", "Pop with Hurricane Pike"]),
	bmcheck = menu.AddCheckBox("Check BlaidMail"),
	soulRing = menu.AddCheckBox("Enable SoulRing"),
	blinkV = menu.AddCheckBox("Enable Blink"),
	blinkRadius = menu.AddSlider("Blink distance from enemy", 200, 0, 800),
	doubleFlare = menu.AddCheckBox("Double Mystic Flare"),
	abils = menu.AddListBox("Active abilities", ["Arcane Bolt", "Concussive Shot", "Ancient Seal", "Mystic Flare"]),
	items = menu.AddListBox("Active items", ["Rod of Atos", "Scythe of Vyse", "Ethereal Blade", "Veil of Discrod", "Dagon", "Orchid", "Bloodthorn", "Shiva's guard", "Nullifier"]),
	drawable = menu.AddTree("Drawable"),
	heroMenu = menu.AddTree("Hero Specifics"),
	amReflect = heroMenu.AddCheckBox("Enabled Pop AM Reflect"),
	amReflectItems = heroMenu.AddListBox("Pop AM Reflect", ["Pop with Nullifier", "Pop with Eul's Scepter of Divinity", "Pop with Rod of Atos", "Pop with Force Staff", "Pop with Dagon", "Pop with Arcane Bolt"]),
	drawTargetParticle = drawable.AddCheckBox("Draw line to target"),
	concShot = drawable.AddCheckBox("Draw concusive shot indicator"),
	drawStatus = drawable.AddCheckBox("Draw status"),
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

comboKey.OnExecute(val => comboKeyPress = val)

EventsSDK.on("GameStarted", hero => {
	if (hero.Name === "npc_dota_hero_skywrath_mage") {
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
		Particles.Destroy(targetParticle, true)
		targetParticle = undefined
	}
	if (cshotparticle !== undefined) {
		Particles.Destroy(cshotparticle, false)
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
	}else if (comboToggle.value && comboKey.IsPressed) {
		target = nearest
	}else if (comboToggle.value && !comboKey.IsPressed) {
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
			if (amReflect.value && target.Name === "npc_dota_hero_antimage"
				&& !target.ModifiersBook.HasAnyBuffByNames(["modifier_silver_edge_debuff", "modifier_viper_nethertoxin"])
				&& target.GetAbilityByName("antimage_spell_shield").IsReady) {
				if (popLink(forcestaff, amReflectItems.selected_flags[3])) return
				if (popLink(cyclone, amReflectItems.selected_flags[1])) return
				if (popLink(atos, amReflectItems.selected_flags[2])) return
				if (popLink(bolt, amReflectItems.selected_flags[5])) return
				if (popLink(dagon, amReflectItems.selected_flags[4])) return
				if (popLink(nullifier, amReflectItems.selected_flags[0])) return
				return
			}
			if (popLinkV.value && target.HasLinkenAtTime()) {
				if (popLink(nullifier, popLinkItems.selected_flags[0])) return
				if (popLink(cyclone, popLinkItems.selected_flags[1])) return
				if (popLink(atos, popLinkItems.selected_flags[2])) return
				if (popLink(hex, popLinkItems.selected_flags[3])) return
				if (popLink(forcestaff, popLinkItems.selected_flags[4])) return
				if (popLink(dagon, popLinkItems.selected_flags[5])) return
				if (popLink(orchid, popLinkItems.selected_flags[6])) return
				if (popLink(blood, popLinkItems.selected_flags[7])) return
				if (popLink(seal, popLinkItems.selected_flags[8])) return
				if (popLink(bolt, popLinkItems.selected_flags[9])) return
				if (popLink(hurricane, popLinkItems.selected_flags[10])) return
				return
			}
			if (!target.IsStunned && !target.IsHexed)
				if (useItem(hex, items.selected_flags[1])) return
			if (sky.IsInRange(target, 700) && !target.ModifiersBook.HasAnyBuffByNames(["modifier_teleporting"]))
				IsEZKillable = killCheck()
			if (soulRing.value && soulring !== undefined && soulring.IsReady) {
				sky.CastNoTarget(soulring)
				return
			}
			if (useBlink() || aeonDispelling() || castAbility(shot, abils.selected_flags[1]) || useItem(atos, items.selected_flags[0])
				|| castAbility(seal, abils.selected_flags[2]) || useItem(veil, items.selected_flags[3]) || useItem(eblade, items.selected_flags[2])
				|| castAbility(bolt, abils.selected_flags[0]) || castAbility(flare, abils.selected_flags[3]) || useItem(orchid, items.selected_flags[5])
				|| useItem(dagon, items.selected_flags[4]) || useItem(blood, items.selected_flags[6]) || useItem(shiva, items.selected_flags[7]))
				return
			if (!target.ModifiersBook.HasAnyBuffByNames(["modifier_item_nullifier_mute"]) && !target.IsHexed) {
				const item = target.GetItemByName("item_aeon_disk")
				if (item !== undefined && !item.IsReady && useItem(nullifier, items.selected_flags[8]))
					return
				else if (item === undefined && useItem(nullifier, items.selected_flags[8]))
					return
				return
			}
		}
	}
	if (harrasKey.IsPressed) {
		if (nearest !== undefined) {
			if (sky.CanAttack(nearest))
				sky.AttackTarget(nearest)
			if (!checkMods(true) || nearest.IsMagicImmune)
				return
			getAbils()
			if (castAbility(bolt, abils.selected_flags[0], true))
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
	if (veil && veil.IsReady && items.selected_flags[3]) {
		amp += veil.GetSpecialValue("resist_debuff") * -0.01
		reqMana += veil.ManaCost
	}
	if (seal && seal.IsReady && abils.selected_flags[3]) {
		amp += seal.GetSpecialValue("resist_debuff") * -0.01
		reqMana += seal.ManaCost
	}
	if (eblade && eblade.IsReady && items.selected_flags[2]) {
		amp += eblade.GetSpecialValue("ethereal_damage_bonus") * -0.01
		reqMana += eblade.ManaCost
		damage += eblade.GetSpecialValue("blast_damage_base") + eblade.GetSpecialValue("blast_agility_multiplier") * int
	}
	if (dagon && dagon.IsReady && items.selected_flags[4]) {
		reqMana += dagon.ManaCost
		damage += dagon.GetSpecialValue("dagon")
	}
	if (bolt && bolt.IsReady && abils.selected_flags[0]) {
		const mult = bolt.CooldownLenght <= 2 ? 2 : 1
		damage += (bolt.GetSpecialValue("bolt_damage") + bolt.GetSpecialValue("int_multiplier") * int) * mult
		reqMana += bolt.ManaCost * mult
	}
	if (shot && shot.IsReady && abils.selected_flags[1]) {
		damage += shot.GetSpecialValue("damage")
		reqMana += shot.ManaCost
	}
	damage *= amp + (1 - target.MagicDamageResist * 0.01)
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
	if (atos && atos.IsReady && items.selected_flags[0] && target.ModifiersBook.HasBuffByName("modifier_item_rod_of_atos"))
		return false
	if (veil && veil.IsReady && items.selected_flags[3] && target.ModifiersBook.HasBuffByName("modifier_item_veil_of_discord"))
		return false
	if (orchid && orchid.IsReady && items.selected_flags[5] && target.ModifiersBook.HasBuffByName("modifier_item_orchid_malevolence"))
		return false
	if (eblade && eblade.IsReady && items.selected_flags[2] && target.ModifiersBook.HasBuffByName("modifier_item_ethereal_blade_slow"))
		return false
	if (blood && blood.IsReady && items.selected_flags[6] && target.ModifiersBook.HasBuffByName("modifier_item_bloodthorn"))
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
			targetParticle = Particles.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, nearest.m_pBaseEntity)
		}
		if (targetParticle !== undefined) {
			if (nearest === undefined && target === undefined) {
				Particles.Destroy(targetParticle, false)
				targetParticle = undefined
			}else {
				sky.Position.toIOBuffer()
				Particles.SetControlPoint(targetParticle, 2)
				new Vector3(1, 0, 0).toIOBuffer()
				Particles.SetControlPoint(targetParticle, 6)
				if (target === undefined)
					nearest.Position.toIOBuffer()
				else
					target.Position.toIOBuffer()
				Particles.SetControlPoint(targetParticle, 7)
			}
		}
	}
	if (concShot.value) {
		if (!shot.IsReady || (cshotenemy === undefined && cshotparticle !== undefined) || (currentcshot !== cshotenemy && cshotparticle !== undefined)) {
			if (cshotparticle !== undefined)
				Particles.Destroy(cshotparticle, false)
			cshotparticle = undefined
			currentcshot = cshotenemy
		}
		if (cshotparticle === undefined && cshotenemy !== undefined && shot.IsReady)
			cshotparticle = Particles.Create("particles/units/heroes/hero_skywrath_mage/skywrath_mage_concussive_shot.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN)
		if (cshotparticle !== undefined && shot.IsReady) {
			const pos = cshotenemy.Position
			pos.SetZ(pos.z + 310).toIOBuffer()
			Particles.SetControlPoint(cshotparticle, 0)
			Particles.SetControlPoint(cshotparticle, 1)
			new Vector3(cshotenemy.IdealSpeed, 0, 0).toIOBuffer()
			Particles.SetControlPoint(cshotparticle, 2)
		}
	}
	if (drawStatus.value) {
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
