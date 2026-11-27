export const PORT = process.env.PORT || 3000;

export const NODEMAILER_HOST = process.env.NODEMAILER_HOST || '';
export const NODEMAILER_PORT = process.env.NODEMAILER_PORT || '';
export const NODEMAILER_USER = process.env.NODEMAILER_USER || '';
export const NODEMAILER_PASS = process.env.NODEMAILER_PASS || '';
export const NODEMAILER_SENDER = process.env.NODEMAILER_SENDER;

export const FRONTEND_URL = process.env.FRONTEND_URL || '';

export const JWT_SECRET = process.env.JWT_SECRET || '' as string;

export const NODE_ENV = process.env.NODE_ENV || 'development';

export const TOKEN_DURATION_MINUTES = parseInt(process.env.TOKEN_DURATION_MINUTES as string, 10) || 30;

export const SUPABASE_URL = process.env.SUPABASE_URL || '';
export const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || '';
export const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || '';
export const SUPABASE_JWKS_URL = process.env.SUPABASE_JWKS_URL || '';
export const SUPABASE_RESUMES_BUCKET = process.env.SUPABASE_RESUMES_BUCKET || 'files';
