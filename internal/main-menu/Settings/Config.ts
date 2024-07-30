import { Menu, NotificationsSDK, ResetSettingsUpdated } from "../../../wrapper/Imports"

export class InternalConfig {
	private isConstructed = false

	private readonly node: Menu.Node
	private readonly markNonDefault: Menu.Toggle
	private readonly markNew: Menu.Toggle

	private list: Menu.Node | undefined

	public readonly dynamicLists = new Array<{
		node: Menu.Node
		filter: (el: Menu.Base) => boolean
		create: (el: Menu.Base, path: string[]) => any
	}>()

	private readonly keybindsSkipNodeInternalName = "Heroes"
	private keybindsSkipNodeIdx = 0

	constructor(settings: Menu.Node) {
		this.node = settings.AddNode("Config", "menu/icons/document1.svg")
		this.node.SortNodes = false

		this.markNew = this.node
			.AddToggle("Mark new settings", true, "Show green circle\non new settings")
			.OnValue(t => (Menu.Base.DrawMarksNew = t.value))

		this.markNew.markColorCustom = Menu.Base.markColorNew

		const tt = "Show white circle\non settings you've changed"
		this.markNonDefault = this.node
			.AddToggle("Mark changed settings", true, tt)
			.OnValue(t => (Menu.Base.DrawMarksNonDefault = t.value))

		this.markNonDefault.markColorCustom = Menu.Base.markColorNonDefault

		const skipNodes = (path: string[], depth: number, pop = false) => {
			let list = this.list!

			if (
				this.keybindsSkipNodeIdx !== -1 &&
				path[0] === Menu.MenuManager.entries[this.keybindsSkipNodeIdx].Name
			) {
				let s = Menu.MenuManager as any
				for (let i = 0; s && i < depth; i++) {
					if ((s = s.entries.find((e: Menu.Base) => e.Name === path[0]))) {
						list = list.AddNode(path.shift()!, s.IconPath, "", -1, 1)
					}
				}
				if (pop) {
					path.pop()
				}
			}
			return list
		}

		let node = this.node.AddNode("Keybinds list")
		node.SaveConfig = false
		this.dynamicLists.push({
			node,
			filter: el =>
				el.SaveConfig &&
				el instanceof Menu.KeyBind &&
				el.assignedKey > 0 &&
				el.IsVisible &&
				el.everyParent(
					p =>
						p instanceof Menu.Node &&
						p.IsVisible &&
						p.SaveConfig &&
						!(
							p.entries.length &&
							p.entries[0] instanceof Menu.Toggle &&
							p.entries[0].value === false &&
							p.entries[0].InternalName.endsWith("State")
						)
				),
			create: (origEl, path) => {
				const origKb = origEl as unknown as Menu.KeyBind
				const kb = skipNodes(path, 3, true).AddKeybind(
					path.join(" > "),
					origKb.assignedKeyStr
				)
				if (!origKb.IsDefaultValue) {
					kb.Priority = 2
					kb.defaultKey = origKb.defaultKey
					kb.defaultKeyIdx = origKb.defaultKeyIdx
				}
				kb.OnValue(b => {
					origKb.ResetToDefault()
					origKb.ConfigValue = b.assignedKey
					origKb.Update()
				})
			}
		})
		node = this.node.AddNode("Non defaults list")
		node.SaveConfig = false
		this.dynamicLists.push({
			node,
			filter: el => el.SaveConfig && !el.IsDefaultValue,
			create: (el, path) => {
				const toggle = skipNodes(path, 2).AddToggle(path.join(" > "), true)
				toggle.IconPath = ""
				toggle.SaveConfig = toggle.executeOnAdd = false
				toggle.OnDeactivate(() => {
					el.ResetToDefault()
					el.OnConfigLoaded()
					el.Update()
					toggle.DetachFromParent()
				})
			}
		})

		this.dynamicLists.forEach(l => {
			l.node.SaveConfig = false
		})

		this.isConstructed = true

		this.node.AddButton("Hard reset config").OnValue(() => {
			Menu.MenuManager.config = {}
			Menu.MenuManager.entries.forEach(e => {
				e?.ResetToDefault()
				e?.OnConfigLoaded()
			})
			Menu.MenuManager.Update(true)
			NotificationsSDK.Push(new ResetSettingsUpdated())
		})
	}
	public OnDraw() {
		if (!this.isConstructed || !Menu.MenuManager.IsOpen) {
			return
		}

		if (this.list !== undefined) {
			if (!this.list.IsOpen) {
				this.list.entries.clear()
				this.list = undefined
			}
		} else {
			this.dynamicLists.forEach(l =>
				l.node.IsOpen ? ((this.list = l.node), 0) : 0
			)
			if (this.list !== undefined) {
				const dlist = this.dynamicLists.find(l => l.node === this.list)
				if (dlist !== undefined) {
					this.keybindsSkipNodeIdx = Menu.MenuManager.entries.findIndex(
						v => v.InternalName === this.keybindsSkipNodeInternalName
					)
					if (this.keybindsSkipNodeIdx === -1) {
						console.error(
							`failed to find [${this.keybindsSkipNodeInternalName}] node in`,
							[...Menu.MenuManager.entries]
						)
					}
					Menu.MenuManager.foreachRecursive(el => {
						if (
							!el.IsNode &&
							el.SaveConfig &&
							el.parent instanceof Menu.Base &&
							el.parent.SaveConfig &&
							dlist.filter(el)
						) {
							const path = [el.Name]
							el.foreachParent(node => path.unshift(node.Name))
							dlist.create(el, path)
						}
					})
					dlist.node.Update(true)
					//dlist.node.entries.reverse()
				}
			}
		}
	}
}
