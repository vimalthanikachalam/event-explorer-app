import { auth, db } from '@/common/config/firebase';
import { PublicUser } from '@/common/models';
import { storage, STORAGE_KEYS } from '@/common/storage/asyncStorage';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile, User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

function toMillis(value: any): number | undefined {

  if (!value) return undefined;
  if (typeof value === 'number') return value;
  if (typeof value?.toMillis === 'function') return value.toMillis();
  if (value?.seconds != null && value?.nanoseconds != null) {
    return value.seconds * 1000 + Math.floor(value.nanoseconds / 1e6);
  }
  return undefined;
}

export async function signUp(email: string, password: string, displayName?: string): Promise<PublicUser> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  const userRef = doc(db, 'users', cred.user.uid);
  await setDoc(
    userRef,
    {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: cred.user.displayName || displayName || null,
      photoURL: cred.user.photoURL,
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );

  const userForState: PublicUser = {
    uid: cred.user.uid,
    email: cred.user.email,
    displayName: cred.user.displayName || displayName || null,
    photoURL: cred.user.photoURL,
    createdAt: Date.now(),
  };
  await storage.set(STORAGE_KEYS.user, userForState);
  return userForState;
}

export async function signIn(email: string, password: string): Promise<PublicUser> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const ref = doc(db, 'users', cred.user.uid);
  const snap = await getDoc(ref);
  const data = snap.exists() ? (snap.data() as any) : null;
  const normalized: PublicUser | null = data
    ? {
        uid: data.uid || cred.user.uid,
        email: data.email ?? cred.user.email,
        displayName: data.displayName ?? cred.user.displayName,
        photoURL: data.photoURL ?? cred.user.photoURL,
        createdAt: toMillis(data.createdAt),
      }
    : null;
  const result: PublicUser =
    normalized || {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: cred.user.displayName,
      photoURL: cred.user.photoURL,
    };
  await storage.set(STORAGE_KEYS.user, result);
  return result;
}

export async function forgotPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function signOutUser() {
  await signOut(auth);
  await storage.remove(STORAGE_KEYS.user);
}

export function subscribeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getUserProfile(uid: string): Promise<PublicUser | null> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as any;
  return {
    uid: data.uid || uid,
    email: data.email ?? null,
    displayName: data.displayName ?? null,
    photoURL: data.photoURL ?? null,
    createdAt: toMillis(data.createdAt),
  };
}
