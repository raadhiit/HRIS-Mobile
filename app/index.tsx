import { validateSessionTokenOnly } from "@/shared/api/prod/auth/auth_min";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const ok = await validateSessionTokenOnly(); // akan jadi false
      if (alive) { 
        setLoggedIn(!!ok); 
        setReady(true); 
      }
    })();
    return () => { alive = false; };
  }, []);

  if (!ready) return null;
  return <Redirect href={loggedIn ? "/(home)" : "/(auth)/login"} />;
}
