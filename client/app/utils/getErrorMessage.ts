import { isAxiosError } from 'axios';

export function getErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    return err.response?.data?.message ?? fallback;
  }

  return fallback;
}
