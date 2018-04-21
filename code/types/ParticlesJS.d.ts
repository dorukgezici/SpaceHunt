declare function particlesJS(elementID: string, configuration: any): void;

interface Window {
	pJSDom: null | Array<{
		pJS: {
			fn: {
				vendors: {
					destroypJS(): void
				}
			}
		}
	}>
}
