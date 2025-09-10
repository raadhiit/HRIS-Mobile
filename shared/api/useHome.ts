import { useCallback, useEffect, useState } from "react";
import { HomeDTO } from "./types";
import { mockHome } from "./mocks";

const base_url = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

export async function getJSON<T>(path:string): Promise<T> {
    const res = await fetch(`${base_url}${path}`);
    if (!res.ok) throw new Error(`Request Failed: ${res.status}`);
    return res.json(); 
}

export function useHome() {
    const [data, setData] = useState<HomeDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<String | null>(null);

    const fetchData = useCallback(async () => {
        try{
            setLoading(true);
            setError(null);

            // prod
                // const dto = await getJSON<HomeDTO>("/home");
                // setData(dto);

            await new Promise((r) => setTimeout(r, 300));
            setData(mockHome);
        } catch(e:unknown) {
            const msg =
                e instanceof Error ? e.message :
                typeof e === "string" ? e :
                "Unknown error";
            setError(msg);
        } finally{
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refresh: fetchData };
}