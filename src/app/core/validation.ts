// Mesmo padrão de e-mail usado por z.email() no procureflow-web.
const EMAIL_PATTERN =
  /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/;

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

export function isEmail(value: string) {
  return EMAIL_PATTERN.test(value);
}

export function hasErrors(errors: FieldErrors<string>) {
  return Object.keys(errors).length > 0;
}
