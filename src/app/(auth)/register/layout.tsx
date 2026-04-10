import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Omnishelf Library",
  description: "Create your Omnishelf library account to start borrowing books and managing your reading list.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
