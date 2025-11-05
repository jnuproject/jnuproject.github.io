import { useEffect, useState } from "react";
import raw from "../data/affiliates.json";
import type { Affiliate } from "../types/affiliate";

const data: Affiliate[] = raw as unknown as Affiliate[];

export const useAffiliates = (
  category?: string,
  subcategory?: string,
  region?: string
) => {
  const [filtered, setFiltered] = useState<Affiliate[]>(data);

  useEffect(() => {
    let result = data.slice();
    if (category) result = result.filter(d => d.category === category);
    if (subcategory && subcategory !== "전체")
      result = result.filter(d => d.subcategory === subcategory);
    if (region && region !== "전체")
      result = result.filter(d => d.region === region);
    setFiltered(result);
  }, [category, subcategory, region]);

  return filtered;
};