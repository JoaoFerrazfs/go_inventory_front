import { MINIO_ENDPOINT, MINIO_TUNNEL } from '../config/api';

// If an asset URL points to the local MinIO endpoint (eg. http://localhost:9000/...)
// and a MINIO_TUNNEL is configured, rewrite the URL to use the tunnel prefix.
export function normalizeAssetUrl(url) {
    if (!url) return url;

    try {
        const parsed = new URL(url);
        const hostPort = `${parsed.hostname}${parsed.port ? `:${parsed.port}` : ''}`;

        if (
            (hostPort === MINIO_ENDPOINT || parsed.origin.includes(MINIO_ENDPOINT)) &&
            MINIO_TUNNEL
        ) {
            // Replace origin with tunnel origin, preserve pathname
            const tunnel = MINIO_TUNNEL.replace(/\/$/, '');
            return `${tunnel}${parsed.pathname}`;
        }

        if ((hostPort === MINIO_ENDPOINT || parsed.origin.includes(MINIO_ENDPOINT)) && !MINIO_TUNNEL) {
            // Help debugging when tunnel isn't configured but assets point to local MinIO
            // eslint-disable-next-line no-console
            console.warn(`Asset URL points to ${MINIO_ENDPOINT} but MINIO_TUNNEL is not set: ${url}`);
        }
    } catch (e) {
        // Not a valid absolute URL — return as-is
        return url;
    }

    return url;
}

export default normalizeAssetUrl;
