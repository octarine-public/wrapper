import Events from "../Managers/Events"
import EventsSDK from "../Managers/EventsSDK"
import { InputEventSDK, VMouseKeys } from "../Managers/InputManager"
import RendererSDK from "../Native/RendererSDK"
import { StringToUTF8, Utf16ArrayToStr, Utf8ArrayToStr } from "../Utils/ArrayBufferUtils"
import GameState from "../Utils/GameState"
import { readJSON } from "../Utils/Utils"
import Base from "./Base"
import Header from "./Header"
import Localization from "./Localization"
import Node from "./Node"

const hardcoded_icons = new Map<string, string>(Object.entries(readJSON("hardcoded_icons.json")))
class MenuManager {
	public entries: Node[] = []
	public config: any
	private readonly header = new Header(this)
	private active_element?: Base
	private is_open_ = true
	private initialized_language = false

	public get Position() {
		return this.header.Position.Clone()
	}
	public get is_open(): boolean {
		return this.is_open_
	}
	public set is_open(val: boolean) {
		if (this.is_open_ === val)
			return
		if (!val) {
			this.OnMouseLeftUp()
			this.entries.forEach(entry => entry.OnParentNotVisible())
		}
		this.is_open_ = val
	}

	public get ConfigValue() {
		this.config = Object.create(null)
		this.entries.forEach(entry => {
			const name = entry.InternalName
			if (name === "" || name.includes("."))
				return
			this.config[name] = entry.ConfigValue
		})
		this.config.Header = this.header.ConfigValue
		this.config.SelectedLocalization = Localization.SelectedUnitName
		return this.config
	}
	public set ConfigValue(obj) {
		this.config = obj
		this.ForwardConfig()
	}

	public get EntriesSizeX(): number {
		return this.entries.reduce(
			(prev, cur) => Math.max(prev, cur.IsVisible ? cur.OriginalSize.x : 0),
			this.header.OriginalSize.x,
		)
	}
	public get EntriesSizeY(): number {
		return this.entries.reduce(
			(prev, cur) => prev + (cur.IsVisible ? cur.OriginalSize.y : 0),
			this.header.OriginalSize.y,
		)
	}
	public async LoadConfig() {
		try {
			const config = await readConfig("default.json")
			try {
				this.ConfigValue = JSON.parse(Utf8ArrayToStr(new Uint8Array(config)))
			} catch {
				this.ConfigValue = JSON.parse(Utf16ArrayToStr(new Uint16Array(config)))
			}
		} catch {
			this.ConfigValue = {}
		} finally {
			this.header.ConfigValue = this.config.Header
			if (this.config.SelectedLocalization !== undefined) {
				Localization.SelectedUnitName = this.config.SelectedLocalization
				this.initialized_language = true
			}
		}
	}
	public async Render(): Promise<void> {
		if (this.config === undefined)
			return
		if (GameState.Language === "unknown")
			GameState.Language = ConVars.GetString("cl_language")
		if (!this.initialized_language) {
			Localization.SelectedUnitName = GameState.Language
			this.initialized_language = true
		}
		this.ForwardConfig()
		if (Localization.was_changed) {
			this.entries.forEach(entry => entry.ApplyLocalization())
			Localization.was_changed = false
			Base.SaveConfigASAP = true
		}
		if (Base.SaveConfigASAP) {
			writeConfig("default.json", StringToUTF8(JSON.stringify(this.ConfigValue)).buffer)
			Base.SaveConfigASAP = false
		}
		if (!this.is_open)
			return
		const max_width = this.EntriesSizeX
		this.header.TotalSize.x = max_width
		this.header.TotalSize.y = this.header.OriginalSize.y
		await this.header.Render()
		const position = this.header.Position.Clone().AddScalarY(this.header.TotalSize.y)
		for (const node of this.entries)
			if (node.IsVisible) {
				position.CopyTo(node.Position)
				node.TotalSize.x = max_width
				node.TotalSize.y = node.OriginalSize.y
				await node.Render()
				position.AddScalarY(node.TotalSize.y)
			}
		for (const node of this.entries)
			if (node.IsVisible)
				await node.PostRender()
	}
	public OnWindowSizeChanged(): void {
		this.entries.forEach(entry => entry.Update(true))
	}

	public async OnMouseLeftDown(): Promise<boolean> {
		if (!this.is_open)
			return true
		if (!await this.header.OnMouseLeftDown()) {
			this.active_element = this.header
			return false
		}
		for (const node of this.entries)
			if (node.IsVisible && !await node.OnMouseLeftDown()) {
				this.active_element = node
				return false
			}
		return true
	}
	public async OnMouseLeftUp(): Promise<boolean> {
		if (!this.is_open || this.active_element === undefined)
			return true
		const ret = await this.active_element.OnMouseLeftUp()
		if (this.active_element === this.header)
			Base.SaveConfigASAP = true
		this.active_element = undefined
		return ret
	}
	public AddEntry(name: string, icon_path = ""): Node {
		let node = this.entries.find(entry => entry.InternalName === name)
		if (node !== undefined) {
			if (node.icon_path === "")
				node.icon_path = icon_path
			return node
		}
		if (hardcoded_icons.has(name))
			icon_path = hardcoded_icons.get(name)!
		node = new Node(this, name, icon_path)
		node.parent = this
		this.entries.push(node)
		this.entries = this.entries.sort((a, b) => a.Name.localeCompare(b.Name))
		node.ApplyLocalization()
		return node
	}
	public AddEntryDeep(names: string[], icon_paths: string[] = []): Node {
		if (names.length === 0)
			throw "Invalid names array passed to Menu.AddEntryDeep"
		return names.reduce((prev, cur, i) => {
			if (i === 0)
				return prev
			const icon_path_id = names.length - i - 1
			const icon_path = icon_path_id < icon_paths.length
				? icon_paths[icon_path_id]
				: ""
			return prev.AddNode(cur, icon_path)
		}, this.AddEntry(names[0]))
	}
	private ForwardConfig() {
		while (Base.ForwardConfigASAP && this.config !== undefined) {
			Base.ForwardConfigASAP = false
			this.entries.forEach(entry => entry.ConfigValue = this.config[entry.InternalName])
			this.entries.forEach(entry => entry.OnConfigLoaded())
		}
	}
}
const Menu = new MenuManager()
await Menu.LoadConfig()

Events.after("Draw", async () => {
	await Menu.Render()
	RendererSDK.EmitDraw()
})

EventsSDK.on("WindowSizeChanged", () => Menu.OnWindowSizeChanged())

InputEventSDK.on("MouseKeyDown", async key => {
	if (key === VMouseKeys.MK_LBUTTON)
		return Menu.OnMouseLeftDown()
	return true
})
InputEventSDK.on("MouseKeyUp", async key => {
	if (key === VMouseKeys.MK_LBUTTON)
		return Menu.OnMouseLeftUp()
	return true
})

export default Menu
