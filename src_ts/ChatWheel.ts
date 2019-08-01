import { Courier, Entity, EntityManager, EventsSDK, Game, Hero, LocalPlayer, MenuManager, Player, Unit } from "wrapper/Imports"

const { MenuFactory } = MenuManager,
    tree = MenuFactory("Leaver"),
    leave = tree.AddKeybind('Leave button xD')
leave.OnPressed(btn=>{
    ChatWheelAbuse('отключается от игры. Пожалуйста, дождитесь повторного подключения.')
    ChatWheelAbuse('<font color="red">осталось 5 мин. для повторного подключения.</font>')
    setTimeout(()=>{
        ChatWheelAbuse('покидает игру.')
        ChatWheelAbuse('<font color="lightgreen">Терерь эту игру можно спокойно покинуть. Статистика не будет записана.</font>')
    },1000)
})