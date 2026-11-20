import { BrowserRouter, Route, Routes } from "react-router"
import AuthLayout from "./layouts/AuthLayout"
import LoginPage from "./pages/auth/LoginPage"
import SignupPage from "./pages/auth/SignupPage"
import ConfirmAccountPage from "./pages/auth/ConfirmAccountPage"
import AppLayout from "./layouts/AppLayout"
import AppIndexPage from "./pages/AppIndexPage"
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"
import AccountLayout from "./layouts/AccountLayout"
import PanelIndexPage from "./pages/panel/PanelIndexPage"
import CreateJobPostingPage from "./pages/panel/CreateJobPostingPage"
import JobPostingDetailsPage from "./pages/panel/JobPostingDetailsPage"
import EditJobPostingPage from "./pages/panel/EditJobPostingPage"
import JobPostingPage from "./pages/panel/JobPostingsPage"

export default function AppRouter() {

  return (
    <BrowserRouter>
      <Routes>
        {/* modulo de autenticacion */}
        <Route path="auth" element={<AuthLayout />}>
          <Route path="iniciar-sesion" element={<LoginPage />} />
          <Route path="crear-cuenta" element={<SignupPage />} />
          <Route path="confirmar-cuenta/:uuidUser" element={<ConfirmAccountPage />} />
          <Route path="olvide-contrasena" element={<ForgotPasswordPage />} />
          <Route path="restablecer-contrasena/:uuidUser" element={<ResetPasswordPage />} />
        </Route>

        {/* postulaciones publicas */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<AppIndexPage />} />
        </Route>

        {/* administracion de vacantes */}
        <Route path="panel" element={<AccountLayout />}>
          <Route index element={<PanelIndexPage />} />
          <Route path="vacantes/crear" element={<CreateJobPostingPage />} />
          <Route path="vacantes/:id" element={<JobPostingDetailsPage />} />
          <Route path="vacantes/:id/editar" element={<EditJobPostingPage />} />
          <Route path="vacantes/" element={<JobPostingPage />} />
        </Route>

      </Routes>


    </BrowserRouter>
  )
}
