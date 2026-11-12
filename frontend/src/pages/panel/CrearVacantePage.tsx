import { useForm } from "react-hook-form";
import type { TJobPostingForm } from "../../types/forms";

const initialValues: TJobPostingForm = {
    title: "",
    requirements: "",
    benefits: "",
    salary_min: "",
    salary_max: "",
    status: "",
    id_state: "",
    id_category: "",
    id_employment_type: "",
    id_experience_level: "",
    id_education_level: "",
    id_work_model: "",
};

export default function CrearVacantePage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<TJobPostingForm>({ defaultValues: initialValues, mode: "onChange" });

    const sendForm = async (dataForm: TJobPostingForm) => {
        void dataForm;
    };

    return (
        <div className="py-8 px-4">
            <div className="w-full max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Crear vacante</h1>
                    <p className="mt-2 text-gray-500">Completa la información para publicar una nueva vacante</p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
                    <form onSubmit={handleSubmit(sendForm)} className="space-y-5">
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

                        <div>
                            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                                Requisitos
                            </label>
                            <textarea
                                id="requirements"
                                rows={4}
                                placeholder="Describe los requisitos de la vacante"
                                {...register("requirements", {
                                    required: "Los requisitos son obligatorios",
                                })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 resize-y"
                            />
                            {errors.requirements && (
                                <p className="mt-1 text-sm text-red-500">{errors.requirements.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-2">
                                Beneficios
                            </label>
                            <textarea
                                id="benefits"
                                rows={4}
                                placeholder="Describe los beneficios de la vacante"
                                {...register("benefits", {
                                    required: "Los beneficios son obligatorios",
                                })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 resize-y"
                            />
                            {errors.benefits && (
                                <p className="mt-1 text-sm text-red-500">{errors.benefits.message}</p>
                            )}
                        </div>

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
                                        valueAsNumber: true,
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
                                        valueAsNumber: true,
                                    })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                Estatus
                            </label>
                            <select
                                id="status"
                                {...register("status", {
                                    required: "El estatus es obligatorio",
                                })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white"
                            >
                                <option value="">Selecciona un estatus</option>
                                <option value="borrador">Borrador</option>
                                <option value="publicada">Publicada</option>
                                <option value="cerrada">Cerrada</option>
                            </select>
                            {errors.status && (
                                <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="id_state" className="block text-sm font-medium text-gray-700 mb-2">
                                    Estado
                                </label>
                                <input
                                    id="id_state"
                                    type="number"
                                    min={1}
                                    placeholder="ID del estado"
                                    {...register("id_state", {
                                        required: "El estado es obligatorio",
                                        valueAsNumber: true,
                                    })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                />
                                {errors.id_state && (
                                    <p className="mt-1 text-sm text-red-500">{errors.id_state.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="id_category" className="block text-sm font-medium text-gray-700 mb-2">
                                    Categoría
                                </label>
                                <input
                                    id="id_category"
                                    type="number"
                                    min={1}
                                    placeholder="ID de la categoría"
                                    {...register("id_category", {
                                        required: "La categoría es obligatoria",
                                        valueAsNumber: true,
                                    })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                />
                                {errors.id_category && (
                                    <p className="mt-1 text-sm text-red-500">{errors.id_category.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="id_employment_type" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de empleo
                                </label>
                                <input
                                    id="id_employment_type"
                                    type="number"
                                    min={1}
                                    placeholder="ID del tipo de empleo"
                                    {...register("id_employment_type", {
                                        required: "El tipo de empleo es obligatorio",
                                        valueAsNumber: true,
                                    })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                />
                                {errors.id_employment_type && (
                                    <p className="mt-1 text-sm text-red-500">{errors.id_employment_type.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="id_experience_level" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nivel de experiencia
                                </label>
                                <input
                                    id="id_experience_level"
                                    type="number"
                                    min={1}
                                    placeholder="ID del nivel de experiencia"
                                    {...register("id_experience_level", {
                                        required: "El nivel de experiencia es obligatorio",
                                        valueAsNumber: true,
                                    })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                />
                                {errors.id_experience_level && (
                                    <p className="mt-1 text-sm text-red-500">{errors.id_experience_level.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="id_education_level" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nivel educativo
                                </label>
                                <input
                                    id="id_education_level"
                                    type="number"
                                    min={1}
                                    placeholder="ID del nivel educativo"
                                    {...register("id_education_level", {
                                        required: "El nivel educativo es obligatorio",
                                        valueAsNumber: true,
                                    })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                />
                                {errors.id_education_level && (
                                    <p className="mt-1 text-sm text-red-500">{errors.id_education_level.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="id_work_model" className="block text-sm font-medium text-gray-700 mb-2">
                                    Modalidad de trabajo
                                </label>
                                <input
                                    id="id_work_model"
                                    type="number"
                                    min={1}
                                    placeholder="ID de la modalidad"
                                    {...register("id_work_model", {
                                        required: "La modalidad de trabajo es obligatoria",
                                        valueAsNumber: true,
                                    })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                />
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
                            Crear vacante
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
