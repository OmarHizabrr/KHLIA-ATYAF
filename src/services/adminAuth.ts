import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "@/firebase";

export function isAdminUser(user: User | null) {
  // المطلوب الحالي: أي مستخدم يسجل عبر Google يُسمح له بدخول الإدارة.
  return Boolean(user);
}

export function subscribeAuth(onChange: (user: User | null) => void) {
  return onAuthStateChanged(auth, onChange);
}

export async function adminSignInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const cred = await signInWithPopup(auth, provider);
  if (!isAdminUser(cred.user)) {
    await signOut(auth);
    throw new Error("ليس لديك صلاحية الدخول.");
  }
  return cred.user;
}

export async function adminSignOut() {
  await signOut(auth);
}

