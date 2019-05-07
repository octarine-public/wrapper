import CheckBox from "../CrutchesSDK/Menu/CheckBox"
import { CreateRGBTree, MenuManager } from "../CrutchesSDK/Menu/MenuManager"

// ------------------- Main

let menu = new MenuManager("TestSDK")

let toggle = menu.AddToggle("toggle", false, "example toggle tips")
	.OnValue((value, self) => {
		console.log("toggle OnValue:", value, self)
	})
	.OnActivate(self => {
		console.log("toggle OnActivate:", self)
	})
	.OnDeactivate(self => {
		console.log("toggle OnDeactivate:", self)
	})

let checkbox = menu.AddCheckBox("checkbox", false, "example toggle tips")
	.OnValue((value, self) => {
		console.log("toggle OnValue:", value, self)
	})
	.OnActivate(self => {
		console.log("toggle OnActivate:", self)
	})
	.OnDeactivate(self => {
		console.log("toggle OnDeactivate:", self)
	})

let slider = menu.AddSlider("test slider", 15, 5, 20, "example slider tips")
	.OnValue((value, self) => {
		console.log("slider OnValue:", value, self)
	})

let sliderFloat = menu.AddSliderFloat("test sliderFloat", 15.3, 5.5, 20.7, "example sliderFloat tips")
	.OnValue((value, self) => {
		console.log("sliderFloat OnValue:", value, self)
	})

let keybind = menu.AddKeybind("keybind", "F", "example keybind tips")
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

let items = [
	"item 1",
	"item 2",
	"item 3",
	"item 4",
]

let comboBox = menu.AddComboBox("test comboBox", items, 2, "example comboBox tips")
	.OnValue((value, self) => {
		console.log("comboBox OnValue:", value, self)
	})

let listBox = menu.AddListBox("test listbox", items, [false, true, true, false], "example listBox tips")
	.OnValue((value, self) => {
		console.log("listBox OnValue:", value, self)
	})

let tree = menu.AddTree("tree")

let treeToggle = tree.AddToggle("tree toggle")

let rgbTree = CreateRGBTree(menu, "rgb tree", new Vector(0, 255, 0))

rgbTree.R.OnValue((value, self) => console.log("slider OnValue:", value, self))
rgbTree.G.OnValue((value, self) => console.log("slider OnValue:", value, self))
rgbTree.B.OnValue((value, self) => console.log("slider OnValue:", value, self))

/* menu.AddTree("tree");
menu.AddTree("tree");
menu.AddTree("tree");
menu.AddTree("tree");
menu.AddTree("tree");
menu.AddTree("tree");
menu.AddTree("tree");
menu.AddTree("tree");
menu.AddTree("tree");
menu.AddTree("tree");
menu.AddTree("tree");
menu.AddTree("tree");
menu.AddTree("tree");

 */

/* let tree2 = menu.AddTree("tree2").AddTree("tree3").AddTree("tree4").AddTree("tree5").AddTree("tree6").AddToggle("toggle");
 */
// ------------------- examples

let examples = menu.AddTree("examples")

/*
------------ swap tree (node)

if true toggleTwo will be located in tree else in root tree

*/

let swapTree = examples.AddTree("swap tree (node)")

let swapTree_toggle = swapTree.AddToggle("toggle")
	.OnValue(value => {
		console.log("before parent: ", swapTree_toggleTwo.parent.name)

		swapTree_toggleTwo.parent = value ? swapTree_tree : swapTree

		console.log("after parent: ", swapTree_toggleTwo.parent.name)
	})

let swapTree_tree = swapTree.AddTree("tree test")

let swapTree_toggleTwo = (swapTree_toggle.value ? swapTree_tree : swapTree).AddToggle("toggleTwo")

/*
------------ dynamic checkboxes

dynamic count checkboxes by slider

*/

let dynamicCB = examples.AddTree("dynamic checkboxes")

let sliderTwo = dynamicCB.AddSlider("count checkboxes", 1, 1, 5)

let checkboxes: CheckBox[] = []
function ChangeCheckBoxes(value: number) {

	// loop-optimizer: KEEP
	dynamicCB.entries = dynamicCB.entries.filter(entry => checkboxes.indexOf(entry as CheckBox) === -1)

	for (let i = 0; i < value; i++)
		checkboxes.push(dynamicCB.AddCheckBox("checkbox" + (i + 1)))
}
sliderTwo.OnValueCallback = ChangeCheckBoxes
ChangeCheckBoxes(sliderTwo.value)

let menuTest = menu.AddTree("test tree")

let menuList = menuTest.AddListBox("List of status", [
	"rune status",
	"rune keybinds",
	"items status",
	"items keybinds",
], [true, false, true, false])

/* Events.on("onTick", () => {
	console.log("selected_flags:", menuList.selected_flags);

	console.log("selected_flags[0]:", menuList.selected_flags[0]);
	console.log("selected_flags[1]:", menuList.selected_flags[1]);
	console.log("selected_flags[2]:", menuList.selected_flags[2]);
	console.log("selected_flags[3]:", menuList.selected_flags[3]);
});
 */

// ------------------------------

/* let menu = new Menu_Node("test");

let items = [
	"item 1",
	"item 2",
	"item 3",
	"item 4"
];

let list = new Menu_List("test listbox", items, [false, true, true, false], "example listBox tips");

list.callback = function (self) {
	console.log("listBox OnValue: ", self.selected_flags, self);
}

menu.entries.push(list);

let toggle = new Menu_Toggle("test toggle", false);

toggle.callback = function (self) {

	console.log(1);

	if (self.value) {

		// loop-optimizer: KEEP  // because items reverse
		menu.entries = menu.entries.filter(ctrlNow => ctrlNow !== toggleTwo);

		treetwo.entries.push(toggleTwo);

	} else {

		// loop-optimizer: KEEP  // because items reverse
		treetwo.entries = treetwo.entries.filter(ctrlNow => ctrlNow !== toggleTwo);

		menu.entries.push(toggleTwo);
	}

	menu.Update();
}

menu.entries.push(toggle);

let treetwo = new Menu_Node("tree two");
menu.entries.push(treetwo);

let toggleTwo = new Menu_Toggle("test toggleTwo", false);

menu.entries.push(toggleTwo);

menu.Update();

Menu.AddEntry(menu) */
