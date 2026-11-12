import { CorsOptions } from "cors";
import { FRONTEND_URL, NODE_ENV } from "../constants";

export const corsOptions: CorsOptions = {
    origin: function(origin, callback) {
        // permitir cualquier entrada si se esta en ambiente de desarrollo
        if (NODE_ENV === 'development') {
            return callback(null, true)
        }
        
        // permitir entradas con origen y que esten en la whiteList
        const whiteList = [FRONTEND_URL];
        if (origin && whiteList.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Error de CORS: Origen no permitido'));
    },
    credentials: true
}