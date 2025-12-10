import { Navbar } from "./Navbar";
import { CustomToaster } from "../CustomToaster";
import { LinkTwitterModal } from "../onboarding/LinkTwitterModal";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background font-sans antialiased">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-6 selection:bg-primary selection:text-primary-foreground">
        {children}
      </main>
      <LinkTwitterModal />
      <CustomToaster />
    </div>
  );
}
