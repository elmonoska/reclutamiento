import { createClient } from '@supabase/supabase-js';
import { SUPABASE_RESUMES_BUCKET, SUPABASE_SECRET_KEY, SUPABASE_URL } from '../constants/index.constants';
import { APP_ERROR } from '../constants/errors.constants';
import { RESUME_SIGNED_URL_EXPIRES_IN_SECONDS } from '../constants/upload.constants';

function getSupabaseClient() {
    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
        throw new Error(APP_ERROR.SUPABASE_NOT_CONFIGURED);
    }
    return createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);
}

export default class StorageService {
    static async uploadResume(buffer: Buffer, mimeType: string, uuidUser: string) {
        const supabase = getSupabaseClient();
        const path = `candidates/${uuidUser}/resume-${Date.now()}.pdf`;

        const { data, error } = await supabase.storage
            .from(SUPABASE_RESUMES_BUCKET)
            .upload(path, buffer, { contentType: mimeType, upsert: false });

        if (error) throw error;
        return data.path;
    }

    static async deleteResume(path: string) {
        const supabase = getSupabaseClient();
        const { error } = await supabase.storage
            .from(SUPABASE_RESUMES_BUCKET)
            .remove([path]);
        if (error) throw error;
    }

    static async getSignedResumeUrl(path: string, expiresIn = RESUME_SIGNED_URL_EXPIRES_IN_SECONDS) {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.storage
            .from(SUPABASE_RESUMES_BUCKET)
            .createSignedUrl(path, expiresIn);
        if (error) throw error;
        return data.signedUrl;
    }
}

