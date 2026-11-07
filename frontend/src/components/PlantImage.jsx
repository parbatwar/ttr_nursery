import { useState } from "react";
import { Leaf } from "lucide-react";

export default function PlantImage({ src, alt, className = "" }) {
  const [failedSource, setFailedSource] = useState(null);
  if (!src || failedSource === src) {
    return <div role="img" aria-label={`${alt} — image unavailable`} className="flex h-full w-full items-center justify-center bg-[var(--ttr-bg-soft)] text-[var(--ttr-green)]"><Leaf size={48} strokeWidth={1} /></div>;
  }
  return <img src={src} alt={alt} onError={() => setFailedSource(src)} className={className} />;
}
