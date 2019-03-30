import Techies from "AllVision/Techies"
import TreantProtector from "AllVision/TreantProtector"
var config = {
	enabled: true
}
// Techies()
TreantProtector()
{
	let root = new Menu_Node("AllVision")
	root.entries.push(new Menu_Toggle (
		"State",
		config.enabled,
		node => config.enabled = node.value
	))
	/*root.entries.push(new Menu_Boolean (
		"Kill creeps",
		config.kill_creeps,
		node => config.kill_creeps = node.value
	))
	root.entries.push(new Menu_Boolean (
		"Kill heroes",
		config.kill_heroes,
		node => config.kill_heroes = node.value
	))*/
	root.Update()
	Menu.AddEntry(root)
}