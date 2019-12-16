let constructors = new Map<string, any>(),
	sdk_classes: any[] = []

export function RegisterClass(name: string, constructor: any) {
	constructors.set(name, constructor)
	sdk_classes.push(constructor)
}

export function GetSDKClasses(): any[] {
	return sdk_classes
}

export default function GetConstructor(name: string) {
	return constructors.get(name)
}
