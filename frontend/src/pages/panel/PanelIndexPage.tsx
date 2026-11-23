import { useEffect, useState } from "react";
import { Link } from "react-router"; 
import { getLastJobPostings } from "../../api/job-posting";
import type { TJobPosting } from "../../types/api.type";
import { formatCurrency, formatDateTime } from "../../utils/format";
import { toast } from "react-toastify";

export default function PanelIndexPage() {
    const [lastJobPostings, setLastJobPostings] = useState<TJobPosting[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadLastJobPosting() {
            const res = await getLastJobPostings();
            try {
                if (!res.success) toast.error(res.message);
                if (res.success) {
                    setLastJobPostings(res.data.lastJobPostings);
                }   
            } catch (err) {
                console.error(err);
                toast.error(res.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadLastJobPosting();
    }, []);

    if (isLoading) return <p>Cargando...</p>

    return (
        <div className="py-8 px-4 space-y-8 max-w-5xl mx-auto">
            <section className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Panel de control</h2>
                    <p className="text-gray-500 text-sm mt-1">Gestiona tus publicaciones de reclutamiento</p>
                </div>
                <Link
                    to="/panel/vacantes/crear"
                    className="inline-flex items-center gap-2 text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-5 rounded-lg transition duration-200 shadow-sm cursor-pointer"
                >
                    + Crear vacante
                </Link>
            </section>

            <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-gray-900">Últimas publicadas</h3>
                    <Link to="/panel/vacantes" className="text-sm font-medium text-orange-600 hover:text-orange-700 transition">
                        Ver todas &rarr;
                    </Link>
                </div>
                
                {lastJobPostings.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">Aún no hay vacantes publicadas.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {lastJobPostings.map((job) => {
                            const statusStyles = job?.status === "published"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-gray-100 text-gray-700 border-gray-200";
                                return (
                                    <li key={job.id_job_posting} className="group flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 hover:bg-gray-50/80 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col gap-0.5">
                                                <Link 
                                                    to={`/panel/vacantes/${job.id_job_posting}`} 
                                                    className="font-semibold text-gray-900 hover:text-orange-600 transition-colors text-base"
                                                >
                                                    <span className="text-gray-400 font-normal mr-2">#{job.id_job_posting}</span>
                                                    {job.title}
                                                </Link>
                                                
                                                <div className="text-sm text-gray-500 flex items-center flex-wrap gap-x-2">
                                                    <span>{formatDateTime(job.createdAt)}</span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="font-medium text-gray-600">
                                                        {job.salary_min && job.salary_max 
                                                            ? `${formatCurrency(job.salary_min)} - ${formatCurrency(job.salary_max)}` 
                                                            : 'Sueldo a convenir'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-3 sm:mt-0 shrink-0">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border capitalize ${statusStyles}`}>
                                                {job.status === "published" ? "Publicada" : "Cerrada"}
                                            </span>
                                        </div>
                                    </li>
                                )
                            })}
                    </ul>
                )}
            </section>
        </div>
    )
}