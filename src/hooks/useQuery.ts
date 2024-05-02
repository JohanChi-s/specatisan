import { useRouter } from "next/router";

export default function useQuery() {
  const router = useRouter();
  
  // Extract query parameters from the router object
  const query = router.query;

  return query;
}
