import { useEffect, useState } from "react";
import type { Release } from "../types";

export function ReleaseInfo() {
  const [release, setRelease] = useState<Release | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/apk/versions.json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Release metadata unavailable");
        return response.json();
      })
      .then((data: { latest?: Release | null }) => {
        if (!data.latest || typeof data.latest.version !== "string")
          throw new Error("No release yet");
        setRelease(data.latest);
        setState("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setState("error");
      });
    return () => controller.abort();
  }, []);
  return (
    <div
      className={`release-info${state === "error" ? " release-info-error" : ""}`}
      aria-live="polite"
    >
      {state === "loading" && "Loading release info…"}
      {state === "error" && "Couldn't load the version info."}
      {state === "ready" &&
        release &&
        `Version ${release.version} · ${release.size} · ${release.date}`}
    </div>
  );
}
