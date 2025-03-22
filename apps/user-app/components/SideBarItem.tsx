"use client";
import { usePathname, useRouter } from "next/navigation";

type SideBarItemProps = {
  href: string;
  title: string;
  icon: React.ReactNode;
};

export function SideBarItem({ href, title, icon }: SideBarItemProps) {
  const pathname = usePathname();
  const router = useRouter();

  const current = pathname === href;
  return (
    <div
      className={`${current ? "border border-slate-400 text-[#6a51a6]" : "text-slate-500"}
        flex p-4 items-center  cursor-pointer`}
      onClick={() => {
        router.push(href);
      }}
    >
      <div className="pr-2">{icon}</div>
      <div className={`${current ? "font-semibold" : ""}`}>{title}</div>
    </div>
  );
}
