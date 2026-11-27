import { Navigate, Outlet, useLocation } from 'react-router'
import Footer from "../components/Footer";
import NavbarAuth from '../components/NavbarAuth';
import { useAuth } from '../contexts/AuthContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getMyCandidateProfile } from '../api/candidate';
import { CandidateProfileContext } from '../contexts/CandidateProfileContext';
import type { TApiResponseCandidateProfile } from '../types/api.type';

let lastFetchedUserId: number | null = null;
let lastProfileData: TApiResponseCandidateProfile | null = null;

export default function CandidateLayout() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();
    const [profileData, setProfileData] = useState<TApiResponseCandidateProfile | null>(
        user?.id_user && lastFetchedUserId === user.id_user ? lastProfileData : null
    );
    const [checkingProfile, setCheckingProfile] = useState(!(user?.id_user && lastFetchedUserId === user.id_user));
    const inFlight = useRef<Promise<void> | null>(null);

    const refreshProfile = useCallback(async () => {
        if (!user?.id_user) return;
        const res = await getMyCandidateProfile();
        if (res.success) {
            lastFetchedUserId = user.id_user;
            lastProfileData = res.data;
            setProfileData(res.data);
        }
    }, [user?.id_user]);

    useEffect(() => {
        let active = true;
        async function check() {
            if (!isAuthenticated || user?.role?.name !== 'candidate') {
                lastFetchedUserId = null;
                lastProfileData = null;
                if (active) { setCheckingProfile(false); setProfileData(null); }
                return;
            }
            if (lastFetchedUserId === user.id_user && lastProfileData) {
                if (active) { setProfileData(lastProfileData); setCheckingProfile(false); }
                return;
            }
            if (inFlight.current) {
                await inFlight.current;
                if (active) { setProfileData(lastProfileData); setCheckingProfile(false); }
                return;
            }
            setCheckingProfile(true);
            const req = (async () => {
                const res = await getMyCandidateProfile();
                if (res.success) {
                    lastFetchedUserId = user.id_user;
                    lastProfileData = res.data;
                }
            })();
            inFlight.current = req;
            try {
                await req;
            } finally {
                if (inFlight.current === req) inFlight.current = null;
            }
            if (active) { setProfileData(lastProfileData); setCheckingProfile(false); }
        }
        check();
        return () => { active = false; };
    }, [isAuthenticated, user?.id_user, user?.role?.name]);

    if (isLoading || checkingProfile) {
        return (<h1>Cargando...</h1>);
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/iniciar-sesion" />
    }

    if (user?.role?.name !== 'candidate') {
        return <Navigate to="/panel" />
    }

    // ! VERIFICAR VALIDACIONES DE URL
    const profileComplete = !!profileData?.profileComplete;
    const onCompleteProfile = location.pathname === '/candidato/completar-perfil';
    const onEditProfile = /^\/candidato\/\d+\/editar$/.test(location.pathname);
    const onApplications = location.pathname === '/candidato/mis-postulaciones';

    if (!profileComplete && !onCompleteProfile) {
        return <Navigate to="/candidato/completar-perfil" replace />
    }
    if (!profileComplete && (onEditProfile || onApplications)) {
        return <Navigate to="/candidato/completar-perfil" replace />
    }

    return (
        <CandidateProfileContext.Provider value={{ profileData, refreshProfile }}>
            <div className="flex flex-col gap-2 h-dvh">
                <NavbarAuth />
                <main className="grow w-full max-w-4xl m-auto">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </CandidateProfileContext.Provider>
    )
}
