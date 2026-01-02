// Prefer explicit API base (REACT_APP_API_BASE), then legacy name, then sensible localhost defaults.
export const GO_INVETORY_BACK_HOST =
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_GO_INVETORY_BACK_HOST ||
    'http://localhost:9000';

// MinIO / asset storage settings. Accept both REACT_APP_ prefixed and legacy envs.
export const MINIO_ENDPOINT =
    process.env.REACT_APP_MINIO_ENDPOINT || process.env.MINIO_ENDPOINT || 'localhost:9000';

export const MINIO_TUNNEL =
    process.env.REACT_APP_MINIO_TUNNEL || process.env.MINIO_TUNNEL || '';
