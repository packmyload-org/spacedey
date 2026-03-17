export function getAuthInputClass(hasError = false) {
  return `w-full rounded-lg border px-4 py-3 text-gray-700 outline-none transition-colors focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-red-500 focus:border-red-400 focus:ring-red-100'
      : 'border-gray-300 focus:border-[#1642F0] focus:ring-[#D8E2FF]'
  }`;
}
