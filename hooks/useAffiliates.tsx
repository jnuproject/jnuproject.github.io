import { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import fallbackData from "../data/affiliates.json";
import type { Affiliate } from "../types/affiliate";

const CACHE_KEY = "affiliates_data";
const CACHE_TIMESTAMP_KEY = "affiliates_timestamp";
const DATA_URL = "https://jnuproject.github.io/data/affiliates.json";
const CACHE_DURATION = 1000 * 60 * 5; // 5분

let cachedData: Affiliate[] | null = null;
let lastFetchTime = 0;
let inFlightRequest: Promise<Affiliate[]> | null = null;

const fallbackList = fallbackData as Affiliate[];

const filterAffiliates = (
  source: Affiliate[],
  category?: string,
  subcategory?: string,
  region?: string
) => {
  if (
    !category &&
    (!subcategory || subcategory === "전체") &&
    (!region || region === "전체")
  ) {
    return source;
  }

  return source.filter((item) => {
    if (category && item.category !== category) {
      return false;
    }
    if (subcategory && subcategory !== "전체" && item.subcategory !== subcategory) {
      return false;
    }
    if (region && region !== "전체" && item.region !== region) {
      return false;
    }
    return true;
  });
};

const useAffiliatesSource = () => {
  const initialData = cachedData ?? fallbackList;
  const [data, setData] = useState<Affiliate[]>(initialData);
  const [loading, setLoading] = useState(initialData.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadFromStorage = async () => {
      try {
        const entries = await AsyncStorage.multiGet([CACHE_KEY, CACHE_TIMESTAMP_KEY]);
        const storedJson = entries.find(([key]) => key === CACHE_KEY)?.[1];
        const storedTimestamp = entries.find(([key]) => key === CACHE_TIMESTAMP_KEY)?.[1];

        if (storedJson) {
          const parsed = JSON.parse(storedJson) as Affiliate[];
          const timestamp = storedTimestamp ? Number(storedTimestamp) : 0;

          cachedData = parsed;
          lastFetchTime = Number.isFinite(timestamp) ? timestamp : 0;

          if (active) {
            setData(parsed);
            setLoading(parsed.length === 0);
          }
        }
      } catch (storageErr) {
        console.warn("Failed to load cached affiliates data:", storageErr);
      }
    };

    const ensureData = async () => {
      const now = Date.now();

      if (!cachedData) {
        await loadFromStorage();
      } else if (active) {
        setData(cachedData);
        setLoading(cachedData.length === 0);
      }

      const hasFreshCache =
        cachedData != null && now - lastFetchTime < CACHE_DURATION;

      if (hasFreshCache) {
        if (active) {
          setError(null);
          setLoading(cachedData!.length === 0);
        }
        return;
      }

      if (!inFlightRequest) {
        inFlightRequest = (async () => {
          const response = await fetch(`${DATA_URL}?t=${now}`, { cache: "no-store" });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return (await response.json()) as Affiliate[];
        })();
      }

      const request = inFlightRequest;

      try {
        const freshData = await request;
        const fetchCompletedAt = Date.now();

        cachedData = freshData;
        lastFetchTime = fetchCompletedAt;

        if (active) {
          setData(freshData);
          setError(null);
          setLoading(freshData.length === 0);
        }

        try {
          await AsyncStorage.multiSet([
            [CACHE_KEY, JSON.stringify(freshData)],
            [CACHE_TIMESTAMP_KEY, fetchCompletedAt.toString()],
          ]);
        } catch (writeErr) {
          console.warn("Failed to persist affiliates cache:", writeErr);
        }
      } catch (err) {
        console.warn("Failed to fetch affiliates data, using cached/fallback:", err);

        if (!active) {
          return;
        }

        if (cachedData && cachedData.length > 0) {
          setData(cachedData);
          setError("오프라인 모드 (캐시된 데이터)");
          setLoading(false);
        } else {
          setData(fallbackList);
          setError("오프라인 모드 (기본 데이터)");
          setLoading(fallbackList.length === 0);
        }
      } finally {
        if (inFlightRequest === request) {
          inFlightRequest = null;
        }
      }
    };

    ensureData();

    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
};

export const useAffiliates = (
  category?: string,
  subcategory?: string,
  region?: string
) => {
  const { data, loading, error } = useAffiliatesSource();

  const filtered = useMemo(
    () => filterAffiliates(data, category, subcategory, region),
    [data, category, subcategory, region]
  );

  return { data: filtered, loading, error };
};

// 전체 데이터를 가져오는 간단한 hook
export const useAllAffiliates = () => {
  return useAffiliatesSource();
};
