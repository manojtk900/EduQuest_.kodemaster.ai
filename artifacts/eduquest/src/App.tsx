import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/dashboard";
import Missions from "@/pages/missions";
import Leaderboard from "@/pages/leaderboard";
import Profile from "@/pages/profile";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      <Route path="/">
        <Layout><Dashboard /></Layout>
      </Route>
      <Route path="/missions">
        <Layout><Missions /></Layout>
      </Route>
      <Route path="/leaderboard">
        <Layout><Leaderboard /></Layout>
      </Route>
      <Route path="/profile">
        <Layout><Profile /></Layout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
        <Sonner theme="dark" position="top-center" richColors closeButton />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
