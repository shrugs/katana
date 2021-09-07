export class RuleResultError extends Error {
  constructor(public original: Error) {
    super(original.message);
  }
}

export class MissingResultDependency extends RuleResultError {
  public readonly name: 'MissingResultDependency';
}

export class SetResultStateError extends RuleResultError {
  public readonly name: 'SetResultStateError';
}

export class RuleResult {
  constructor(public description: string) {}
}
