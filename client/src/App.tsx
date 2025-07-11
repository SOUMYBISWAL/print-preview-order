import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Route, Switch } from "wouter";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import PrintSettings from "./pages/PrintSettings";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Cart from "./pages/Cart";
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import Login from "./pages/Login";
import TrackOrder from "./pages/TrackOrder";
import Account from "./pages/Account";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Contact from "./pages/Contact";
import RefundPolicy from "./pages/RefundPolicy";
import Pricing from "./pages/Pricing";



const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/upload" component={Upload} />
        <Route path="/print-settings" component={PrintSettings} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/order-confirmation" component={OrderConfirmation} />
        <Route path="/cart" component={Cart} />
        <Route path="/login" component={Login} />
        <Route path="/track-order" component={TrackOrder} />
        <Route path="/account" component={Account} />
        <Route path="/admin" component={Admin} />
        <Route path="/faq" component={FAQ} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/about" component={About} />
        <Route path="/contact-us" component={Contact} />
        <Route path="/refund-policy" component={RefundPolicy} />
        <Route path="/pricing" component={Pricing} />
        <Route component={NotFound} />
      </Switch>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;