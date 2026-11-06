/**
 * Safe API request wrapper that handles errors gracefully
 */
export async function safeFetch<T>(url: string, options?: RequestInit): Promise<{ success: boolean; data?: T; message?: string }> {
  try {
    const res = await window.fetch(url, options);
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return {
        success: false,
        message: errJson.message || `Request failed with status ${res.status}`,
      };
    }
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.warn(`[API] Error fetching ${url}:`, err);
    return {
      success: false,
      message: err.message || 'Gagal menghubungi server.',
    };
  }
}
