const MIN_PASSWORD_LENGTH = 8;

export const PASSWORD_POLICY_MESSAGES = {
  minLength: `At least ${MIN_PASSWORD_LENGTH} characters`,
  uppercase: 'At least 1 uppercase letter',
  number: 'At least 1 number',
  symbol: 'At least 1 symbol',
} as const;

export type PasswordRequirementKey = keyof typeof PASSWORD_POLICY_MESSAGES;

const PASSWORD_REQUIREMENT_TESTS: Record<PasswordRequirementKey, (value: string) => boolean> = {
  minLength: (value) => value.length >= MIN_PASSWORD_LENGTH,
  uppercase: (value) => /[A-Z]/.test(value),
  number: (value) => /\d/.test(value),
  symbol: (value) => /[^A-Za-z0-9]/.test(value),
};

export function getPasswordRequirementStatus(password: string) {
  return {
    minLength: PASSWORD_REQUIREMENT_TESTS.minLength(password),
    uppercase: PASSWORD_REQUIREMENT_TESTS.uppercase(password),
    number: PASSWORD_REQUIREMENT_TESTS.number(password),
    symbol: PASSWORD_REQUIREMENT_TESTS.symbol(password),
  };
}

export function validatePasswordStrength(password: string) {
  const requirementStatus = getPasswordRequirementStatus(password);
  const failedRequirements = (Object.keys(requirementStatus) as PasswordRequirementKey[]).filter(
    (key) => !requirementStatus[key]
  );

  return {
    isValid: failedRequirements.length === 0,
    failedRequirements,
    message:
      failedRequirements.length > 0
        ? `Password must include ${failedRequirements
            .map((key) => PASSWORD_POLICY_MESSAGES[key].toLowerCase())
            .join(', ')}.`
        : null,
  };
}

export function getPasswordRulesAttribute() {
  return 'minlength: 8; required: upper; required: digit; required: special;';
}
