import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Omnishelf Library",
  description: "Securely sign in to your Omnishelf library account to manage your borrows and reservations.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
