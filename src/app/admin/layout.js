import AdminLayout from "@/components/admin/AdminLayout";
import { Suspense } from "react";

export default function AdminRootLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminLayout>{children}</AdminLayout>
    </Suspense>
  );
}
