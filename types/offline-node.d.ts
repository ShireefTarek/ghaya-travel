declare const process: {
  env: Record<string, string | undefined>;
};

declare function require(moduleName: string): any;

declare module 'node:child_process' {
  export function spawnSync(...args: any[]): any;
}

declare module 'node:fs' {
  export const promises: any;
  export function existsSync(path: string): boolean;
  export function mkdirSync(path: string, options?: any): void;
  export function rmSync(path: string, options?: any): void;
  export function readdirSync(path: string): string[];
  export function readFileSync(path: string, options?: any): string | Buffer;
  export function writeFileSync(path: string, data: string | Buffer, options?: any): void;
  export function statSync(path: string): any;
}

declare module 'node:path' {
  export function resolve(...paths: string[]): string;
  export function join(...paths: string[]): string;
}

declare module 'node:crypto' {
  export function randomUUID(): string;
}

declare module 'node:url' {
  export function pathToFileURL(path: string): any;
}

declare module 'node:module' {
  const Module: any;
  export = Module;
}

declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => any): void;
declare function test(name: string, fn: () => any): void;
declare function beforeAll(fn: () => any): void;
declare function afterAll(fn: () => any): void;
declare function expect(actual: any): any;
