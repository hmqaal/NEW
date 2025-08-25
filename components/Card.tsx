import { PropsWithChildren } from "react";
export default function Card({ children }: PropsWithChildren) {
  return <div className="rounded-xl border bg-white p-4 shadow-sm">{children}</div>;
}
