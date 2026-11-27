import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "react-toastify";
import { getJobApplications } from "../../api/job-posting";
import type { TJobApplicationWithCandidate } from "../../types/api.type";
import { formatDateTime } from "../../utils/format";
import { getApplicationStatusLabel, getApplicationStatusStyle } from "../../utils/job-application";
import PanelBreadcrumbs from "../../components/PanelBreadcrumbs";

export default function JobApplicationsPage() {
    const { id } = useParams();
    const jobId = Number(id);
    const [applications, setApplications] = useState<TJobApplicationWithCandidate[]>([]);
    const [jobTitle, setJobTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const load = useCallback(async (targetPage: number) => {
        if (!jobId) return;
        setLoading(true);
        try {
            const res = await getJobApplications(jobId, targetPage, 10);
            if (!res.success) {
                toast.error(res.message);
                return;
            }
            setApplications(res.data.applications);
            setJobTitle(res.data.jobPosting?.title || "");
            setTotalPages(res.data.totalPages || 1);
            setPage(res.data.currentPage || targetPage);
        } catch (err) {
            console.error(err);
            toast.error("Ocurrio un error al obtener los candidatos");
        } finally {
            setLoading(false);
        }
    }, [jobId]);

    useEffect(() => { load(1); }, [load]);

    return (
        <div className="py-8 px-4 space-y-6 max-w-6xl mx-auto">
            <PanelBreadcrumbs items={[{ label: "Panel", to: "/panel" }, { label: "Vacantes", to: "/panel/vacantes" }, { label: jobTitle || `Vacante #${jobId}`, to: `/panel/vacantes/${jobId}` }, { label: "Candidatos" }]} />
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Candidatos postulados</h2>
                <p className="text-gray-500 text-sm mt-1">{jobTitle || `Vacante #${jobId}`}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Cargando...</div>
                ) : applications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No hay candidatos postulados a esta vacante.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidato</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Correo</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Titular</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Estatus</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {applications.map((app) => (
                                    <tr key={app.id_job_application} className="hover:bg-gray-50/80">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {app.user?.name || 'Candidato'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.user?.email || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{app.user?.candidateProfile?.headline || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(app.createdAt)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${getApplicationStatusStyle(app.applicationStatus?.name)}`}>
                                                {getApplicationStatusLabel(app.applicationStatus?.name)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <Link to={`/panel/vacantes/${jobId}/candidatos/${app.id_job_application}`} className="font-medium text-blue-500 hover:text-blue-600 transition-colors">
                                                Ver detalle
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {totalPages > 0 && (
                <div className="flex items-center justify-center gap-2">
                    <button type="button" onClick={() => load(page - 1)} disabled={page === 1 || loading} className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">&lt;</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button key={p} type="button" onClick={() => load(p)} disabled={loading || p === page} className={`px-3 py-2 text-sm rounded-lg border cursor-pointer disabled:cursor-not-allowed ${p === page ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 hover:bg-gray-50"}`}>{p}</button>
                    ))}
                    <button type="button" onClick={() => load(page + 1)} disabled={page === totalPages || loading} className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">&gt;</button>
                </div>
            )}
        </div>
    );
}
