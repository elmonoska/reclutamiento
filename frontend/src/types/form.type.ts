// formularios de autenticacion
export type TAuthForm = {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    token: string;
    uuid_user: string;
}
export type TLoginForm = Pick<TAuthForm, 'email' | 'password'>;
export type TSignupForm = Pick<TAuthForm, 'name' | 'email' | 'password' | 'confirm_password'>;
export type TConfirmAccountForm = Pick<TAuthForm, 'uuid_user' | 'token'>;
export type TForgotPasswordForm = Pick<TAuthForm, 'email'>;
export type TResetPasswordForm = Pick<TAuthForm, 'password' | 'confirm_password' | 'token'>;

export type TJobPostingForm = {
    title: string;
    requirements: string;
    benefits: string;
    salary_min: number | '';
    salary_max: number | '';
    status: string;
    id_state: number | '';
    id_category: number | '';
    id_employment_type: number | '';
    id_experience_level: number | '';
    id_education_level: number | '';
    id_work_model: number | '';
};
