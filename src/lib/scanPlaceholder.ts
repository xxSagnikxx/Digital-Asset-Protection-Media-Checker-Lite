import { toast } from "sonner";

export function runScanPlaceholder(): void {
  toast.message("Scan queued", {
    description: "Connect backend services to execute integrity scans.",
  });
}
