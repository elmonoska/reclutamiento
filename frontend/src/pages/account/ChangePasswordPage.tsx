import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { confirmPasswordChange } from "../../api/account";
import { useAuth } from "../../contexts/AuthContext";

type TConfirmChangeForm = { token: string; password: string; confirm_password: string };

export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const accountPath = user?.role?.name === 'candidate' ? '/candidato/cuenta' : '/panel/cuenta';

    const { register, handleSubmit, getValues, formState: { errors, isValid, isSubmitting } } = useForm<TConfirmChangeForm>({
        mode: 'onChange',
        defaultValues: { token: '', password: '', confirm_password: '' }
    });

    async function onSubmit(values: TConfirmChangeForm) {
        const res = await confirmPasswordChange(values);
        if (!res.success) { toast.error(res.message); return; }
        toast.success(res.message);
        navigate(accountPath, { replace: true });
    }

    return (
        <div className="py-8 px-4 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Confirmar cambio de contraseña</h1>
                <p className="mt-2 text-gray-500">Ingresa el token que recibiste por correo y tu nueva contraseña.</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* token */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Token</label>
                        <input {...register('token', { required: 'El token es obligatorio', pattern: { value: /^\d{6}$/, message: 'Token inválido' } })} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        {errors.token && <p className="mt-1 text-sm text-red-500">{errors.token.message}</p>}
                    </div>
                    {/* nueva contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nueva contraseña</label>
                        <input type="password" {...register('password', { required: 'La contraseña es obligatoria', minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' } })} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                    </div>
                    {/* confirmar contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña</label>
                        <input type="password" {...register('confirm_password', { required: 'Confirma la contraseña', validate: (v) => v === getValues('password') || 'Las contraseñas no coinciden' })} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        {errors.confirm_password && <p className="mt-1 text-sm text-red-500">{errors.confirm_password.message}</p>}
                    </div>
                    {/* boton cambiar contraseña */}
                    <div className="flex items-center gap-3">
                        <button type="submit" disabled={!isValid || isSubmitting} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg transition disabled:bg-blue-200 disabled:cursor-not-allowed cursor-pointer">
                            {isSubmitting ? 'Guardando...' : 'Cambiar contraseña'}
                        </button>
                        <Link to={accountPath} className="text-sm font-medium text-gray-500 hover:text-gray-700 transition">Volver a cuenta</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
