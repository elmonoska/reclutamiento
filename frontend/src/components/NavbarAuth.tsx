import { Link, useNavigate } from "react-router";
import { APP_NAME } from "../constants";
import { toast } from "react-toastify";
import { logout } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";

export default function NavbarAuth() {
    const navigate = useNavigate();
    const { checkAuth } = useAuth();

    async function closeSession() {
        const res = await logout();
        if (!res.success) {
            toast.error(res.message);
            return;
        }

        await checkAuth();
        toast.success(res.message);
        navigate('/auth/iniciar-sesion');
    }

    return (
        <nav className="bg-white border-b border-gray-300">
            <div className="w-full md:max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-2">
                <div>
                    <Link to="/" className="text-3xl font-bold text-gray-900">{APP_NAME}</Link>
                </div>

                <div className="flex items-center gap-4">
                    <ul className="flex items-center gap-4">
                        <Link to="/panel">Panel</Link>
                        <button type="button" className="cursor-pointer" onClick={closeSession}>Cerrar sesion</button>
                    </ul>
                </div>
            </div>
        </nav>
    )
}