import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import Dashboard from "pages/dashboard";
import AddEditStudent from "pages/add-edit-student";
import InvoicesManagement from "pages/invoices-management";
import CreateInvoice from "pages/create-invoice";
import BulkStudentImport from "pages/bulk-student-import";
import StudentsManagement from "pages/students-management";
import PaymentsManagement from "pages/payments-management";
import ReportsCenter from "pages/reports-center";
import PaymentStructureManagement from "pages/payment-structure-management";
import SchoolRegistration from "pages/school-registration";
import SchoolLogin from "pages/school-login";
import OnboardingWizard from "pages/onboarding-wizard";
import OwnerInformation from "pages/owner-information";
import ForgotPassword from "pages/ForgotPassword";
import LogOut from "pages/log-out";
import Settings from "pages/settings";
import InvoiceSettings from "pages/invoice-settings";
import MyProfile from "pages/my-profile";
import Wallet from "pages/wallet";
import TransferWallet from "pages/transfer-wallet";
import ProtectedRoute from "components/ProtectedRoute";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your routes here */}
          <Route path="/" element={<SchoolLogin />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/add-edit-student" element={<AddEditStudent />} />
          <Route path="/invoices-management" element={<InvoicesManagement />} />
          <Route path="/create-invoice" element={<CreateInvoice />} />
          <Route path="/bulk-student-import" element={<BulkStudentImport />} />
          <Route path="/students-management" element={<StudentsManagement />} />
          <Route path="/payments-management" element={<PaymentsManagement />} />
          <Route path="/reports-center" element={<ReportsCenter />} />
          <Route path="/payment-structure-management" element={<PaymentStructureManagement />} />
          <Route path="/school-registration" element={<SchoolRegistration />} />
          <Route path="/school-login" element={<SchoolLogin />} />
          <Route path="/school-onboarding" element={<OnboardingWizard />} />
          <Route path="/owner-information" element={<OwnerInformation />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/log-out" element={<LogOut />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/invoice-settings" element={<InvoiceSettings />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/transfer-wallet" element={<TransferWallet />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;