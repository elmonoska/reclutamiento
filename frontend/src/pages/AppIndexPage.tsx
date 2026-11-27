import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getPublicCatalogs, getPublicJobPostings } from "../api/job-posting";
import { applyToJob, getMyApplicationByJob } from "../api/candidate";
import { useAuth } from "../contexts/AuthContext";
import type { TApiResponseCatalogs, TJobPosting } from "../types/api.type";
import { formatDateTime, formatSalaryRange } from "../utils/format";
import { EMPTY_CATALOGS } from "../constants/catalog";
import { getCatalogName } from "../utils/catalog";

export default function AppIndexPage() {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [jobPostings, setJobPostings] = useState<TJobPosting[]>([]);
    const [catalogs, setCatalogs] = useState<TApiResponseCatalogs>(EMPTY_CATALOGS);
    const [selectedJob, setSelectedJob] = useState<TJobPosting | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [idEmploymentType, setIdEmploymentType] = useState<number | "">("");
    const [idState, setIdState] = useState<number | "">("");
    const [idWorkModel, setIdWorkModel] = useState<number | "">("");
    const [idJobCategory, setIdJobCategory] = useState<number | "">("");
    const [hasApplied, setHasApplied] = useState(false);
    const [checkingApplication, setCheckingApplication] = useState(false);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(search.trim()), 1500);
        return () => clearTimeout(timeout);
    }, [search]);

    useEffect(() => {
        async function loadCatalogs() {
            const res = await getPublicCatalogs();
            if (res.success) setCatalogs(res.data);
        }
        loadCatalogs();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, idEmploymentType, idState, idWorkModel, idJobCategory]);

    useEffect(() => {
        async function loadJobPostings() {
            setIsLoading(true);
            try {
                const res = await getPublicJobPostings(page, {
                    search: debouncedSearch,
                    id_employment_type: idEmploymentType,
                    id_state: idState,
                    id_work_model: idWorkModel,
                    id_job_category: idJobCategory,
                });
                if (!res.success) {
                    toast.error(res.message);
                    return;
                }
                setJobPostings(res.data.jobPostings);
                setTotalPages(res.data.totalPages || 1);
                setSelectedJob((current) => {
                    const jobs = res.data.jobPostings;
                    if (jobs.length === 0) return null;
                    if (current && jobs.some((j) => j.id_job_posting === current.id_job_posting)) return current;
                    return jobs[0];
                });
            } catch (err) {
                console.error(err);
                toast.error("Ocurrio un error al obtener las vacantes");
            } finally {
                setIsLoading(false);
            }
        }
        loadJobPostings();
    }, [page, debouncedSearch, idEmploymentType, idState, idWorkModel, idJobCategory]);

    useEffect(() => {
        let active = true;
        async function check() {
            if (!selectedJob || !isAuthenticated || user?.role?.name !== 'candidate') {
                if (active) { setHasApplied(false); setCheckingApplication(false); }
                return;
            }
            setCheckingApplication(true);
            const res = await getMyApplicationByJob(selectedJob.id_job_posting);
            if (active) {
                setHasApplied(res.success && !!res.data.application);
                setCheckingApplication(false);
            }
        }
        check();
        return () => { active = false; };
    }, [selectedJob?.id_job_posting, isAuthenticated, user?.role?.name]);

    async function handleApply() {
        if (!selectedJob) return;
        if (!isAuthenticated) {
            navigate('/auth/iniciar-sesion');
            return;
        }
        if (user?.role?.name !== 'candidate') {
            toast.info('Solo los candidatos pueden postularse');
            return;
        }
        setApplying(true);
        const res = await applyToJob(selectedJob.id_job_posting);
        setApplying(false);
        if (!res.success) {
            toast.error(res.message);
            if (res.message.toLowerCase().includes('completar tu perfil')) {
                navigate('/candidato/completar-perfil');
            }
            if (res.message.toLowerCase().includes('ya te has postulado')) {
                setHasApplied(true);
            }
            return;
        }
        setHasApplied(true);
        toast.success(res.message);
    }

    const salaryLabel = useMemo(() => {
        return formatSalaryRange(selectedJob?.salary_min, selectedJob?.salary_max);
    }, [selectedJob]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Explora nuestras oportunidades</h1>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6 space-y-4">
                {/* buscar por título */}
                <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Buscar por título</label>
                    <input
                        id="search"
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Ej. Desarrollador"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* área / categoría */}
                    <div>
                        <label htmlFor="jobCategory" className="block text-sm font-medium text-gray-700 mb-1">Área / categoría</label>
                        <select id="jobCategory" value={idJobCategory} onChange={(e) => setIdJobCategory(e.target.value ? Number(e.target.value) : "")} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white">
                            <option value="">Todas</option>
                            {catalogs.jobCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    {/* tipo de empleo */}
                    <div>
                        <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">Tipo de empleo</label>
                        <select id="employmentType" value={idEmploymentType} onChange={(e) => setIdEmploymentType(e.target.value ? Number(e.target.value) : "")} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white">
                            <option value="">Todos</option>
                            {catalogs.employmentTypes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    {/* estado */}
                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                        <select id="state" value={idState} onChange={(e) => setIdState(e.target.value ? Number(e.target.value) : "")} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white">
                            <option value="">Todos</option>
                            {catalogs.states.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    {/* modalidad */}
                    <div>
                        <label htmlFor="workModel" className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
                        <select id="workModel" value={idWorkModel} onChange={(e) => setIdWorkModel(e.target.value ? Number(e.target.value) : "")} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white">
                            <option value="">Todos</option>
                            {catalogs.workModels.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        {isLoading ? (
                            <div className="p-6 text-gray-500">Cargando vacantes...</div>
                        ) : jobPostings.length === 0 ? (
                            <div className="p-6 text-gray-500">No hay vacantes publicadas.</div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {jobPostings.map((job) => {
                                    const selected = selectedJob?.id_job_posting === job.id_job_posting;
                                    return (
                                        <li key={job.id_job_posting}>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedJob(job)}
                                                className={`w-full text-left px-5 py-4 transition-colors cursor-pointer ${selected ? "bg-blue-50 border-l-4 border-blue-500" : "hover:bg-gray-50 border-l-4 border-transparent"}`}
                                            >
                                                <p className={`font-semibold ${selected ? "text-blue-700" : "text-gray-900"}`}>{job.title}</p>
                                                <div className="text-xs text-gray-600 mt-2 space-y-0.5 font-medium">
                                                    <p>{getCatalogName(catalogs.employmentTypes, job.id_employment_type)}</p>
                                                    <p>{getCatalogName(catalogs.states, job.id_state)}</p>
                                                    <p>{getCatalogName(catalogs.workModels, job.id_work_model)}</p>
                                                </div>
                                                <p className="text-sm font-bold text-gray-700 mt-2">
                                                    {formatSalaryRange(job.salary_min, job.salary_max)}
                                                </p>
                                            </button>
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
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                disabled={page === 1 || isLoading}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                &lt;
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPage(p)}
                                    disabled={isLoading || p === page}
                                    className={`px-3 py-2 text-sm rounded-lg border cursor-pointer disabled:cursor-not-allowed ${p === page ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 hover:bg-gray-50"}`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                disabled={page === totalPages || isLoading}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                &gt;
                            </button>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 min-h-96">
                        {!selectedJob ? (
                            <p className="text-gray-500">Selecciona una vacante para ver el detalle.</p>
                        ) : (
                            <div className="space-y-8">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                                        <p className="text-gray-500">Publicado: {formatDateTime(selectedJob.createdAt)}</p>
                                    </div>
                                    {(!isAuthenticated || user?.role?.name === 'candidate') && (
                                        <button
                                            type="button"
                                            onClick={handleApply}
                                            disabled={applying || checkingApplication || hasApplied}
                                            className="shrink-0 px-5 py-2.5 text-sm font-semibold rounded-lg transition cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 bg-blue-500 hover:bg-blue-600 text-white"
                                        >
                                            {hasApplied ? 'Ya postulado' : applying ? 'Postulando...' : checkingApplication ? 'Verificando...' : 'Postularme'}
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500 mb-1">Salario</p>
                                        <p className="font-semibold text-gray-900">{salaryLabel}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500 mb-1">Estado</p>
                                        <p className="font-semibold text-gray-900">{getCatalogName(catalogs.states, selectedJob.id_state)}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500 mb-1">Categoría</p>
                                        <p className="font-semibold text-gray-900">{getCatalogName(catalogs.jobCategories, selectedJob.id_job_category)}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500 mb-1">Tipo de empleo</p>
                                        <p className="font-semibold text-gray-900">{getCatalogName(catalogs.employmentTypes, selectedJob.id_employment_type)}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500 mb-1">Nivel de experiencia</p>
                                        <p className="font-semibold text-gray-900">{getCatalogName(catalogs.experienceLevels, selectedJob.id_experience_level)}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500 mb-1">Nivel educativo</p>
                                        <p className="font-semibold text-gray-900">{getCatalogName(catalogs.educationLevels, selectedJob.id_education_level)}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                                        <p className="text-sm text-gray-500 mb-1">Modalidad de trabajo</p>
                                        <p className="font-semibold text-gray-900">{getCatalogName(catalogs.workModels, selectedJob.id_work_model)}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <section>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Descripción</h3>
                                        <div className="prose prose-sm max-w-none text-gray-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-2" dangerouslySetInnerHTML={{ __html: selectedJob.description || "" }} />
                                    </section>
                                    <section>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Requisitos</h3>
                                        <div className="prose prose-sm max-w-none text-gray-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-2" dangerouslySetInnerHTML={{ __html: selectedJob.requirements || "" }} />
                                    </section>
                                    <section>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Beneficios</h3>
                                        <div className="prose prose-sm max-w-none text-gray-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-2" dangerouslySetInnerHTML={{ __html: selectedJob.benefits || "" }} />
                                    </section>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
