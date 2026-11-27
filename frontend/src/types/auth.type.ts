export type TRole = {
    id_role: number;
    name: 'admin' | 'recruiter' | 'candidate';
};

export type TUser = {
    id_user: number;
    uuid_user: string;
    name: string;
    email: string;
    confirmed: boolean;
    id_role: number | null;
    role: TRole | null;
    createdAt: string;
    updatedAt: string;
};
