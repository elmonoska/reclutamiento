import { Navigate, Outlet } from 'react-router'
import Footer from "../components/Footer";
import NavbarAuth from '../components/NavbarAuth';
import { useAuth } from '../contexts/AuthContext';

export default function AccountLayout() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (<h1>Cargando...</h1>);
    }
    
    if (isAuthenticated) {
        return (
            <div className="flex flex-col gap-2 h-dvh">
                <NavbarAuth />
                <main className="grow w-full max-w-4xl m-auto">
                    <Outlet />
                </main>
                <Footer />
            </div>
        )
    } else {
        return <Navigate to="/auth/iniciar-sesion" />
    }
}