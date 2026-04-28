import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentReference,
  type Query,
  type QueryConstraint,
  type QuerySnapshot,
  type CollectionReference,
  type DocumentData,
} from "firebase/firestore";
import { app } from "@/firebase";

const db = getFirestore(app);

type UserData = {
  uid?: string;
  displayName?: string;
  photoURL?: string;
};

type SetDataArgs<T extends DocumentData> = {
  docRef: DocumentReference<T>;
  data: Partial<T> & Record<string, unknown>;
  merge?: boolean;
  userData?: UserData;
};

type UpdateDataArgs<T extends DocumentData> = {
  docRef: DocumentReference<T>;
  data: Partial<T> & Record<string, unknown>;
  userData?: UserData;
};

/**
 * FirestoreApi - TypeScript Service (بنفس فكرة النمط الذي زوّدتنا به)
 * - الكتابة عبر setData/updateData حصراً
 * - بدون try/catch داخل الدوال (الأخطاء تذهب للمستدعي)
 */
class FirestoreApi {
  static get Api() {
    return new FirestoreApi();
  }

  // ==============================
  // دوال مرجعية بسيطة
  // ==============================

  /** الحصول على ID جديد */
  getNewId(collectionName: string) {
    return doc(collection(db, collectionName)).id;
  }

  /** إرجاع مرجع لمجموعة */
  getCollection<T extends DocumentData = DocumentData>(
    collectionName: string,
  ): CollectionReference<T> {
    return collection(db, collectionName) as CollectionReference<T>;
  }

  /** إرجاع مرجع لمستند */
  getDocument<T extends DocumentData = DocumentData>(
    collectionName: string,
    documentId: string,
  ): DocumentReference<T> {
    return doc(db, collectionName, documentId) as DocumentReference<T>;
  }

  /** إرجاع مرجع لمجموعة فرعية */
  getSubCollection<T extends DocumentData = DocumentData>(
    collectionName: string,
    documentId: string,
    subCollectionName: string,
  ): CollectionReference<T> {
    return collection(db, collectionName, documentId, subCollectionName) as CollectionReference<T>;
  }

  /** إرجاع مرجع لمستند داخل مجموعة فرعية */
  getSubDocument<T extends DocumentData = DocumentData>(
    collectionName: string,
    documentId: string,
    subCollectionName: string,
    subDocumentId: string,
  ): DocumentReference<T> {
    return doc(db, collectionName, documentId, subCollectionName, subDocumentId) as DocumentReference<T>;
  }

  // ==============================
  // مسارات مشروع خليطة أطياف
  // ==============================

  getProductsCollection() {
    return this.getCollection("products");
  }
  getProductDoc(productId: string) {
    return this.getDocument("products", productId);
  }

  getCategoriesCollection() {
    return this.getCollection("categories");
  }
  getCategoryDoc(categoryId: string) {
    return this.getDocument("categories", categoryId);
  }

  getOrdersCollection() {
    return this.getCollection("orders");
  }
  getOrderDoc(orderId: string) {
    return this.getDocument("orders", orderId);
  }

  getBannersCollection() {
    return this.getCollection("banners");
  }
  getBannerDoc(bannerId: string) {
    return this.getDocument("banners", bannerId);
  }

  getSettingsDoc(docId = "global") {
    return this.getDocument("settings", docId);
  }

  // ==============================
  // CRUD الأساسية
  // ==============================

  /** إنشاء أو تعيين بيانات مستند - النقطة المركزية للكتابة */
  async setData<T extends DocumentData>({
    docRef,
    data,
    merge = true,
    userData = {},
  }: SetDataArgs<T>) {
    const newData = {
      ...data,
      createdByName: userData.displayName || "",
      createdByImageUrl: userData.photoURL || "",
      createdBy: userData.uid || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, newData as unknown as T, { merge });
  }

  /** تحديث بيانات مستند - النقطة المركزية للتحديث */
  async updateData<T extends DocumentData>({
    docRef,
    data,
    userData = {},
  }: UpdateDataArgs<T>) {
    const updatedData: Record<string, unknown> = { ...data };
    if (!updatedData.updatedByName) updatedData.updatedByName = userData.displayName || "";
    if (!updatedData.updatedByImageUrl) updatedData.updatedByImageUrl = userData.photoURL || "";
    updatedData.updatedAt = serverTimestamp();

    await updateDoc(docRef as unknown as DocumentReference<DocumentData>, updatedData);
  }

  /** جلب بيانات مستند */
  async getData<T extends DocumentData>(docRef: DocumentReference<T>) {
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as T) : null;
  }

  /** حذف مستند */
  async deleteData<T extends DocumentData>(docRef: DocumentReference<T>) {
    await deleteDoc(docRef);
  }

  // ==============================
  // Queries + Snapshots
  // ==============================

  buildQuery<T extends DocumentData>(
    colRef: CollectionReference<T>,
    constraints: QueryConstraint[] = [],
  ): Query<T> {
    return query(colRef, ...constraints);
  }

  /** جلب مستندات من مجموعة */
  async getDocuments<T extends DocumentData>(q: Query<T> | CollectionReference<T>) {
    const snapshot = await getDocs(q);
    return snapshot.docs;
  }

  /** اشتراك لحظي: يعيد دالة إلغاء الاشتراك. */
  subscribeSnapshot<T extends DocumentData>(
    refOrQuery: Query<T> | DocumentReference<T> | CollectionReference<T>,
    onNext: (snapshot: QuerySnapshot<T> | unknown) => void,
    onError?: (error: unknown) => void,
  ) {
    // onSnapshot يدعم DocumentReference/Query/CollectionReference
    return onSnapshot(
      refOrQuery as unknown as Query<T>,
      onNext as (snapshot: QuerySnapshot<T>) => void,
      onError,
    );
  }

  // ==============================
  // Queries جاهزة للمتجر
  // ==============================

  productsActiveQuery({ categoryId, newestFirst = true }: { categoryId?: string; newestFirst?: boolean } = {}) {
    const constraints: QueryConstraint[] = [where("isActive", "==", true)];
    if (categoryId) constraints.push(where("categoryId", "==", categoryId));
    constraints.push(orderBy("createdAt", newestFirst ? "desc" : "asc"));
    constraints.push(limit(60));
    return this.buildQuery(this.getProductsCollection(), constraints);
  }
}

export default FirestoreApi;

