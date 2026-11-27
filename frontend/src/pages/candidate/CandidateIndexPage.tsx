import { Link } from "react-router";
import { toast } from "react-toastify";
import { getMyResumeUrl } from "../../api/candidate";
import { useAuth } from "../../contexts/AuthContext";
import { useCandidateProfile } from "../../contexts/CandidateProfileContext";

export default function CandidateIndexPage() {
    const { user } = useAuth();
    const { profileData } = useCandidateProfile();

    async function openResume() {
        const res = await getMyResumeUrl();
        if (!res.success) { toast.error(res.message); return; }
        window.open(res.data.url, '_blank', 'noopener,noreferrer');
    }

    if (!profileData?.profile) return <div className="p-8 text-gray-500">Cargando...</div>;
    const p = profileData.profile;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mi perfil</h1>
                    <p className="text-gray-500 mt-1">Bienvenido, {user?.name}</p>
                </div>
                <Link to={`/candidato/${user?.id_user}/editar`} className="px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition">Editar perfil</Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">{p.headline}</h2>
                    <p className="text-gray-600 mt-2 whitespace-pre-wrap">{p.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Info label="Teléfono" value={p.phone} />
                    <Info label="Estado" value={p.state?.name} />
                    <Info label="Nivel educativo" value={p.educationLevel?.name} />
                    <Info label="Experiencia" value={p.experienceLevel?.name} />
                    <Info label="Modalidad preferida" value={p.workModel?.name} />
                    <Info label="Expectativa salarial" value={p.expected_salary ? `$${p.expected_salary.toLocaleString()}` : 'No especificada'} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Info label="LinkedIn" value={p.linkedin_url} link />
                    <Info label="GitHub" value={p.github_url} link />
                    <Info label="Portafolio" value={p.portfolio_url} link />
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Currículum</p>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-700">{profileData.resume?.original_name || 'CV cargado'}</span>
                        <button type="button" onClick={openResume} className="text-sm font-semibold text-blue-500 hover:text-blue-600 cursor-pointer">Ver CV</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Info({ label, value, link }: { label: string; value?: string | null; link?: boolean }) {
    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            {link && value ? (
                <a href={value} target="_blank" rel="noreferrer" className="font-medium text-blue-500 hover:text-blue-600 break-all">{value}</a>
            ) : (
                <p className="font-medium text-gray-900 wrap wrap-break-word">{value || 'No especificado'}</p>
            )}
        </div>
    );
}
