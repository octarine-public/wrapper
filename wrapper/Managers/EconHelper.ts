import { parseKVFile } from "../Resources/ParseKV"

class EconReplacements {
	public readonly orig2repl = new Map<string, string[]>()
	public readonly repl2orig = new Map<string, string[]>()
	public readonly repl2id = new Map<string, number>()

	public AddPair(orig: string, id: number, repl: string): void {
		let orig_ar = this.orig2repl.get(orig)
		if (orig_ar === undefined) {
			orig_ar = []
			this.orig2repl.set(orig, orig_ar)
		}
		if (!orig_ar.includes(repl))
			orig_ar.push(repl)

		let repl_ar = this.repl2orig.get(repl)
		if (repl_ar === undefined) {
			repl_ar = []
			this.repl2orig.set(repl, repl_ar)
		}
		if (!repl_ar.includes(orig))
			repl_ar.push(orig)

		this.repl2id.set(repl, id)
	}
	public Clear() {
		this.orig2repl.clear()
		this.repl2orig.clear()
	}
}

export const Particles = new EconReplacements()
export const AbilityIcons = new EconReplacements()
export const EntityModels = new EconReplacements()
export const Models = new EconReplacements()
export const IconReplacements = new EconReplacements()
export const IconReplacementsMinimap = new EconReplacements()
export const ChatWheel = new EconReplacements()

export function LoadEconData() {
	Particles.Clear()
	AbilityIcons.Clear()
	EntityModels.Clear()
	Models.Clear()
	IconReplacements.Clear()
	IconReplacementsMinimap.Clear()
	ChatWheel.Clear()
	const items_game = parseKVFile("scripts/items/items_game.txt").get("items_game")
	if (!(items_game instanceof Map))
		return
	const items = items_game.get("items")
	if (!(items instanceof Map))
		return
	for (const [id_str, item] of items) {
		if (!(item instanceof Map))
			continue
		let id = 0
		try {
			id = parseInt(id_str)
		} catch {
			continue
		}
		const visuals = item.get("visuals")
		if (!(visuals instanceof Map))
			continue
		for (const [name, visual] of visuals) {
			if (
				!(visual instanceof Map)
				|| !name.includes("asset_modifier")
			)
				continue
			const orig = visual.get("asset"),
				repl = visual.get("modifier")
			if (typeof orig !== "string" || typeof repl !== "string")
				continue
			switch (visual.get("type")) {
				case "particle":
					if (repl !== "particles/error/null.vpcf")
						Particles.AddPair(orig, id, repl)
					break
				case "ability_icon":
					AbilityIcons.AddPair(orig, id, repl)
					break
				case "entity_model":
					EntityModels.AddPair(orig, id, repl)
					break
				case "model":
					Models.AddPair(orig, id, repl)
					break
				case "icon_replacement_hero":
					IconReplacements.AddPair(orig, id, repl)
					break
				case "icon_replacement_hero_minimap":
					IconReplacementsMinimap.AddPair(orig, id, repl)
					break
				case "chatwheel":
					ChatWheel.AddPair(orig, id, repl)
					break
				default:
					break
			}
		}
	}
}
