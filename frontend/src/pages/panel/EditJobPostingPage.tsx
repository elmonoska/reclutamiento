import { Controller, useForm } from "react-hook-form";
import type { TEditJobPostingForm  } from "../../types/form.type";
import { editJobPosting, getJobPostingById } from "../../api/job-posting";
import RichTextEditor from "../../components/RichTextEditor";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router";
import { usePanel } from "../../contexts/PanelContext";
import { useEffect, useState } from "react";

const initialValues: TEditJobPostingForm = {
    title: "",
    description: "",
    requirements: "",
    benefits: "",
    salary_min: null,
    salary_max: null,
    status: "",
    id_state: 0,
    id_job_category: 0,
    id_employment_type: 0,
    id_experience_level: 0,
    id_education_level: 0,
    id_work_model: 0
}

export default function EditJobPostingPage() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();
    const { catalogs } = usePanel();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isValid },
        reset
    } = useForm<TEditJobPostingForm>({ defaultValues: initialValues, mode: "onChange" });

    const validateRichText = (value: string) => value.replace(/<[^>]*>/g, "").trim().length > 0;

    async function sendForm(dataForm: TEditJobPostingForm) {
        const res = await editJobPosting(id!, dataForm)
        if (!res.success) {
            toast.error(res.message);
            return;
        }
        toast.success(res.message);
        navigate(`/panel/vacantes/${id}`);
    };

    useEffect(() => {
        async function getJobPosting() {
            if (!id) {
                toast.error('ID no valido');
                setIsLoading(false);
                return;
            }
            try {
                const res = await getJobPostingById(id)
                if (!res.success) {
                    toast.error(res.message);
                    return;
                }
                const jobPosting = res.data.jobPosting;
                reset({
                    title: jobPosting.title,
                    description: jobPosting.description,
                    requirements: jobPosting.requirements,
                    benefits: jobPosting.benefits,
                    salary_min: jobPosting.salary_min ?? null,
                    salary_max: jobPosting.salary_max ?? null,
                    status: jobPosting.status,
                    id_state: jobPosting.id_state,
                    id_job_category: jobPosting.id_job_category,
                    id_employment_type: jobPosting.id_employment_type,
                    id_experience_level: jobPosting.id_experience_level,
                    id_education_level: jobPosting.id_education_level,
                    id_work_model: jobPosting.id_work_model
                });
            } catch (err) {
                console.log(`Error al cargar la vacante: ${err}`)
                toast.error('No se pudo cargar la informacion de la vacante');
            } finally {
                setIsLoading(false);
            }
        }
        getJobPosting();
    }, [id, reset])

    if (isLoading) {
        return <p>Cargando...</p>
    }

    return (
        <div className="py-8 px-4 max-w-4xl mx-auto space-y-6">
            <Link to="/panel" className="inline-block text-sm font-medium text-orange-600 hover:text-orange-700 transition">
                &larr; Volver al panel
            </Link>

            <div className="w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Editar vacante</h1>
                    <p className="mt-2 text-gray-500">Completa la información para editar la vacante</p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
                    <form onSubmit={handleSubmit(sendForm)} className="space-y-5">
                        {/* titulo de vacante */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Título
                            </label>
                            <input
                                id="title"
                                type="text"
                                placeholder="Ej. Desarrollador Frontend"
                                {...register("title", {
                                    required: "El título es obligatorio",
                                })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                            )}
                        </div>

                        {/* descripcion */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <Controller
                                name="description"
                                control={control}
                                rules={{
                                    validate: (value) =>
                                        validateRichText(value) || "La descripción es obligatoria",
                                }}
                                render={({ field }) => (
                                    <RichTextEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        placeholder="Describe la vacante"
                                    />
                                )}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                            )}
                        </div>

                        {/* requisitos */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Requisitos
                            </label>
                            <Controller
                                name="requirements"
                                control={control}
                                rules={{
                                    validate: (value) =>
                                        validateRichText(value) || "Los requisitos son obligatorios",
                                }}
                                render={({ field }) => (
                                    <RichTextEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        placeholder="Describe los requisitos de la vacante"
                                    />
                                )}
                            />
                            {errors.requirements && (
                                <p className="mt-1 text-sm text-red-500">{errors.requirements.message}</p>
                            )}
                        </div>

                        {/* beneficios */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Beneficios
                            </label>
                            <Controller
                                name="benefits"
                                control={control}
                                rules={{
                                    validate: (value) =>
                                        validateRichText(value) || "Los beneficios son obligatorios",
                                }}
                                render={({ field }) => (
                                    <RichTextEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        placeholder="Describe los beneficios de la vacante"
                                    />
                                )}
                            />
                            {errors.benefits && (
                                <p className="mt-1 text-sm text-red-500">{errors.benefits.message}</p>
                            )}
                        </div>

                        {/* salario minimo y maximo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="salary_min" className="block text-sm font-medium text-gray-700 mb-2">
                                    Salario mínimo
                                </label>
                                <input
                                    id="salary_min"
                                    type="number"
                                    min={0}
                                    placeholder="Ej. 15000"
                                    {...register("salary_min", {
                                        setValueAs: (value) => (value === '' ? null : parseInt(value, 10))
                                    })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                />
                            </div>

                            <div>
                                <label htmlFor="salary_max" className="block text-sm font-medium text-gray-700 mb-2">
                                    Salario máximo
                                </label>
                                <input
                                    id="salary_max"
                                    type="number"
                                    min={0}
                                    placeholder="Ej. 25000"
                                    {...register("salary_max", {
                                        setValueAs: (value) => (value === '' ? null : parseInt(value, 10))
                                    })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                Estatus de la vacante
                            </label>
                            <select
                                id="status"
                                {...register("status", {
                                    required: "El estatus es obligatorio",
                                })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white"
                            >
                                <option value="">Selecciona un estatus</option>
                                <option value="published">Publicada</option>
                                <option value="closed">Cerrada</option>
                            </select>
                            {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* estado */}
                            <div>
                                <label htmlFor="id_state" className="block text-sm font-medium text-gray-700 mb-2">
                                    Estado
                                </label>
                                <select
                                    id="id_state"
                                    {...register("id_state", {
                                        required: "El estado es obligatorio",
                                        valueAsNumber: true
                                    })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white"
                                >
                                    <option value="">Selecciona un estado</option>
                                    {catalogs.states.map(state => <option key={state.id} value={state.id}>{state.name}</option>)}
                                </select>
                                {errors.id_state && (
                                    <p className="mt-1 text-sm text-red-500">{errors.id_state.message}</p>
                                )}
                            </div>

                            {/* categoria de puesto */}
                            <div>
                                <label htmlFor="id_job_category" className="block text-sm font-medium text-gray-700 mb-2">
                                    Categoría de puesto
                                </label>
                                <select
                                    id="id_job_category"
                                    {...register("id_job_category", {
                                        required: "La categoria de puesto es obligatoria",
                                        valueAsNumber: true
                                    })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white"
                                >
                                    <option value="">Selecciona una categoria</option>
                                    {catalogs.jobCategories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
                                </select>
                                {errors.id_job_category && (
                                    <p className="mt-1 text-sm text-red-500">{errors.id_job_category.message}</p>
                                )}
                            </div>

                            {/* tipo de empleo */}
                            <div>
                                <label htmlFor="id_employment_type" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de empleo
                                </label>
                                <select
                                    id="id_employment_type"
                                    {...register("id_employment_type", {
                                        required: "El tipo de empleo es obligatorio",
                                        valueAsNumber: true
                                    })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white"
                                >
                                    <option value="">Selecciona un tipo de empleo</option>
                                    {catalogs.employmentTypes.map(employment => <option key={employment.id} value={employment.id}>{employment.name}</option>)}
                                </select>
                                {errors.id_employment_type && (
                                    <p className="mt-1 text-sm text-red-500">{errors.id_employment_type.message}</p>
                                )}
                            </div>

                            {/* nivel de experiencia */}
                            <div>
                                <label htmlFor="id_experience_level" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nivel de experiencia
                                </label>
                                <select
                                    id="id_experience_level"
                                    {...register("id_experience_level", {
                                        required: "El nivel de experiencia es obligatorio",
                                        valueAsNumber: true
                                    })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white"
                                >
                                    <option value="">Selecciona un nivel de experiencia</option>
                                    {catalogs.experienceLevels.map(experience => <option key={experience.id} value={experience.id}>{experience.name}</option>)}
                                </select>
                                {errors.id_experience_level && (
                                    <p className="mt-1 text-sm text-red-500">{errors.id_experience_level.message}</p>
                                )}
                            </div>

                            {/* nivel educativo */}
                            <div>
                                <label htmlFor="id_education_level" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nivel educativo
                                </label>
                                <select
                                    id="id_education_level"
                                    {...register("id_education_level", {
                                        required: "El nivel educativo es obligatorio",
                                        valueAsNumber: true
                                    })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white"
                                >
                                    <option value="">Selecciona un nivel educativo</option>
                                    {catalogs.educationLevels.map(educationLevel => <option key={educationLevel.id} value={educationLevel.id}>{educationLevel.name}</option>)}
                                </select>
                                {errors.id_education_level && (
                                    <p className="mt-1 text-sm text-red-500">{errors.id_education_level.message}</p>
                                )}
                            </div>

                            {/* modalidad de trabajo */}
                            <div>
                                <label htmlFor="id_work_model" className="block text-sm font-medium text-gray-700 mb-2">
                                    Modalidad de trabajo
                                </label>
                                <select
                                    id="id_work_model"
                                    {...register("id_work_model", {
                                        required: "La modalidad de trabajo es obligatoria",
                                        valueAsNumber: true
                                    })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white"
                                >
                                    <option value="">Selecciona una modalidad de trabajo</option>
                                    {catalogs.workModels.map(workModel => <option key={workModel.id} value={workModel.id}>{workModel.name}</option>)}
                                </select>
                                {errors.id_work_model && (
                                    <p className="mt-1 text-sm text-red-500">{errors.id_work_model.message}</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!isValid}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-sm cursor-pointer disabled:bg-orange-200 disabled:cursor-not-allowed disabled:text-white"
                        >
                            Editar vacante
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
