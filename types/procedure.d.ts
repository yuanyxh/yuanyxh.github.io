declare interface ProcedureFunction {
  (): void;
}

declare interface AsyncFunction {
  (): Promise<boolean>;
}
