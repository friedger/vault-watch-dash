import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { TutorialProvider } from "@/components/tutorial/TutorialContext";
import { TutorialDialog } from "@/components/tutorial/TutorialDialog";

// Lazy load all pages
const Index = lazy(() => import("./pages/Index"));
const Withdraw = lazy(() => import("./pages/Withdraw"));
const VaultDetails = lazy(() => import("./pages/VaultDetails"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TutorialProvider>
        <Toaster />
        <Sonner />
        <TutorialDialog />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/withdraw" element={<Withdraw />} />
              <Route path="/withdraw/:requestId" element={<Withdraw />} />
              <Route path="/vault" element={<VaultDetails />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TutorialProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
