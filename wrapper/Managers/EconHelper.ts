import { ParseProtobufNamed } from "../Utils/Protobuf"
import { EventsSDK } from "./EventsSDK"

class EconReplacements {
	public readonly orig2repl = new Map<string, string[]>()
	public readonly repl2orig = new Map<string, string[]>()
	public readonly repl2id = new Map<string, bigint>()

	public AddPair(orig: string, id: bigint, repl: string): void {
		let origAr = this.orig2repl.get(orig)
		if (origAr === undefined) {
			origAr = []
			this.orig2repl.set(orig, origAr)
		}
		if (!origAr.includes(repl)) {
			origAr.push(repl)
		}

		let replAr = this.repl2orig.get(repl)
		if (replAr === undefined) {
			replAr = []
			this.repl2orig.set(repl, replAr)
		}
		if (!replAr.includes(orig)) {
			replAr.push(orig)
		}

		this.repl2id.set(repl, id)
	}
	public Clear() {
		this.orig2repl.clear()
		this.repl2orig.clear()
	}
}

export const Particles = new EconReplacements()
export const IconReplacements = new EconReplacements()
export const IconReplacementsMinimap = new EconReplacements()
export const ItemNames = new Map<bigint, string>()
export const ItemHealthBarOffsets = new Map<bigint, number>()

function LoadEconData() {
	Particles.Clear()
	IconReplacements.Clear()
	IconReplacementsMinimap.Clear()
	ItemNames.clear()
	ItemHealthBarOffsets.clear()
	const itemsGame = parseKV("scripts/items/items_game.txt").get("items_game")
	if (!(itemsGame instanceof Map)) {
		return
	}
	const items = itemsGame.get("items")
	if (!(items instanceof Map)) {
		return
	}
	for (const [idStr, item] of items) {
		if (!(item instanceof Map)) {
			continue
		}
		let id = 0n
		try {
			id = BigInt(idStr)
		} catch {
			continue
		}
		const itemName = item.get("name")
		if (typeof itemName === "string") {
			ItemNames.set(id, itemName)
		}
		const visuals = item.get("visuals")
		if (!(visuals instanceof Map)) {
			continue
		}
		for (const [name, visual] of visuals) {
			if (!(visual instanceof Map) || !name.startsWith("asset_modifier")) {
				continue
			}
			const type = visual.get("type")
			switch (type) {
				case "healthbar_offset":
					const offset = visual.get("offset")
					if (typeof offset === "string") {
						try {
							ItemHealthBarOffsets.set(id, parseFloat(offset))
						} catch {
							continue
						}
					}
					continue
				default:
					break
			}
			const orig = visual.get("asset"),
				repl = visual.get("modifier")
			if (typeof orig !== "string" || typeof repl !== "string") {
				continue
			}
			switch (type) {
				case "particle":
					if (repl !== "particles/error/null.vpcf") {
						Particles.AddPair(orig, id, repl)
					}
					break
				case "icon_replacement_hero":
					IconReplacements.AddPair(orig, id, repl)
					break
				case "icon_replacement_hero_minimap":
					IconReplacementsMinimap.AddPair(orig, id, repl)
					break
				default:
					break
			}
		}
	}
}
LoadEconData()

export const PresentEconItems = new Map<number, RecursiveMap>()
EventsSDK.on("UpdateStringTable", (name, update) => {
	if (name !== "EconItems") {
		return
	}
	for (const [index, [, itemSerialized]] of update) {
		const item = ParseProtobufNamed(new Uint8Array(itemSerialized), "CSOEconItem")
		PresentEconItems.set(index, item)
	}
})
EventsSDK.on("RemoveAllStringTables", () => {
	PresentEconItems.clear()
})
