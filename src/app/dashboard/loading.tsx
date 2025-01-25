import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <Image
        className="animate-bounce opacity-50"
        src="/logo.svg"
        alt="loading"
        width={64}
        height={64}
      />
    </div>
  );
}
