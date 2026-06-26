import { Menu } from "../../../wrapper/Imports"

// Dedicated tab that gathers every menu animation toggle in one convenient place.
export class InternalAnimations {
	private readonly tree: Menu.Node

	constructor(settings: Menu.Node) {
		this.tree = settings.AddNode("Animations", "menu/icons/animation.svg")
		this.tree.SortNodes = false

		this.tree
			.AddToggle(
				"Menu open animation",
				true,
				"Fade the menu in\nwhen you open it",
				0,
				"menu/icons/menu-open.svg"
			)
			.OnValue(t => (Menu.Base.MenuOpenAnimation = t.value))

		this.tree
			.AddToggle(
				"Tab open animation",
				true,
				"Reveal a tab's contents\nwhen you open it",
				0,
				"menu/icons/tab-open.svg"
			)
			.OnValue(t => (Menu.Base.TabOpenAnimation = t.value))

		this.tree
			.AddToggle(
				"Tab hover animation",
				true,
				"Animate icons\nwhen hovering",
				0,
				"menu/icons/hover-arrow.svg"
			)
			.OnValue(t => (Menu.Base.HoverAnimation = t.value))

		this.tree
			.AddToggle(
				"Dropdown animation",
				true,
				"Fade a dropdown's list\nopen and closed",
				0,
				"menu/icons/dropdown-open.svg"
			)
			.OnValue(t => (Menu.Base.DropdownOpenAnimation = t.value))
	}
}
