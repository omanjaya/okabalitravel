import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <AdminHeader />

      {/* Sidebar & Main Content */}
      <div className="flex pt-16">
        {/* Fixed Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <main className="flex-1 ml-64 min-h-[calc(100vh-4rem)]">
          <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
            {children}
          </div>

          {/* Admin Footer */}
          <footer className="border-t border-gray-200 bg-white mt-12">
            <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  &copy; {new Date().getFullYear()} OkabaliTravel. All rights reserved.
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    System Online
                  </span>
                  <span>Admin Panel v1.0</span>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
