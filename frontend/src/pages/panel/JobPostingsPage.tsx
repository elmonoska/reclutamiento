import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { deleteJobPosting, getJobPostings } from "../../api/job-posting";
import type { TJobPosting } from "../../types/api.type";
import { formatDateTime } from "../../utils/format";

export default function JobPostingsPage() {
    const [jobPostings, setJobPostings] = useState<TJobPosting[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(search.trim()), 1500);
        return () => clearTimeout(timeout);
    }, [search]);

    const loadJobPostings = useCallback(async (targetPage: number) => {
        setIsLoading(true);
        try {
            const res = await getJobPostings(targetPage, limit, { search: debouncedSearch, status });
            if (!res.success) {
                toast.error(res.message);
                return;
            }
            setJobPostings(res.data.jobPostings);
            setTotalPages(res.data.totalPages || 1);
            setPage(res.data.currentPage || targetPage);
        } catch (err) {
            console.error(err);
            toast.error("Ocurrio un error al obtener las vacantes");
        } finally {
            setIsLoading(false);
        }
    }, [limit, debouncedSearch, status]);

    useEffect(() => {
        loadJobPostings(1);
    }, [loadJobPostings]);

    const handleDelete = async (id: number) => {
        const res = await deleteJobPosting(id);
        if (!res.success) {
            toast.error(res.message);
            return;
        }
        toast.success(res.message);
        const nextPage = jobPostings.length === 1 && page > 1 ? page - 1 : page;
        await loadJobPostings(nextPage);
    };

    return (
        <div className="py-8 px-4 space-y-6 max-w-6xl mx-auto">
            <Link to="/panel" className="inline-block text-sm font-medium text-orange-600 hover:text-orange-700 transition">
                &larr; Volver al panel
            </Link>

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Vacantes</h2>
                    <p className="text-gray-500 text-sm mt-1">Listado de vacantes registradas</p>
                </div>
                <Link
                    to="/panel/vacantes/crear"
                    className="inline-flex items-center gap-2 text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-5 rounded-lg transition duration-200 shadow-sm cursor-pointer"
                >
                    + Crear vacante
                </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Buscar por título</label>
                        <input
                            id="search"
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Ej. Desarrollador Frontend"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Estatus</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white"
                        >
                            <option value="">Todos</option>
                            <option value="published">Publicadas</option>
                            <option value="closed">Cerradas</option>
                            <option value="deleted">Eliminadas</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">Registros por página</label>
                        <select
                            id="limit"
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white"
                        >
                            {[10, 20, 30, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Cargando...</div>
                ) : jobPostings.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No se encontraron vacantes.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Título</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Estatus</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Creada</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {jobPostings.map((job) => {
                                    const isDeleted = !!job.deletedAt;
                                    const statusStyles = isDeleted
                                        ? "bg-red-50 text-red-600 border-red-100"
                                        : job.status === "published"
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-amber-50 text-amber-700 border-amber-200";
                                    const statusLabel = isDeleted ? "Eliminada" : job.status === "published" ? "Publicada" : "Cerrada";

                                    return (
                                        <tr key={job.id_job_posting} className={`transition-colors ${isDeleted ? "bg-gray-50/60 text-gray-400" : "hover:bg-gray-50/80"}`}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.id_job_posting}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link
                                                    to={`/panel/vacantes/${job.id_job_posting}`}
                                                    className={isDeleted ? "text-gray-500 hover:text-orange-600 transition-colors" : "text-gray-900 hover:text-orange-600 transition-colors"}
                                                >
                                                    {job.title}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium border min-w-24 ${statusStyles}`}>
                                                    {statusLabel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(job.createdAt)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(job.id_job_posting)}
                                                    disabled={isDeleted}
                                                    className="inline-flex items-center justify-center p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                                    aria-label={`Eliminar vacante ${job.title}`}
                                                    title="Eliminar"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        type="button"
                        onClick={() => loadJobPostings(page - 1)}
                        disabled={page === 1 || isLoading}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        &lt;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => loadJobPostings(p)}
                            disabled={isLoading}
                            className={`px-3 py-2 text-sm rounded-lg border cursor-pointer disabled:cursor-not-allowed ${p === page ? "bg-orange-500 text-white border-orange-500" : "border-gray-300 hover:bg-gray-50"}`}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => loadJobPostings(page + 1)}
                        disabled={page === totalPages || isLoading}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        &gt;
                    </button>
                </div>
            )}
        </div>
    );
}
