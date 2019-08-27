import { Ability, Color, EventsSDK, Game, Item, LocalPlayer, Menu, ParticlesSDK, Vector3 } from "wrapper/Imports"

const menu = Menu.AddEntry(["Visual", "Custom Ranges"]),
	active = menu.AddToggle("Active"),
	first = menu.AddNode("Custom radius #1"),
	fActive = first.AddToggle("Active"),
	fRange = first.AddSlider("Range", 1300, 100, 4000),
	fColor = menu.AddColorPicker("Color", new Color(0, 255, 0)),
	second = menu.AddNode("Custom radius #2"),
	sActive = second.AddToggle("Active"),
	sRange = second.AddSlider("Range", 1300, 100, 4000),
	sColor = menu.AddColorPicker("Color", new Color(0, 255, 0)),
	refresh = menu.AddButton("Refresh", "Refresh Abilities and Items"),
	abils = menu.AddImageSelector("Abilities", []),
	items = menu.AddImageSelector("Item", []),
	abColors = menu.AddNode("Ability Colors", "If you choose abilities, there will be colors"),
	itmColors = menu.AddNode("Item Colors", "If you choose items, there will be colors")

let fPart,
	sPart,
	fCache,
	sCache,
	abilsParticles: Map<Ability, number> = new Map(),
	abilsColors: Map<Ability, any> = new Map(),
	abilsRanges: Map<Ability, number> = new Map(),
	itemsParticles: Map<Item, number> = new Map(),
	itemColors: Map<Item, any> = new Map(),
	itemsRanges: Map<Item, number> = new Map()

active.OnValue(() => {
	if (!active.value) {
		if (fPart !== undefined) {
			ParticlesSDK.Destroy(fPart, true)
			fPart = undefined
		}
		if (sPart !== undefined) {
			ParticlesSDK.Destroy(sPart, true)
			sPart = undefined
		}
	}
	Refresh()
})

function removeMenu(obj) {
	obj.clr.tree.parent.RemoveControl(obj.clr.tree)
	obj.men.parent.RemoveControl(obj.men)
}
function OnValAbility(val: Map<string, boolean>, list: Menu.ImageSelector) {
	val.forEach((val, key) => {
		const spell = LocalPlayer.Hero.AbilitiesBook.GetAbilityByName(key)
		if (val) {
			if (spell !== undefined && spell.CastRange > 0 && !abilsParticles.has(spell)) {
				const part = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, LocalPlayer.Hero)
				ParticlesSDK.SetControlPoint(part, 0, LocalPlayer.Hero.Position)
				ParticlesSDK.SetControlPoint(part, 2, LocalPlayer.Hero.Position)
				ParticlesSDK.SetControlPoint(part, 3, new Vector3(spell.CastRange))
				ParticlesSDK.SetControlPoint(part, 4, new Vector3(0, 255, 0))
				abilsRanges.set(spell, spell.CastRange)
				abilsParticles.set(spell, part)
				const men = abColors.AddNode(spell.Name),
					clr = men.AddColorPicker("Color")
				abilsColors.set(spell, {men, clr})
			}
		} else if (abilsParticles.has(spell)) {
			ParticlesSDK.Destroy(abilsParticles.get(spell), true)
			removeMenu(abilsColors.get(spell))
			abilsColors.delete(spell)
			abilsParticles.delete(spell)
		}
	})
}
function OnValItem(val: Map<string, boolean>, list: Menu.ImageSelector) {
	val.forEach((val, key) => {
		const spell = LocalPlayer.Hero.Inventory.GetItemByName(key)
		if (val) {
			if (spell !== undefined && spell.CastRange > 0 && !itemsParticles.has(spell)) {
				const part = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, LocalPlayer.Hero)
				ParticlesSDK.SetControlPoint(part, 0, LocalPlayer.Hero.Position)
				ParticlesSDK.SetControlPoint(part, 2, LocalPlayer.Hero.Position)
				ParticlesSDK.SetControlPoint(part, 3, new Vector3(spell.CastRange))
				ParticlesSDK.SetControlPoint(part, 4, new Vector3(0, 255, 0))
				itemsRanges.set(spell, spell.CastRange)
				itemsParticles.set(spell, part)
				const men = itmColors.AddNode(spell.Name),
					clr = men.AddColorPicker("Color")
				itemColors.set(spell, {men, clr})
			}
		} else if (itemsParticles.has(spell)) {
			ParticlesSDK.Destroy(itemsParticles.get(spell), true)
			removeMenu(itemColors.get(spell))
			itemColors.delete(spell)
			itemsParticles.delete(spell)
		}
	})
}
EventsSDK.on("Draw", () => {
	if (!active.value || !Game.IsInGame || LocalPlayer.Hero === undefined || !LocalPlayer.Hero.IsAlive)
		return false
	if (fActive.value) {
		if (fPart === undefined || fCache !== fRange.value) {
			fCache = fRange.value
			if (fPart !== undefined)
				ParticlesSDK.Destroy(fPart, true)
			fPart = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, LocalPlayer.Hero)
		}
		ParticlesSDK.SetControlPoint(fPart, 0, LocalPlayer.Hero.Position)
		ParticlesSDK.SetControlPoint(fPart, 2, LocalPlayer.Hero.Position)
		ParticlesSDK.SetControlPoint(fPart, 3, new Vector3(fRange.value))
		let color = fColor.Color
		ParticlesSDK.SetControlPoint(fPart, 4, new Vector3(color.r, color.g, color.b))
	}else {
		if (fPart !== undefined) {
			ParticlesSDK.Destroy(fPart, true)
			fPart = undefined
		}
	}
	if (sActive.value) {
		if (sPart === undefined || sCache !== sRange.value) {
			sCache = fRange.value
			if (sPart !== undefined)
				ParticlesSDK.Destroy(sPart, true)
			sPart = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, LocalPlayer.Hero)
		}
		ParticlesSDK.SetControlPoint(sPart, 0, LocalPlayer.Hero.Position)
		ParticlesSDK.SetControlPoint(sPart, 2, LocalPlayer.Hero.Position)
		ParticlesSDK.SetControlPoint(sPart, 3, new Vector3(sRange.value))
		let color = sColor.Color
		ParticlesSDK.SetControlPoint(sPart, 4, new Vector3(color.r, color.g, color.b))
	}else {
		if (sPart !== undefined) {
			ParticlesSDK.Destroy(sPart, true)
			sPart = undefined
		}
	}

	let updateAbil = false,
		updateItem = false
	// loop-optimizer: KEEP
	abilsParticles.forEach((part, spell) => {
		if (abilsRanges.get(spell) !== spell.CastRange)
			updateAbil = true
		if (updateAbil)
			return
		ParticlesSDK.SetControlPoint(part, 0, LocalPlayer.Hero.Position)
		ParticlesSDK.SetControlPoint(part, 2, LocalPlayer.Hero.Position)
		let color: Color = abilsColors.get(spell).clr.Color
		ParticlesSDK.SetControlPoint(part, 4, new Vector3(color.r, color.g, color.b))
	})
	// loop-optimizer: KEEP
	itemsParticles.forEach((part, spell) => {
		if (itemsRanges.get(spell) !== spell.CastRange)
			updateItem = true
		if (updateItem)
			return
		ParticlesSDK.SetControlPoint(part, 0, LocalPlayer.Hero.Position)
		ParticlesSDK.SetControlPoint(part, 2, LocalPlayer.Hero.Position)
		let color: Color = itemColors.get(spell).clr.Color
		ParticlesSDK.SetControlPoint(part, 4, new Vector3(color.r, color.g, color.b))
	})
	if (updateAbil) {
		// loop-optimizer: KEEP
		abilsParticles.forEach((val, spell) => {
			removeMenu(abilsColors.get(spell))
			ParticlesSDK.Destroy(val, true)
		})
		abilsParticles.clear()
		abilsColors.clear()
		OnValAbility(abils.enabled_values, abils)
	}
	if (updateItem) {
		// loop-optimizer: KEEP
		itemsParticles.forEach((val, spell) => {
			removeMenu(itemColors.get(spell))
			ParticlesSDK.Destroy(val, true)
		})
		itemsParticles.clear()
		abilsColors.clear()
		OnValItem(items.enabled_values, items)
	}
})

