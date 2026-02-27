"use client";

import { useFetchedDataStore } from "@/src/store/fetchedData.store";

export default function AddCompanyPage() {
  // const { data } = useFetchedDataStore();

  const API = process.env.NEXT_PUBLIC_API_URL as string;

  const fetchData = async () => {
    const response = await fetch(`${API}/api/hello`);
    const data = await response.json();
    console.log("data", data);
    return data;
  };

  return (
    <>
      <button onClick={fetchData}>AddCompanyPage</button>
    </>
  );
}
