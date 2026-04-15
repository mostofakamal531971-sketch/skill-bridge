/**
 * Profile payload from `GET /auth/me` (shape varies by role: student, tutor, admin, etc.).
 */
export type IUser = Record<string, unknown> & {
  id?: string;
  userId?: string;
  name?: string;
  email?: string;
  role?: string;
  user?: { id?: string; email?: string; name?: string };
};