abils.OnValue(() => OnValAbility(abils.enabled_values, abils))
items.OnValue(() => OnValItem(items.enabled_values, items))

function Refresh(arg?) {
	// loop-optimizer: KEEP
	abilsParticles.forEach((val, spell) => {
		removeMenu(abilsColors.get(spell))
		ParticlesSDK.Destroy(val, true)
	})
	abilsParticles.clear()
	abilsColors.clear()
	// loop-optimizer: KEEP
	itemsParticles.forEach((val, spell) => {
		removeMenu(itemColors.get(spell))
		ParticlesSDK.Destroy(val, true)
	})
	itemsParticles.clear()
	itemColors.clear()
	abils.values = []
	items.values = []
	abils.Update()
	items.Update()
	if (!active.value || !Game.IsInGame || LocalPlayer.Hero === undefined)
		return false
	for (let i = 0; i < 24; i++) {
		const spell = LocalPlayer.Hero.AbilitiesBook.GetSpell(i),
			item = LocalPlayer.Hero.Inventory.GetItem(i)
		if (spell !== undefined && spell.Name !== "generic_hidden" && spell.Name.indexOf("special_bonus") === -1 && spell.Name.indexOf("seasonal") === -1 && spell.Name.indexOf("high_five") === -1) {
			abils.values.push(spell.Name)
		}
		if (item !== undefined && item.Name !== undefined && item.CastRange > 0) {
			items.values.push(item.Name)
		}
	}
	if (arg !== undefined) {
		OnValAbility(abils.enabled_values, abils)
		OnValItem(items.enabled_values, items)
	}
	abils.Update()
	items.Update()
}
refresh.OnValue(Refresh)
EventsSDK.on("GameStarted", Refresh)
EventsSDK.on("GameEnded", () => {
	if (fPart !== undefined) {
		ParticlesSDK.Destroy(fPart, true)
		fPart = undefined
	}
	if (sPart !== undefined) {
		ParticlesSDK.Destroy(sPart, true)
		sPart = undefined
	}
	Refresh()
})
