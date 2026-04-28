import Image from "next/image";

export function Brand({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/logo.png"
        alt="شعار خلية أطياف"
        width={44}
        height={44}
        priority
      />
      <div className="leading-tight">
        <div className="text-lg font-semibold text-zinc-900">خلية أطياف</div>
        <div className="text-xs font-semibold tracking-wide text-zinc-500">
          KHLIA ATYAF
        </div>
      </div>
    </div>
  );
}

