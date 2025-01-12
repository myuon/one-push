export const parsePathParam = (
  pattern: string,
  value: string
): Record<string, string> | undefined => {
  const patternParts = pattern.split("/");
  const valueParts = value.split("/");

  if (patternParts.length !== valueParts.length) {
    return undefined;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const valuePart = valueParts[i];

    if (patternPart === valuePart) {
      continue;
    }

    if (patternPart.startsWith(":")) {
      const key = patternPart.slice(1);
      params[key] = valuePart;
    } else {
      return undefined;
    }
  }

  return params;
};
