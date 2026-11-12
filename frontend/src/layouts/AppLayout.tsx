import { Outlet } from 'react-router'
import Footer from "../components/Footer";
import NavbarAuth from '../components/NavbarAuth';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

export default function AppLayout() {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
        return (<h1>Cargando...</h1>);
    } else {
        return (
            <div className="flex flex-col gap-2 h-dvh">
                {isAuthenticated ? <NavbarAuth /> : <Navbar />}
                <main className="grow w-full max-w-4xl m-auto">
                    <Outlet />
                </main>
                <Footer />
            </div>
        );
    }
}