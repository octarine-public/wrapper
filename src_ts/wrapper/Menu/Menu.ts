import Vector2 from "../Base/Vector2"
import RendererSDK from "../Native/RendererSDK"
import Base from "./Base"
import Header from "./Header"
import Node from "./Node"

let Menu = new (class Menu {
	public entries: Node[] = []
	public config: any
	public is_open = true
	public block_mouse_position = true
	private readonly header = new Header("Fusion")
	private active_element: Base

	constructor() {
		this.ConfigValue = JSON.parse(readConfig("default.json") || "{}")
		this.header.ConfigValue = this.config.Header
	}

	public UpdateConfig() {
		this.config.Header = this.header.ConfigValue
		writeConfig("default.json", JSON.stringify(this.ConfigValue))
	}
	public ForwardConfig() {
		this.entries.forEach(entry => entry.ConfigValue = this.config[entry.name])
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
	public Render(): void {
		if (this.header.position_dirty) {
			let current_pos = this.Position.Clone().AddScalarY(this.header.TotalSize.y)
			let max_width = this.entries.reduce((prev, node) => Math.max(prev, node.TotalSize_.x), this.header.TotalSize_.x)
			this.header.TotalSize.x = max_width
			// loop-optimizer: FORWARD
			this.entries.forEach(node => {
				node.TotalSize.x = max_width
				current_pos.CopyTo(node.Position)
				node.UpdateEntriesPositions()
				current_pos.AddScalarY(node.TotalSize.y)
			})
			this.header.position_dirty = false
		}
		if (!this.is_open)
			return
		this.header.Render()
		// loop-optimizer: KEEP
		this.entries.forEach(node => node.Render())
	}

	public get ConfigValue() {
		this.entries.forEach(entry => this.config[entry.name] = entry.ConfigValue)
		return this.config
	}
	public set ConfigValue(obj) {
		this.config = obj
		this.ForwardConfig()
	}

	public OnMouseLeftDown(): boolean {
		if (!this.is_open)
			return true
		if (!this.header.OnMouseLeftDown()) {
			this.active_element = this.header
			return false
		}
		return !this.entries.some(node => {
			let ret = node.OnMouseLeftDown()
			if (!ret)
				this.active_element = node
			return !ret
		})
	}
	public OnMouseLeftUp(): boolean {
		if (!this.is_open || this.active_element === undefined)
			return true
		let ret = this.active_element.OnMouseLeftUp()
		if (this.active_element === this.header)
			this.UpdateConfig()
		this.active_element = undefined
		return ret
	}
	public OnMousePositionChanged(MousePosition: Vector2): boolean {
		if (!this.is_open)
			return true
		if (!this.header.OnMousePositionChanged_(MousePosition, this))
			return false
		let ret = true
		// loop-optimizer: KEEP
		this.entries.forEach(node => ret = node.OnMousePositionChanged(MousePosition) && ret)
		return ret || !this.block_mouse_position
	}
	AddEntry(name: string | string[]): Node {
		if (name instanceof Array) {
			if (name.length === 0)
				throw "Invalid name array passed to Menu.AddEntry"
			else if (name.length === 1)
				name = name[0]
			else {
				let node = this.AddEntry(name[0])
				for (let i = 1, end = name.length; i < end; i++)
					node = node.AddNode(name[i])
				return node
			}
		}
		let node = this.entries.find(node => node.name === name)
		if (node !== undefined)
			return node
		node = new Node(name)
		node.parent = this
		this.entries.push(node)
		this.entries = this.entries.sort((a, b) => a.name.localeCompare(b.name))
		this.PositionDirty = true
		return node
	}
})()

// Menu.rootNodes.push(new Node("test"))
// Menu.rootNodes[0].entries.push(new Node("lol"));
// (Menu.rootNodes[0].entries[0] as Node).entries.push(new Node("lol"));
// ((Menu.rootNodes[0].entries[0] as Node).entries[0] as Node).entries.push(new Toggle("test"))
// Menu.rootNodes.push(new Node("test2"));
// (Menu.rootNodes[0].entries[0] as Node).entries.push(new Slider("Slider"));
// (Menu.rootNodes[0].entries[0] as Node).entries.push(new Switcher("Switcher"));
// Menu.rootNodes[1].entries.push(new Node("lol2"))
// Menu.rootNodes[1].entries.push(new Node("lol3"));
// Menu.rootNodes.push(new Node("test3"))
Events.after("Draw", () => {
	Menu.Render()
	RendererSDK.EmitDraw()
})

function LParamToScreenCoords(lParam: bigint): Vector2 {
	let buf = new ArrayBuffer(8)
	let view = new DataView(buf)
	view.setBigUint64(0, lParam, true)
	return new Vector2 (
		view.getInt16(0, true),
		view.getInt16(2, true),
	)
}

let last_click_ret = true
Events.on("WndProc", (msg_type, wParam, lParam) => {
	switch(msg_type) {
		case 0x201: // WM_LBUTTONDOWN
			return last_click_ret = Menu.OnMouseLeftDown()
		case 0x202: // WM_LBUTTONUP
			return Menu.OnMouseLeftUp()
		case 0x203: // WM_MBUTTONDBLCLK
			return last_click_ret
		case 0x200: // WM_MOUSEMOVE
			return Menu.OnMousePositionChanged(LParamToScreenCoords(lParam))
		default:
			return true
	}
})

export default global.Menu = Menu
