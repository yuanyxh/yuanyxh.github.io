declare interface ProcedureFunction {
  (): void;
}

declare interface AsyncFunction {
  (): Promise<boolean>;
}

declare type ArgsFunction = <T>(...args: unknown[]) => T;
