import { Menu } from "wrapper/Imports"

const section = Menu.AddEntry(["Utility", "Safe to leave"])
const keybind = section.AddKeybind("Send message")
const language = section.AddSwitcher("Language", ["Russian", "English"])
const gap: string = "<br>".repeat(75)

// noinspection UnterminatedStatementJS
keybind.OnPressed(() => {
	let primaryMessage: string
	let safeToLeaveMessage: string

	// На будущее, если понадобится добавить ещё языки
	if (language.selected_id === 0) {
		primaryMessage = "Замечено плохое соединение. " +
			"Статистика не будет записана. Показатели рейтинга не изменятся."
		safeToLeaveMessage = "Теперь эту игру можно спокойно покинуть."
	} else {
		primaryMessage = "Poor network connections have been detected. " +
			"No stats will be recorded for this match. Matchmaking rating (MMR) will not be updated."
		safeToLeaveMessage = "Players may now leave this match without being assessed with an abandon."
	}

	// noinspection HtmlDeprecatedTag
	ChatWheelAbuse(`${gap}${primaryMessage}<br><font color='#00FF00'><b>${safeToLeaveMessage}</b></font>`)
})
