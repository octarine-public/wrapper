import Events from "../Managers/Events"
import { InputEventSDK, VMouseKeys } from "../Managers/InputManager"
import RendererSDK from "../Native/RendererSDK"
import { StringToUTF16, Utf16ArrayToStr } from "../Utils/ArrayBufferUtils"
import Base from "./Base"
import Header from "./Header"
import Localization from "./Localization"
import Node from "./Node"

class MenuManager {
	public entries: Node[] = []
	public config: any
	public is_open = true
	public trigger_on_chat = false
	public ForwardConfigASAP = false
	private readonly header = new Header(this)
	private active_element?: Base

	constructor() {
		readConfig("default.json")
			.then(buf => this.ConfigValue = JSON.parse(Utf16ArrayToStr(new Uint16Array(buf))))
			.catch(() => this.ConfigValue = {})
			.finally(() => {
				this.header.ConfigValue = this.config.Header
				Localization.SelectedUnitName = this.config.SelectedLocalization ?? Localization.SelectedUnitName
			})
	}

	public get Position() {
		return this.header.Position.Clone()
	}
	public get PositionDirty(): boolean {
		return this.header.position_dirty
	}
	public set PositionDirty(val: boolean) {
		this.header.position_dirty = val
	}

	public get ConfigValue() {
		this.entries.forEach(entry => this.config[entry.InternalName] = entry.ConfigValue)
		return this.config
	}
	public set ConfigValue(obj) {
		this.config = obj
		this.ForwardConfig()
	}

	public UpdateConfig() {
		if (this.config === undefined)
			return
		this.config.Header = this.header.ConfigValue
		this.config.SelectedLocalization = Localization.SelectedUnitName
		writeConfig("default.json", StringToUTF16(JSON.stringify(this.ConfigValue)).buffer)
	}
	public Render(): void {
		if (this.config === undefined)
			return
		if (this.ForwardConfigASAP)
			this.ForwardConfig()
		if (Localization.was_changed) {
			this.entries.forEach(entry => entry.ApplyLocalization())
			Localization.was_changed = false
			this.PositionDirty = true
			this.UpdateConfig()
		}
		if (!this.is_open)
			return
		this.header.PreRender()
		if (this.header.position_dirty) {
			const current_pos = this.Position.Clone().AddScalarY(this.header.OriginalSize.y)
			const max_width = this.entries.reduce((prev, node) => Math.max(prev, node.TotalSize.x), this.header.OriginalSize.x)
			this.header.TotalSize.x = max_width
			this.entries.forEach(node => {
				node.TotalSize.x = max_width
				current_pos.CopyTo(node.Position)
				node.UpdateEntriesPositions()
				current_pos.AddScalarY(node.TotalSize.y)
			})
			this.header.position_dirty = false
		}
		this.header.Render()
		this.entries.forEach(node => node.Render())
	}

	public OnMouseLeftDown(): boolean {
		if (!this.is_open)
			return true
		if (!this.header.OnMouseLeftDown()) {
			this.active_element = this.header
			return false
		}
		return !this.entries.some(node => {
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
			this.UpdateConfig()
		this.active_element = undefined
		return ret
	}
	public AddEntry(name: string, icon_path = ""): Node {
		let node = this.entries.find(entry => entry.Name === name)
		if (node !== undefined)
			return node
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
		this.entries.forEach(entry => entry.ConfigValue = this.config[entry.InternalName])
		this.entries.forEach(entry => entry.OnConfigLoaded())
		this.ForwardConfigASAP = false
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
