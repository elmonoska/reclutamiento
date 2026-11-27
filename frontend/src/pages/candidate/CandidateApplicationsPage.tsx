import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMyApplications } from "../../api/candidate";
import type { TCandidateJobApplication } from "../../types/api.type";
import { formatDateTime, formatSalaryRange } from "../../utils/format";
import { getApplicationStatusLabel, getApplicationStatusStyle } from "../../utils/job-application";

export default function CandidateApplicationsPage() {
    const [applications, setApplications] = useState<TCandidateJobApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadApplications = useCallback(async (targetPage: number) => {
        setLoading(true);
        try {
            const res = await getMyApplications(targetPage, 10);
            if (!res.success) {
                toast.error(res.message);
                return;
            }
            setApplications(res.data.applications);
            setTotalPages(res.data.totalPages || 1);
            setPage(res.data.currentPage || targetPage);
        } catch (err) {
            console.error(err);
            toast.error("Ocurrio un error al obtener tus postulaciones");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadApplications(1);
    }, [loadApplications]);

    if (loading) return <div className="p-8 text-gray-500">Cargando...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Mis postulaciones</h1>
                <p className="text-gray-500 mt-1">Vacantes a las que te has postulado</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {applications.length === 0 ? (
                    <div className="p-8 text-gray-500">Aún no te has postulado a ninguna vacante.</div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {applications.map((app) => {
                            const statusName = app.applicationStatus?.name || "applied";
                            const job = app.jobPosting;
                            return (
                                <li key={app.id_job_application} className="p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-1">
                                            <p className="font-semibold text-gray-900">{job?.title || `Vacante #${app.id_job_posting}`}</p>
                                            <div className="text-sm text-gray-600 flex flex-wrap gap-x-3 gap-y-1">
                                                {job?.state?.name && <span>{job.state.name}</span>}
                                                {job?.workModel?.name && <span>{job.workModel.name}</span>}
                                                <span>{formatSalaryRange(job?.salary_min, job?.salary_max)}</span>
                                            </div>
                                            <p className="text-xs text-gray-500">Postulado: {formatDateTime(app.createdAt)}</p>
                                        </div>
                                        <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${getApplicationStatusStyle(statusName)}`}>
                                            {getApplicationStatusLabel(statusName)}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {totalPages > 0 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        type="button"
                        onClick={() => loadApplications(page - 1)}
                        disabled={page === 1 || loading}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        &lt;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => loadApplications(p)}
                            disabled={loading || p === page}
                            className={`px-3 py-2 text-sm rounded-lg border cursor-pointer disabled:cursor-not-allowed ${p === page ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 hover:bg-gray-50"}`}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => loadApplications(page + 1)}
                        disabled={page === totalPages || loading}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        &gt;
                    </button>
                </div>
            )}
        </div>
    );
}
