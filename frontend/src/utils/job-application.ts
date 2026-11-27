import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_STYLES } from "../constants/job-application";
import type { TApplicationStatus } from "../types/job-application.type";

export function getApplicationStatusLabel(status?: string | null) {
    if (!status) return 'Desconocido';
    return APPLICATION_STATUS_LABELS[status as TApplicationStatus] || status;
}

export function getApplicationStatusStyle(status?: string | null) {
    if (!status) return 'bg-gray-50 text-gray-700 border-gray-200';
    return APPLICATION_STATUS_STYLES[status as TApplicationStatus] || 'bg-gray-50 text-gray-700 border-gray-200';
}
