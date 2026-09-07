import TopNav from "@/components/TopNav";
import LeftSidebar from "@/components/LeftSidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <div className="flex-1 overflow-y-auto bg-white flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
