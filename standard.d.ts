type BufferSource = ArrayBufferView | ArrayBuffer
declare namespace WebAssembly {
	interface CompileError {
	}

	var CompileError: {
		prototype: CompileError
		new(): CompileError
	}

	interface Global {
		value: any
		valueOf(): any
	}

	var Global: {
		prototype: Global
		new(descriptor: GlobalDescriptor, v?: any): Global
	}

	interface Instance {
		readonly exports: Exports
	}

	var Instance: {
		prototype: Instance
		new(module: Module, importObject?: Imports): Instance
	}

	interface LinkError {
	}

	var LinkError: {
		prototype: LinkError
		new(): LinkError
	}

	interface Memory {
		readonly buffer: ArrayBuffer
		grow(delta: number): number
	}

	var Memory: {
		prototype: Memory
		new(descriptor: MemoryDescriptor): Memory
	}

	interface Module {
	}

	var Module: {
		prototype: Module
		new(bytes: BufferSource): Module
		customSections(moduleObject: Module, sectionName: string): ArrayBuffer[]
		exports(moduleObject: Module): ModuleExportDescriptor[]
		imports(moduleObject: Module): ModuleImportDescriptor[]
	}

	interface RuntimeError {
	}

	var RuntimeError: {
		prototype: RuntimeError
		new(): RuntimeError
	}

	interface Table {
		readonly length: number
		get(index: number): Function | null
		grow(delta: number): number
		set(index: number, value: Function | null): void
	}

	var Table: {
		prototype: Table
		new(descriptor: TableDescriptor): Table
	}

	interface GlobalDescriptor {
		mutable?: boolean
		value: ValueType
	}

	interface MemoryDescriptor {
		initial: number
		maximum?: number
		shared?: boolean
	}

	interface ModuleExportDescriptor {
		kind: ImportExportKind
		name: string
	}

	interface ModuleImportDescriptor {
		kind: ImportExportKind
		module: string
		name: string
	}

	interface TableDescriptor {
		element: TableKind
		initial: number
		maximum?: number
	}

	interface WebAssemblyInstantiatedSource {
		instance: Instance
		module: Module
	}

	type ImportExportKind = "function" | "global" | "memory" | "table"
	type TableKind = "anyfunc"
	type ValueType = "f32" | "f64" | "i32" | "i64"
	type ExportValue = Function | Global | Memory | Table
	type Exports = Record<string, ExportValue>
	type ImportValue = ExportValue | number
	type ModuleImports = Record<string, ImportValue>
	type Imports = Record<string, ModuleImports>
	function compile(bytes: BufferSource): Promise<Module>
	function instantiate(bytes: BufferSource, importObject?: Imports): Promise<WebAssemblyInstantiatedSource>
	function instantiate(moduleObject: Module, importObject?: Imports): Promise<Instance>
	function validate(bytes: BufferSource): boolean
}

interface Console {
	memory: any
	assert(condition?: boolean, ...data: any[]): void
	clear(): void
	count(label?: string): void
	countReset(label?: string): void
	debug(...data: any[]): void
	dir(item?: any, options?: any): void
	dirxml(...data: any[]): void
	error(...data: any[]): void
	exception(message?: string, ...optionalParams: any[]): void
	group(...data: any[]): void
	groupCollapsed(...data: any[]): void
	groupEnd(): void
	info(...data: any[]): void
	log(...data: any[]): void
	table(tabularData?: any, properties?: string[]): void
	time(label?: string): void
	timeEnd(label?: string): void
	timeLog(label?: string, ...data: any[]): void
	timeStamp(label?: string): void
	trace(...data: any[]): void
	warn(...data: any[]): void
}
declare var console: Console
