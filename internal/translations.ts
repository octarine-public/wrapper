import { Menu, Utils } from "../wrapper/Imports"

function Load(name: string) {
	return new Map<string, string>(
		Object.entries(Utils.readJSON(`translations/${name}.json`))
	)
}
Menu.Localization.AddLocalizationUnit("russian", Load("ru"))
Menu.Localization.AddLocalizationUnit("english", Load("en"))
Menu.Localization.AddLocalizationUnit("chinese", Load("cn"))
