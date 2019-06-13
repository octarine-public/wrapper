import { MenuManager, Color } from "../Imports"

import { Menu } from "./CrutchesSDKExamples";

const MenuExamples = Menu.AddTree("Menu Examples")

// ------------------- Main

const toggle = MenuExamples.AddToggle("toggle", false, "example toggle tips")
	.OnValue((value, self) => {
		console.log("toggle OnValue:", value, self)
	})
	.OnActivate(self => {
		console.log("toggle OnActivate:", self)
	})
	.OnDeactivate(self => {
		console.log("toggle OnDeactivate:", self)
	})

const checkbox = MenuExamples.AddCheckBox("checkbox", false, "example toggle tips")
	.OnValue((value, self) => {
		console.log("toggle OnValue:", value, self)
	})
	.OnActivate(self => {
		console.log("toggle OnActivate:", self)
	})
	.OnDeactivate(self => {
		console.log("toggle OnDeactivate:", self)
	})

const slider = MenuExamples.AddSlider("test slider", 15, 5, 20, "example slider tips")
	.OnValue((value, self) => {
		console.log("slider OnValue:", value, self)
	})

const sliderFloat = MenuExamples.AddSliderFloat("test sliderFloat", 15.3, 5.5, 20.7, "example sliderFloat tips")
	.OnValue((value, self) => {
		console.log("sliderFloat OnValue:", value, self)
	})

const keybind = MenuExamples.AddKeybind("keybind", "F", "example keybind tips")
	.OnValue((value, self) => {
		console.log("keybind OnValue:", value, self)
	})
	.OnExecute((isPressed, self) => {
		console.log("keybind OnExecute:", isPressed, self)
	})
	.OnPressed(self => {
		console.log("keybind OnPressed:", self)
	})
	.OnRelease(self => {
		console.log("keybind OnRelease:", self)
	})

const items = [
	"item 1",
	"item 2",
	"item 3",
	"item 4",
]

const comboBox = MenuExamples.AddComboBox("test comboBox", items, 2, "example comboBox tips")
	.OnValue((value, self) => {
		console.log("comboBox OnValue:", value, self)
	})

const listBox = MenuExamples.AddListBox("test listbox", items, [false, true, true, false], "example listBox tips")
	.OnValue((value, self) => {
		console.log("listBox OnValue:", value, self)
	})

const tree = MenuExamples.AddTree("tree")

const treeToggle = tree.AddToggle("tree toggle")

const rgbTree = MenuManager.CreateRGBTree(MenuExamples, "rgb tree", new Color(0, 255, 0))

rgbTree.R.OnValue((value, self) => console.log("slider RGB: R OnValue:", value, self))
rgbTree.G.OnValue((value, self) => console.log("slider RGB: G OnValue:", value, self))
rgbTree.B.OnValue((value, self) => console.log("slider RGB: B OnValue:", value, self))

const rgbaTree = MenuManager.CreateRGBATree(MenuExamples, "rgba tree", new Color(0, 255, 0, 150))

rgbaTree.R.OnValue((value, self) => console.log("slider RGBA: R OnValue:", value, self))
rgbaTree.G.OnValue((value, self) => console.log("slider RGBA: G OnValue:", value, self))
rgbaTree.B.OnValue((value, self) => console.log("slider RGBA: B OnValue:", value, self))
rgbaTree.A.OnValue((value, self) => console.log("slider RGBA: A OnValue:", value, self))

/* MenuExamples.AddTree("tree");
MenuExamples.AddTree("tree");
MenuExamples.AddTree("tree");
MenuExamples.AddTree("tree");
MenuExamples.AddTree("tree");
MenuExamples.AddTree("tree");
MenuExamples.AddTree("tree");
MenuExamples.AddTree("tree");
MenuExamples.AddTree("tree");
MenuExamples.AddTree("tree");
MenuExamples.AddTree("tree");
MenuExamples.AddTree("tree");
MenuExamples.AddTree("tree");

 */

/* const tree2 = MenuExamples.AddTree("tree2").AddTree("tree3").AddTree("tree4").AddTree("tree5").AddTree("tree6").AddToggle("toggle");
 */
// ------------------- examples

const examples = MenuExamples.AddTree("examples")

/*
------------ swap tree (node)

if true toggleTwo will be located in tree else in root tree

*/

const swapTree = examples.AddTree("swap tree (node)")

const swapTree_toggle = swapTree.AddToggle("toggle")
	.OnValue(value => {
		console.log("before parent: ", swapTree_toggleTwo.parent.name)

		swapTree_toggleTwo.parent = value ? swapTree_tree : swapTree

		console.log("after parent: ", swapTree_toggleTwo.parent.name)
	})

const swapTree_tree = swapTree.AddTree("tree test")

const swapTree_toggleTwo = (swapTree_toggle.value ? swapTree_tree : swapTree).AddToggle("toggleTwo")

/*
------------ dynamic checkboxes

dynamic count checkboxes by slider

*/

const dynamicCB = examples.AddTree("dynamic checkboxes")

const sliderTwo = dynamicCB.AddSlider("count checkboxes", 1, 1, 5)

let checkboxes: MenuManager.MenuControllers.CheckBox[] = []
function ChangeCheckBoxes(value: number) {

	// loop-optimizer: KEEP
	dynamicCB.entries = dynamicCB.entries.filter(entry => checkboxes.indexOf(entry as MenuManager.MenuControllers.CheckBox) === -1)

	for (let i = 0; i < value; i++)
		checkboxes.push(dynamicCB.AddCheckBox("checkbox" + (i + 1)))
}
sliderTwo.OnValueCallback = ChangeCheckBoxes
ChangeCheckBoxes(sliderTwo.value)

const menuTest = MenuExamples.AddTree("test tree")

const menuList = menuTest.AddListBox("List of status", [
	"rune status",
	"rune keybinds",
	"items status",
	"items keybinds",
], [true, false, true, false])