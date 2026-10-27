import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ExperienceProvider from '@/components/globest/ExperienceProvider';
import MobileSplash from '@/components/globest/MobileSplash';
import GlobestLayout from '@/components/globest/GlobestLayout';
import Mall from '@/pages/Mall';
import Garden from '@/pages/Garden';
import Live from '@/pages/Live';
import FeedRoute from '@/pages/FeedRoute';
import AccessNotice from '@/components/globest/AccessNotice';
import CRM from '@/pages/CRM';
import Assistant from '@/pages/Assistant';
import Partner from '@/pages/Partner';
import Discover from '@/pages/Discover';
import Messages from '@/pages/Messages';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import ProtectedRoute from '@/components/ProtectedRoute';
import Promotion from '@/pages/Promotion';
import Agency from '@/pages/Agency';
import HbhErp from '@/pages/HbhErp';
import AllianceAdmin from '@/pages/AllianceAdmin';
import BrandGuide from '@/pages/BrandGuide';
import JoinHub from '@/pages/JoinHub';
import JiuZhenTang from '@/pages/JiuZhenTang';
import SellerCenter from '@/pages/SellerCenter';
import Assets from '@/pages/Assets';
import MeHub from '@/pages/MeHub';
import Events from '@/pages/Events';
import Venues from '@/pages/Venues';
import Tickets from '@/pages/Tickets';
import Orders from '@/pages/Orders';
import Addresses from '@/pages/Addresses';
import BankCards from '@/pages/BankCards';
import Help from '@/pages/Help';
import Verify from '@/pages/Verify';
import Coupons from '@/pages/Coupons';
import PointsMall from '@/pages/PointsMall';
import Rewards from '@/pages/Rewards';
import RetirementClub from '@/pages/RetirementClub';
import Stores from '@/pages/Stores';
import HerbTea from '@/pages/HerbTea';
import Dealer from '@/pages/Dealer';
import DealerReview from '@/pages/DealerReview';
import Earnings from '@/pages/Earnings';
import WithdrawReview from '@/pages/WithdrawReview';
import More from '@/pages/More';
import DealerLevels from '@/pages/DealerLevels';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<ExperienceProvider><GlobestLayout /></ExperienceProvider>}>
        <Route path="/" element={<Mall />} />
        <Route path="/more" element={<More />} />
        <Route path="/game" element={<Garden />} />
        <Route path="/live" element={<Live />} />
        <Route path="/feed" element={<FeedRoute />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/promotion/:id" element={<Promotion />} />
        <Route path="/crm" element={<CRM />} />
        <Route path="/agency" element={<Agency />} />
        <Route path="/dealer-levels/:level?" element={<DealerLevels />} />
        <Route path="/join" element={<JoinHub />} />
        <Route path="/brand" element={<BrandGuide />} />
        <Route path="/jiuzhentang" element={<JiuZhenTang />} />
        <Route path="/seller" element={<SellerCenter />} />
        <Route path="/hbh-erp" element={<HbhErp />} />
        <Route path="/me" element={<MeHub />} />
        <Route path="/events" element={<Events />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/addresses" element={<Addresses />} />
        <Route path="/bank-cards" element={<BankCards />} />
        <Route path="/help" element={<Help />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/points-mall" element={<PointsMall />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/retirement-club" element={<RetirementClub />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/herb-tea" element={<HerbTea />} />
        <Route path="/dealer" element={<Dealer />} />
        <Route path="/dealer-review" element={<DealerReview />} />
        <Route path="/earnings" element={<Earnings />} />
        <Route path="/withdraw-review" element={<WithdrawReview />} />
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login?returnTo=%2Fassistant" replace />} />}>
          <Route path="/assistant" element={<Assistant />} />
        </Route>
        <Route element={<ProtectedRoute unauthenticatedElement={<AccessNotice title="登录后查看资产" returnTo="/assets" />} />}>
          <Route path="/assets" element={<Assets />} />
        </Route>
        <Route element={<ProtectedRoute unauthenticatedElement={<AccessNotice title="登录后进入代理商工作台" returnTo="/partner" />} />}>
          <Route path="/partner" element={<Partner />} />
        </Route>
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login?returnTo=%2Falliance-admin" replace />} />}>
          <Route path="/alliance-admin" element={<AllianceAdmin />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <MobileSplash><AuthenticatedApp /></MobileSplash>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App