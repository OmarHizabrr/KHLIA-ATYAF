import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/firebase";

export type AdminAccessStatus = "pending" | "approved" | "rejected";

export type AdminAccessRecord = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  status: AdminAccessStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
};

function accessDoc(uid: string) {
  return doc(db, "admin_access", uid);
}

function usersDoc(uid: string) {
  return doc(db, "users", uid);
}

export function isAdminApproved(status: AdminAccessStatus | null) {
  return status === "approved";
}

export function subscribeAuth(onChange: (user: User | null) => void) {
  return onAuthStateChanged(auth, onChange);
}

export function subscribeAccessStatus(
  uid: string,
  onChange: (status: AdminAccessStatus | null, record: AdminAccessRecord | null) => void,
) {
  return onSnapshot(accessDoc(uid), (snap) => {
    if (!snap.exists()) {
      onChange(null, null);
      return;
    }
    const data = snap.data() as AdminAccessRecord;
    onChange(data.status, data);
  });
}

export async function ensureAccessRecord(user: User) {
  const ref = accessDoc(user.uid);
  const current = await getDoc(ref);

  if (current.exists()) {
    const status = (current.data() as AdminAccessRecord).status;
    await setDoc(
      ref,
      {
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    await setDoc(
      usersDoc(user.uid),
      {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    return status;
  }

  const approvedSnap = await getDocs(
    query(collection(db, "admin_access"), where("status", "==", "approved"), limit(1)),
  );
  const firstAdmin = approvedSnap.empty;
  const status: AdminAccessStatus = firstAdmin ? "approved" : "pending";

  await setDoc(
    ref,
    {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      status,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } satisfies AdminAccessRecord,
    { merge: true },
  );

  await setDoc(
    usersDoc(user.uid),
    {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return status;
}

export async function adminSignInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const cred = await signInWithPopup(auth, provider);
  await ensureAccessRecord(cred.user);
  return cred.user;
}

export function subscribeAccessRequests(
  onChange: (records: AdminAccessRecord[]) => void,
  onError?: (error: unknown) => void,
) {
  const q = query(collection(db, "admin_access"), orderBy("createdAt", "desc"), limit(500));
  return onSnapshot(
    q,
    (snap) => {
      onChange(snap.docs.map((d) => d.data() as AdminAccessRecord));
    },
    onError,
  );
}

export async function setAccessStatus(uid: string, status: AdminAccessStatus) {
  await updateDoc(accessDoc(uid), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function adminSignOut() {
  await signOut(auth);
}

