import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";

export function useAuth() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        setAuthenticated(!!token);
      } catch {
        setAuthenticated(false);
      }
    })();
  }, []);

  return { authenticated };
}
