import Events from "../Managers/Events"
import { InputEventSDK, VMouseKeys } from "../Managers/InputManager"
import RendererSDK from "../Native/RendererSDK"
import { StringToUTF16, Utf16ArrayToStr } from "../Utils/ArrayBufferUtils"
import GameState from "../Utils/GameState"
import { readJSON } from "../Utils/Utils"
import Base from "./Base"
import Header from "./Header"
import Localization from "./Localization"
import Node from "./Node"

const hardcoded_icons = new Map<string, string>(Object.entries(readJSON("hardcoded_icons.json")))
class MenuManager {
	public entries: Node[] = []
	public Scale = 1
	public config: any
	private readonly header = new Header(this)
	private active_element?: Base
	private is_open_ = true
	private initialized_language = false

	constructor() {
		readConfig("default.json")
			.then(buf => this.ConfigValue = JSON.parse(Utf16ArrayToStr(new Uint16Array(buf))))
			.catch(() => this.ConfigValue = {})
			.finally(() => {
				this.header.ConfigValue = this.config.Header
				if (this.config.SelectedLocalization !== undefined) {
					Localization.SelectedUnitName = this.config.SelectedLocalization
					this.initialized_language = true
				}
			})
	}

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
		this.entries.forEach(entry => this.config[entry.InternalName] = entry.ConfigValue)
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
	public Render(): void {
		if (this.config === undefined)
			return
		if (GameState.Language === "unknown")
			GameState.Language = ConVars.GetString("cl_language")
		if (!this.initialized_language) {
			Localization.SelectedUnitName = GameState.Language
			this.initialized_language = true
		}
		if (Base.ForwardConfigASAP)
			this.ForwardConfig()
		if (Localization.was_changed) {
			this.entries.forEach(entry => entry.ApplyLocalization())
			Localization.was_changed = false
			Base.SaveConfigASAP = true
		}
		if (Base.SaveConfigASAP) {
			writeConfig("default.json", StringToUTF16(JSON.stringify(this.ConfigValue)).buffer)
			Base.SaveConfigASAP = false
		}
		if (!this.is_open)
			return
		const max_width = this.EntriesSizeX
		this.header.TotalSize.x = max_width
		this.header.Render()
		const position = this.header.Position.Clone().AddScalarY(this.header.TotalSize.y)
		this.entries.forEach(node => {
			if (!node.IsVisible)
				return
			position.CopyTo(node.Position)
			node.TotalSize.x = max_width
			node.TotalSize.y = node.OriginalSize.y
			node.Render()
			position.AddScalarY(node.TotalSize.y)
		})
		this.entries.forEach(node => {
			if (node.IsVisible)
				node.PostRender()
		})
	}

	public OnMouseLeftDown(): boolean {
		if (!this.is_open)
			return true
		if (!this.header.OnMouseLeftDown()) {
			this.active_element = this.header
			return false
		}
		return !this.entries.some(node => {
			if (!node.IsVisible)
				return false
			const ret = node.OnMouseLeftDown()
			if (!ret)
				this.active_element = node
			return !ret
		})
	}
	public OnMouseLeftUp(): boolean {
		if (!this.is_open || this.active_element === undefined)
			return true
		const ret = this.active_element.OnMouseLeftUp()
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
		if (this.config === undefined)
			return
		this.entries.forEach(entry => {
			if (entry.IgnoreNextConfigLoad) {
				entry.IgnoreNextConfigLoad = false
				return
			}
			entry.ConfigValue = this.config[entry.InternalName]
		})
		this.entries.forEach(entry => entry.OnConfigLoaded())
		Base.ForwardConfigASAP = false
	}
}
const Menu = new MenuManager()

Events.after("Draw", () => {
	Menu.Render()
	RendererSDK.EmitDraw()
})

InputEventSDK.on("MouseKeyDown", key => {
	if (key === VMouseKeys.MK_LBUTTON)
		return Menu.OnMouseLeftDown()
	return true
})
InputEventSDK.on("MouseKeyUp", key => {
	if (key === VMouseKeys.MK_LBUTTON)
		return Menu.OnMouseLeftUp()
	return true
})

export default Menu
