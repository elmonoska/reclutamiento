import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { requestPasswordChange, updateAccount } from "../../api/account";
import { useAuth } from "../../contexts/AuthContext";

type TAccountForm = { name: string; email: string };
type TRequestChangeForm = { current_password: string };

export default function AccountSettingsPage() {
    const { user, setUser } = useAuth();

    const accountForm = useForm<TAccountForm>({
        mode: 'onChange',
        defaultValues: { name: user?.name || '', email: user?.email || '' },
    });

    const requestForm = useForm<TRequestChangeForm>({ mode: 'onChange', defaultValues: { current_password: '' } });

    async function onSaveAccount(values: TAccountForm) {
        const payload: { name?: string; email?: string } = {};
        if (values.name !== user?.name) payload.name = values.name;
        if (values.email !== user?.email) payload.email = values.email;
        if (!payload.name && !payload.email) { toast.info('No hay cambios por guardar'); return; }

        const res = await updateAccount(payload);
        if (!res.success) { toast.error(res.message); return; }
        setUser(res.data.user);
        toast.success(res.message);
    }

    async function onRequestPasswordChange(values: TRequestChangeForm) {
        const res = await requestPasswordChange(values.current_password);
        if (!res.success) { toast.error(res.message); return; }
        toast.success(res.message);
        requestForm.reset({ current_password: '' });
    }

    return (
        <div className="py-8 px-4 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Configuración de cuenta</h1>
                <p className="mt-2 text-gray-500">Actualiza tus datos de acceso y seguridad.</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Datos de cuenta</h2>
                <form onSubmit={accountForm.handleSubmit(onSaveAccount)} className="space-y-4">
                    {/* nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                        <input {...accountForm.register('name', { required: 'El nombre es obligatorio' })} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        {accountForm.formState.errors.name && <p className="mt-1 text-sm text-red-500">{accountForm.formState.errors.name.message}</p>}
                    </div>
                    {/* correo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Correo</label>
                        <input type="email" {...accountForm.register('email', { required: 'El correo es obligatorio' })} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        {accountForm.formState.errors.email && <p className="mt-1 text-sm text-red-500">{accountForm.formState.errors.email.message}</p>}
                    </div>
                    {/* boton guardar cambios */}
                    <button type="submit" disabled={!accountForm.formState.isValid || accountForm.formState.isSubmitting} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg transition disabled:bg-blue-200 disabled:cursor-not-allowed cursor-pointer">
                        {accountForm.formState.isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </form>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Cambiar contraseña</h2>
                <p className="text-sm text-gray-500 mb-4">Por seguridad, valida tu contraseña actual y te enviaremos un token de 6 dígitos a tu correo.</p>

                <form onSubmit={requestForm.handleSubmit(onRequestPasswordChange)} className="space-y-4">
                    {/* contraseña actual */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña actual</label>
                        <input type="password" {...requestForm.register('current_password', { required: 'La contraseña actual es obligatoria', minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' } })} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        {requestForm.formState.errors.current_password && <p className="mt-1 text-sm text-red-500">{requestForm.formState.errors.current_password.message}</p>}
                    </div>
                    {/* boton enviar token */}
                    <div className="flex items-center gap-3">
                        <button type="submit" disabled={requestForm.formState.isSubmitting || (requestForm.watch('current_password')?.length ?? 0) < 6} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg transition disabled:bg-blue-200 disabled:cursor-not-allowed cursor-pointer">
                            {requestForm.formState.isSubmitting ? 'Enviando...' : 'Enviar token'}
                        </button>
                        <Link to="/cuenta/cambiar-contrasena" className="text-sm font-medium text-blue-500 hover:text-blue-600 transition">Ya tengo un token</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
