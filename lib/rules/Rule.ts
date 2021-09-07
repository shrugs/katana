export interface Rule {
  run(account: string): Promise<boolean>;
}
