import { BrowserRouter, Route, Routes } from "react-router"
import AuthLayout from "./layouts/AuthLayout"
import AuthenticatedLayout from "./layouts/AuthenticatedLayout"
import LoginPage from "./pages/auth/LoginPage"
import SignupPage from "./pages/auth/SignupPage"
import CandidateSignupPage from "./pages/auth/CandidateSignupPage"
import ConfirmAccountPage from "./pages/auth/ConfirmAccountPage"
import AppLayout from "./layouts/AppLayout"
import AppIndexPage from "./pages/AppIndexPage"
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"
import AccountLayout from "./layouts/AccountLayout"
import CandidateLayout from "./layouts/CandidateLayout"
import PanelIndexPage from "./pages/panel/PanelIndexPage"
import CreateJobPostingPage from "./pages/panel/CreateJobPostingPage"
import JobPostingDetailsPage from "./pages/panel/JobPostingDetailsPage"
import EditJobPostingPage from "./pages/panel/EditJobPostingPage"
import JobApplicationsPage from "./pages/panel/JobApplicationsPage"
import JobApplicationDetailPage from "./pages/panel/JobApplicationDetailPage"
import CandidateIndexPage from "./pages/candidate/CandidateIndexPage"
import CompleteProfilePage from "./pages/candidate/CompleteProfilePage"
import EditCandidateProfilePage from "./pages/candidate/EditCandidateProfilePage"
import CandidateApplicationsPage from "./pages/candidate/CandidateApplicationsPage"
import JobPostingsPage from "./pages/panel/JobPostingsPage"
import AccountSettingsPage from "./pages/account/AccountSettingsPage"
import ChangePasswordPage from "./pages/account/ChangePasswordPage"

export default function AppRouter() {

  return (
    <BrowserRouter>
      <Routes>
        {/* modulo de autenticacion */}
        <Route path="auth" element={<AuthLayout />}>
          <Route path="iniciar-sesion" element={<LoginPage />} />
          <Route path="crear-cuenta" element={<SignupPage />} />
          <Route path="registro-candidato" element={<CandidateSignupPage />} />
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
          <Route path="cuenta" element={<AccountSettingsPage />} />
          <Route path="cambiar-contrasena" element={<ChangePasswordPage />} />
          <Route path="vacantes/crear" element={<CreateJobPostingPage />} />
          <Route path="vacantes/:id" element={<JobPostingDetailsPage />} />
          <Route path="vacantes/:id/editar" element={<EditJobPostingPage />} />
          <Route path="vacantes/:id/candidatos" element={<JobApplicationsPage />} />
          <Route path="vacantes/:id/candidatos/:applicationId" element={<JobApplicationDetailPage />} />
          <Route path="vacantes/" element={<JobPostingsPage />} />
        </Route>

        {/* cuenta - acceso directo desde correo */}
        <Route path="cuenta" element={<AuthenticatedLayout />}>
          <Route path="cambiar-contrasena" element={<ChangePasswordPage />} />
        </Route>

        {/* candidato */}
        <Route path="candidato" element={<CandidateLayout />}>
          <Route index element={<CandidateIndexPage />} />
          <Route path="cuenta" element={<AccountSettingsPage />} />
          <Route path="cambiar-contrasena" element={<ChangePasswordPage />} />
          <Route path="mis-postulaciones" element={<CandidateApplicationsPage />} />
          <Route path="completar-perfil" element={<CompleteProfilePage />} />
          <Route path=":id/editar" element={<EditCandidateProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
