import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={
                  <ErrorBoundary>
                    <Index />
                  </ErrorBoundary>
                } />
                <Route path="/admin" element={
                  <ErrorBoundary>
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  </ErrorBoundary>
                } />
                <Route path="/admin/login" element={
                  <ErrorBoundary>
                    <Login />
                  </ErrorBoundary>
                } />
                <Route path="*" element={
                  <ErrorBoundary>
                    <NotFound />
                  </ErrorBoundary>
                } />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
