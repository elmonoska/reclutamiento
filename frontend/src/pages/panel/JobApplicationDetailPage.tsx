import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { getJobApplicationDetail, getJobApplicationResumeUrl, updateJobApplicationStatus } from "../../api/job-posting";
import type { TJobApplicationDetail } from "../../types/api.type";
import { formatDateTime } from "../../utils/format";
import { FINAL_APPLICATION_STATUSES, MANUAL_APPLICATION_STATUS_OPTIONS } from "../../constants/job-application";
import type { TApplicationStatus } from "../../types/job-application.type";
import { getApplicationStatusLabel, getApplicationStatusStyle } from "../../utils/job-application";
import PanelBreadcrumbs from "../../components/PanelBreadcrumbs";

export default function JobApplicationDetailPage() {
    const { id, applicationId } = useParams();
    const jobId = Number(id);
    const appId = Number(applicationId);
    const [application, setApplication] = useState<TJobApplicationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<TApplicationStatus>('in_review');
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        async function load() {
            const res = await getJobApplicationDetail(jobId, appId);
            if (!res.success) { toast.error(res.message); setLoading(false); return; }
            setApplication(res.data.application);
            const current = res.data.application.applicationStatus?.name as TApplicationStatus | undefined;
            setStatus(current === 'applied' ? 'in_review' : (current || 'in_review'));
            setLoading(false);
        }
        if (jobId && appId) load();
    }, [jobId, appId]);

    async function openResume() {
        const res = await getJobApplicationResumeUrl(jobId, appId);
        if (!res.success) { toast.error(res.message); return; }
        if (res.data.applicationStatus) {
            setApplication((prev) => prev ? { ...prev, applicationStatus: { ...(prev.applicationStatus || { id_cat_application_status: 0 }), name: res.data.applicationStatus! } } : prev);
            if (res.data.applicationStatus !== 'applied') setStatus(res.data.applicationStatus as TApplicationStatus);
        }
        window.open(res.data.url, '_blank', 'noopener,noreferrer');
    }

    async function handleUpdateStatus() {
        if (!application) return;
        const currentStatus = application.applicationStatus?.name;
        if (currentStatus === status) return;
        if (FINAL_APPLICATION_STATUSES.includes(status)) {
            const label = getApplicationStatusLabel(status);
            if (!window.confirm(`¿Confirmas cambiar el estatus a "${label}"?`)) return;
        }
        setUpdatingStatus(true);
        const res = await updateJobApplicationStatus(jobId, appId, status);
        setUpdatingStatus(false);
        if (!res.success) { toast.error(res.message); return; }
        setApplication((prev) => prev ? { ...prev, applicationStatus: res.data.application.applicationStatus } : prev);
        toast.success(res.message || 'Estatus actualizado');
    }

    if (loading) return <div className="p-8 text-gray-500">Cargando...</div>;
    if (!application) return <div className="p-8 text-gray-500">No se encontró la postulación.</div>;

    const user = application.user;
    const profile = user?.candidateProfile;
    const currentStatus = application.applicationStatus?.name;

    return (
        <div className="py-8 px-4 max-w-5xl mx-auto space-y-6">
            <PanelBreadcrumbs items={[{ label: "Panel", to: "/panel" }, { label: "Vacantes", to: "/panel/vacantes" }, { label: application.jobPosting?.title || `Vacante #${jobId}`, to: `/panel/vacantes/${jobId}` }, { label: "Candidatos", to: `/panel/vacantes/${jobId}/candidatos` }, { label: user?.name || "Detalle" }]} />

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{user?.name || 'Candidato'}</h1>
                        <p className="text-gray-500 mt-1">{profile?.headline || 'Sin titular profesional'}</p>
                        <p className="text-sm text-gray-500 mt-2">Postulado a: <span className="font-medium text-gray-700">{application.jobPosting?.title}</span> · {formatDateTime(application.createdAt)}</p>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${getApplicationStatusStyle(currentStatus)}`}>
                            {getApplicationStatusLabel(currentStatus)}
                        </span>
                        <div className="flex items-center gap-2">
                            <select value={status} onChange={(e) => setStatus(e.target.value as TApplicationStatus)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                                {MANUAL_APPLICATION_STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            <button type="button" onClick={handleUpdateStatus} disabled={updatingStatus || currentStatus === status} className="px-3 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                                {updatingStatus ? 'Guardando...' : 'Actualizar'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Info label="Correo" value={user?.email} />
                    <Info label="Teléfono" value={profile?.phone} />
                    <Info label="Estado" value={profile?.state?.name} />
                    <Info label="Nivel educativo" value={profile?.educationLevel?.name} />
                    <Info label="Experiencia" value={profile?.experienceLevel?.name} />
                    <Info label="Modalidad preferida" value={profile?.workModel?.name} />
                    <Info label="Expectativa salarial" value={profile?.expected_salary ? `$${profile.expected_salary.toLocaleString()}` : null} />
                </div>

                <div>
                    <p className="text-sm text-gray-500 mb-2">Resumen profesional</p>
                    <p className="text-gray-800 whitespace-pre-wrap">{profile?.summary || 'No especificado'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Info label="LinkedIn" value={profile?.linkedin_url} link />
                    <Info label="GitHub" value={profile?.github_url} link />
                    <Info label="Portafolio" value={profile?.portfolio_url} link />
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">CV usado en esta postulación</p>
                    {application.resume_snapshot_path ? (
                        <button type="button" onClick={openResume} className="text-sm font-semibold text-blue-500 hover:text-blue-600 cursor-pointer">Ver CV</button>
                    ) : (
                        <p className="text-sm text-gray-500">No disponible</p>
                    )}
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
                <p className="font-medium text-gray-900 wrap-break-word">{value || 'No especificado'}</p>
            )}
        </div>
    );
}
