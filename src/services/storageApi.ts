import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase";

export async function uploadPublicImage(file: File, path: string) {
  const r = ref(storage, path);
  const snap = await uploadBytes(r, file, {
    contentType: file.type || "image/png",
    cacheControl: "public,max-age=31536000,immutable",
  });
  return await getDownloadURL(snap.ref);
}

