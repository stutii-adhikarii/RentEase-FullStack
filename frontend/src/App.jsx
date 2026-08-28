import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ApartmentsPage from "./pages/ApartmentsPage";
import ApartmentDetailPage from "./pages/ApartmentDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FavouritesPage from "./pages/FavouritesPage";
import InquiriesPage from "./pages/InquiriesPage";
import ProfilePage from "./pages/ProfilePage";
import MyListingsPage from "./pages/MyListingsPage";
import ListingFormPage from "./pages/ListingFormPage";
import DashboardPage from "./pages/DashboardPage";
import "./index.css";
import "./App.css";

function RequireAuth({ children, role }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/apartments" element={<ApartmentsPage />} />
        <Route path="/apartments/:id" element={<ApartmentDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/favourites"
          element={
            <RequireAuth>
              <FavouritesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/inquiries"
          element={
            <RequireAuth>
              <InquiriesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth role="landlord">
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/my-listings"
          element={
            <RequireAuth role="landlord">
              <MyListingsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/listings/new"
          element={
            <RequireAuth role="landlord">
              <ListingFormPage />
            </RequireAuth>
          }
        />
        <Route
          path="/listings/:id/edit"
          element={
            <RequireAuth role="landlord">
              <ListingFormPage />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
