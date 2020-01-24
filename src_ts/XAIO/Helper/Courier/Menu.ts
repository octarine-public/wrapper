import { XAIOAutoUse, XAIOSelectLanguage } from "XAIO/Menu/bootstrap"
const XAIOMenu = XAIOAutoUse.AddNode(XAIOSelectLanguage("Курьер", "Courier"))
export const XAIOState = XAIOMenu.AddToggle(XAIOSelectLanguage("Вкл | выкл", "On | off"))
export const XAIODeliverState = XAIOMenu.AddToggle(XAIOSelectLanguage("Авто доставка", "Auto deliver"), true)
export const XAIOBestPosState = XAIOMenu.AddToggle(XAIOSelectLanguage("Лучшая позиция", "Best position"), true)
export const XAIOAutoSafeState = XAIOMenu.AddToggle(XAIOSelectLanguage("Авто сейф", "Auto safe"), true)
export const XAIOAutoSafeValue = XAIOMenu.AddSlider(XAIOSelectLanguage("Время между доставкой (сек)", "Time between delivery (sec)"), 2, 2, 60)