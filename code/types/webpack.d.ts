declare const require: {
	<T = string>(path: string): T;
	(paths: string[], callback: (...modules: any[]) => void): void;
	ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

type ENVType = "prod" | "dev" | "test";
declare const ENV: ENVType;
interface Window {
	ENV: ENVType;
}
