import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { saveCandidateProfile } from "../../api/candidate";
import { getPublicCatalogs } from "../../api/job-posting";
import type { TApiResponseCatalogs } from "../../types/api.type";
import { useCandidateProfile } from "../../contexts/CandidateProfileContext";
import type { TCandidateProfileForm } from "../../types/form.type";
import { EMPTY_CATALOGS } from "../../constants/catalog";
import { buildCandidateProfileFormData } from "../../utils/candidate-profile";

export default function CompleteProfilePage() {
    const navigate = useNavigate();
    const { profileData, refreshProfile } = useCandidateProfile();
    const [catalogs, setCatalogs] = useState<TApiResponseCatalogs>(EMPTY_CATALOGS);
    const [loading, setLoading] = useState(true);

    const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<TCandidateProfileForm>({ mode: 'onChange' });

    useEffect(() => {
        getPublicCatalogs().then((res) => { if (res.success) setCatalogs(res.data); }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (profileData?.profileComplete) {
            navigate('/candidato', { replace: true });
        }
    }, [profileData, navigate]);

    const hasResume = !!profileData?.resume;

    async function onSubmit(values: TCandidateProfileForm) {
        const file = values.resume?.[0];
        if (!hasResume && !file) {
            toast.error('El CV en PDF es obligatorio');
            return;
        }
        if (file) {
            if (file.type !== 'application/pdf') { toast.error('Solo se permiten archivos PDF'); return; }
            if (file.size > 1024 * 1024) { toast.error('El CV no debe superar 1MB'); return; }
        }

        const fd = buildCandidateProfileFormData(values, file);

        const res = await saveCandidateProfile(fd);
        if (!res.success) { toast.error(res.message); return; }
        await refreshProfile();
        toast.success(res.message);
        navigate('/candidato', { replace: true });
    }

    if (loading) return <div className="p-8 text-gray-500">Cargando...</div>;

    return (
        <div className="py-8 px-4 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Completa tu perfil</h1>
                <p className="mt-2 text-gray-500">Necesitamos esta información para que puedas postularte a vacantes.</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* teléfono */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                            <input {...register('phone', { required: 'El teléfono es obligatorio' })} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="Ej. 5512345678" />
                            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                        </div>
                        {/* título profesional */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Título profesional *</label>
                            <input {...register('headline', { required: 'El título profesional es obligatorio' })} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="Ej. Desarrollador Backend Node.js" />
                            {errors.headline && <p className="mt-1 text-sm text-red-500">{errors.headline.message}</p>}
                        </div>
                    </div>

                    {/* resumen profesional */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Resumen profesional *</label>
                        <textarea {...register('summary', { required: 'El resumen es obligatorio' })} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="Cuéntanos brevemente sobre tu experiencia y lo que buscas" />
                        {errors.summary && <p className="mt-1 text-sm text-red-500">{errors.summary.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* estado */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                            <select {...register('id_state', { required: 'Selecciona un estado', valueAsNumber: true })} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                                <option value="">Selecciona</option>
                                {catalogs.states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            {errors.id_state && <p className="mt-1 text-sm text-red-500">{errors.id_state.message}</p>}
                        </div>
                        {/* nivel educativo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nivel educativo *</label>
                            <select {...register('id_education_level', { required: 'Selecciona un nivel', valueAsNumber: true })} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                                <option value="">Selecciona</option>
                                {catalogs.educationLevels.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            {errors.id_education_level && <p className="mt-1 text-sm text-red-500">{errors.id_education_level.message}</p>}
                        </div>
                        {/* nivel de experiencia */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de experiencia *</label>
                            <select {...register('id_experience_level', { required: 'Selecciona un nivel', valueAsNumber: true })} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                                <option value="">Selecciona</option>
                                {catalogs.experienceLevels.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            {errors.id_experience_level && <p className="mt-1 text-sm text-red-500">{errors.id_experience_level.message}</p>}
                        </div>
                        {/* modalidad preferida */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Modalidad preferida *</label>
                            <select {...register('id_work_model', { required: 'Selecciona una modalidad', valueAsNumber: true })} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                                <option value="">Selecciona</option>
                                {catalogs.workModels.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            {errors.id_work_model && <p className="mt-1 text-sm text-red-500">{errors.id_work_model.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* expectativa salarial */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Expectativa salarial (opcional)</label>
                            <input type="number" min={0} {...register('expected_salary', { setValueAs: v => v === '' ? '' : Number(v) })} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="Ej. 25000" />
                        </div>
                        {/* cv */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CV (PDF, máx. 1MB) {hasResume ? '(opcional para actualizar)' : '*'}</label>
                            <input type="file" accept="application/pdf,.pdf" {...register('resume', { required: hasResume ? false : 'El CV es obligatorio' })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm" />
                            {errors.resume && <p className="mt-1 text-sm text-red-500">{errors.resume.message as string}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* linkedin */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn (opcional)</label>
                            <input {...register('linkedin_url')} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="https://..." />
                        </div>
                        {/* github */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">GitHub (opcional)</label>
                            <input {...register('github_url')} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="https://..." />
                        </div>
                        {/* portafolio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Portafolio (opcional)</label>
                            <input {...register('portfolio_url')} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="https://..." />
                        </div>
                    </div>

                    {/* boton guardar perfil */}
                    <button type="submit" disabled={!isValid || isSubmitting} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition disabled:bg-blue-200 disabled:cursor-not-allowed cursor-pointer">
                        {isSubmitting ? 'Guardando...' : 'Guardar perfil'}
                    </button>
                </form>
            </div>
        </div>
    );
}
