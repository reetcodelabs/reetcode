import axiod from "https://deno.land/x/axiod@0.26.2/mod.ts";

export const PRODUCTION_URL = "https://reetcode.com/api";
export const STAGING_URL = "https://staging.reetcode.com/api";

export class ApiClient {
  private axiodInstance: typeof axiod;

  constructor(baseURL: string) {
    this.axiodInstance = axiod.create({ baseURL });
  }

  async request<R>(
    method: "GET" | "POST" | "DELETE",
    url: string,
    {
      params,
      data,
    }: {
      params?: Record<string, string | number>;
      data?: Record<string, string | number>;
    },
  ): Promise<[R, unknown]> {
    try {
      const response = await this.axiodInstance.request<R>({
        url,
        method,
        params,
        data,
      });

      return [response.data, null] as unknown as Promise<[R, unknown]>;
    } catch (error) {
      return [null, error] as unknown as Promise<[R, unknown]>;
    }
  }
}

export const client = (baseURL = PRODUCTION_URL) => new ApiClient(baseURL);
