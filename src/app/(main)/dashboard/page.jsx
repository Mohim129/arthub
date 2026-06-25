"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";

function DashboardRedirectContent() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLogin = searchParams.get("login") === "true";

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/signin");
      return;
    }

    const role = session.user?.role || "user";

    switch (role) {
      case "admin":
        router.replace("/dashboard/admin");
        break;
      case "artist":
        router.replace("/dashboard/artist");
        break;
      default:
        if (isLogin) {
          router.replace("/");
        } else {
          router.replace("/dashboard/user");
        }
        break;
    }
  }, [session, isPending, router, isLogin]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="font-body-large text-on-surface-variant animate-pulse">
        Redirecting to your dashboard…
      </p>
    </div>
  );
}

export default function DashboardRedirect() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="font-body-large text-on-surface-variant animate-pulse">
            Loading...
          </p>
        </div>
      }
    >
      <DashboardRedirectContent />
    </Suspense>
  );
}