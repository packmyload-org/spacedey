"use client";

import { Eye, EyeOff } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import {
  getPasswordRequirementStatus,
  getPasswordRulesAttribute,
  PASSWORD_POLICY_MESSAGES,
} from '@/lib/auth/passwordPolicy';

type PasswordFieldProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  error?: string;
  placeholder?: string;
  autoComplete?: 'current-password' | 'new-password';
  name?: string;
  className?: string;
  inputClassName?: string;
  showRequirements?: boolean;
  disabled?: boolean;
};

export default function PasswordField({
  label,
  value,
  onChange,
  onFocus,
  error,
  placeholder,
  autoComplete = 'new-password',
  name,
  className,
  inputClassName,
  showRequirements = false,
  disabled = false,
}: PasswordFieldProps) {
  const inputId = useId();
  const [isVisible, setIsVisible] = useState(false);
  const requirements = useMemo(
    () => getPasswordRequirementStatus(value),
    [value]
  );

  const resolvedInputClassName =
    inputClassName ||
    `w-full rounded-lg border px-4 py-3 pr-12 text-gray-700 outline-none transition-colors focus:outline-none focus:ring-2 ${
      error
        ? 'border-red-500 focus:border-red-400 focus:ring-red-100'
        : 'border-gray-300 focus:border-[#1642F0] focus:ring-[#D8E2FF]'
    }`;
  const passwordManagerProps =
    autoComplete === 'new-password'
      ? ({ passwordRules: getPasswordRulesAttribute() } as Record<string, string>)
      : {};

  return (
    <label className={className || 'block'}>
      {label ? (
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
      ) : null}
      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...passwordManagerProps}
          className={resolvedInputClassName}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          {isVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {error ? <div className="mt-1 text-xs text-red-500">{error}</div> : null}

      {showRequirements ? (
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-xs">
          {(Object.keys(PASSWORD_POLICY_MESSAGES) as Array<keyof typeof PASSWORD_POLICY_MESSAGES>).map((key) => (
            <div
              key={key}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 ${
                requirements[key]
                  ? 'bg-green-50 text-green-700'
                  : 'bg-slate-100 text-gray-500'
              }`}
            >
              {requirements[key] ? '✓' : '○'} {PASSWORD_POLICY_MESSAGES[key]}
            </div>
          ))}
        </div>
      ) : null}
    </label>
  );
}
