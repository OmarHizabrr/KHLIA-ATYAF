type QueryDocLike<T> = {
  data: () => T;
};

type QuerySnapshotLike<T> = {
  docs?: QueryDocLike<T>[];
};

export function docsFromSnapshot<T>(snapshot: unknown): T[] {
  const snap = snapshot as QuerySnapshotLike<T>;
  return (snap.docs ?? []).map((d) => d.data());
}

