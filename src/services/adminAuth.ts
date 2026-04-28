import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { auth } from "@/firebase";

function normalizeList(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(user: User | null) {
  const allowed = normalizeList(process.env.NEXT_PUBLIC_ADMIN_EMAILS);
  if (!user?.email) return false;
  if (allowed.length === 0) return false;
  return allowed.includes(user.email.toLowerCase());
}

export function subscribeAuth(onChange: (user: User | null) => void) {
  return onAuthStateChanged(auth, onChange);
}

export async function adminSignIn(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  if (!isAdminUser(cred.user)) {
    await signOut(auth);
    throw new Error("ليس لديك صلاحية الدخول.");
  }
  return cred.user;
}

export async function adminSignOut() {
  await signOut(auth);
}

