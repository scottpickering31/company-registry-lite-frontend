"use client";

import { useFetchedDataStore } from "@/src/store/fetchedData.store";

export default function CompanyPage() {
  const { data, setData } = useFetchedDataStore();
  return (
    <>
      <h1>Company Page</h1>
      <p>{data}</p>
    </>
  );
}
