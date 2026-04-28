# خلية أطياف | KHLIA ATYAF

منصة متجر إلكتروني حديثة (PWA) تعمل على الجوال والويب، مبنية باستخدام:

- Next.js + React
- Tailwind CSS
- Firebase (Firestore / Storage / Authentication)
- Vercel

## التشغيل محليًا

```bash
npm install
npm run dev
```

ثم افتح: [http://localhost:3000](http://localhost:3000)

## متغيرات البيئة

أنشئ ملف `.env.local` وضع البريد المسموح لدخول الإدارة:

```env
NEXT_PUBLIC_ADMIN_EMAILS=owner@example.com
```

## دخول الإدارة

- الدخول عبر Google فقط من `/admin/login`
- يجب تفعيل Google Sign-In في Firebase Authentication
- يجب أن يكون البريد ضمن `NEXT_PUBLIC_ADMIN_EMAILS`
