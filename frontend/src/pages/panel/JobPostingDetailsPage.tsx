import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { getJobPostingById } from "../../api/job-posting";
import type { TJobPosting } from "../../types/api.type";
import { formatDateTime, formatSalaryRange } from "../../utils/format";
import { getCatalogName } from "../../utils/catalog";
import { usePanel } from "../../contexts/PanelContext";
import PanelBreadcrumbs from "../../components/PanelBreadcrumbs";
import { getJobPostingStatusLabel, getJobPostingStatusStyle } from "../../utils/job-posting";

export default function JobPostingDetailsPage() {
    const { id } = useParams();
    const { catalogs } = usePanel();
    const [jobPosting, setJobPosting] = useState<TJobPosting | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            if (!id) {
                setError("ID de vacante no válido");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            const jobRes = await getJobPostingById(id);
            if (jobRes.success) {
                setJobPosting(jobRes.data.jobPosting);
            } else {
                setError(jobRes.message || "No se pudo cargar la vacante");
            }

            setIsLoading(false);
        }

        load();
    }, [id]);

    const salaryLabel = useMemo(() => formatSalaryRange(jobPosting?.salary_min, jobPosting?.salary_max), [jobPosting]);

    const statusLabel = getJobPostingStatusLabel(jobPosting?.status, jobPosting?.deletedAt ?? jobPosting?.deleted_at);
    const statusStyles = getJobPostingStatusStyle(jobPosting?.status, jobPosting?.deletedAt ?? jobPosting?.deleted_at);

    if (isLoading) {
        return (
            <div className="py-8 px-4 max-w-4xl mx-auto">
                <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
                    <p className="text-gray-500">Cargando vacante...</p>
                </div>
            </div>
        );
    }

    if (error || !jobPosting) {
        return (
            <div className="py-8 px-4 max-w-4xl mx-auto space-y-4">
                <PanelBreadcrumbs items={[{ label: "Panel", to: "/panel" }, { label: "Vacantes", to: "/panel/vacantes" }, { label: "Detalle" }]} />
                <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Detalle de vacante</h1>
                    <p className="text-red-500">{error || "Vacante no encontrada"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 px-4 max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <PanelBreadcrumbs items={[{ label: "Panel", to: "/panel" }, { label: "Vacantes", to: "/panel/vacantes" }, { label: jobPosting.title }]} />
                <div className="flex items-center gap-2">
                    <Link
                        to={`/panel/vacantes/${jobPosting.id_job_posting}/candidatos`}
                        className="inline-block text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition duration-200 cursor-pointer"
                    >
                        Ver candidatos
                    </Link>
                    <Link
                        to={`/panel/vacantes/${jobPosting.id_job_posting}/editar`}
                        className="inline-block text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-lg transition duration-200 shadow-sm cursor-pointer"
                    >
                        Editar
                    </Link>
                </div>
            </div>

            <div>
                <h1 className="text-3xl font-bold text-gray-900">Detalles de la vacante</h1>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8 space-y-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900">{jobPosting.title}</h2>
                        <p className="text-gray-500">Publicado: {formatDateTime(jobPosting.createdAt)}</p>
                        <p className="text-gray-500">Actualizado: {formatDateTime(jobPosting.updatedAt)}</p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusStyles}`}>
                        {statusLabel}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Salario</p>
                        <p className="font-semibold text-gray-900">{salaryLabel}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Estado</p>
                        <p className="font-semibold text-gray-900">{getCatalogName(catalogs.states, jobPosting.id_state)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Categoría</p>
                        <p className="font-semibold text-gray-900">{getCatalogName(catalogs.jobCategories, jobPosting.id_job_category)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Tipo de empleo</p>
                        <p className="font-semibold text-gray-900">{getCatalogName(catalogs.employmentTypes, jobPosting.id_employment_type)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Nivel de experiencia</p>
                        <p className="font-semibold text-gray-900">{getCatalogName(catalogs.experienceLevels, jobPosting.id_experience_level)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Nivel educativo</p>
                        <p className="font-semibold text-gray-900">{getCatalogName(catalogs.educationLevels, jobPosting.id_education_level)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                        <p className="text-sm text-gray-500 mb-1">Modalidad de trabajo</p>
                        <p className="font-semibold text-gray-900">{getCatalogName(catalogs.workModels, jobPosting.id_work_model)}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Descripción</h2>
                        <div
                            className="prose prose-sm max-w-none text-gray-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-2"
                            dangerouslySetInnerHTML={{ __html: jobPosting.description || "" }}
                        />
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Requisitos</h2>
                        <div
                            className="prose prose-sm max-w-none text-gray-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-2"
                            dangerouslySetInnerHTML={{ __html: jobPosting.requirements || "" }}
                        />
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Beneficios</h2>
                        <div
                            className="prose prose-sm max-w-none text-gray-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-2"
                            dangerouslySetInnerHTML={{ __html: jobPosting.benefits || "" }}
                        />
                    </section>
                </div>

                <div className="pt-4 border-t border-gray-100 text-sm text-gray-500 space-y-1">
                    <p>ID de vacante: {jobPosting.id_job_posting}</p>
                    <p>Creada por: {jobPosting.createdBy?.name || `Usuario #${jobPosting.created_by}`}</p>
                </div>
            </div>
        </div>
    );
}
