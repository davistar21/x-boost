import { Toaster } from "sonner";
import { CheckCircle2, AlertTriangle, Info, AlertCircle } from "lucide-react";

export function CustomToaster() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      toastOptions={{
        className: "rounded-lg shadow-md border font-medium text-base",

        classNames: {
          success: "bg-green-100 text-green-800 border-green-700",
          error: "bg-red-100 text-red-700 border-red-600",
          info: "bg-blue-100 text-blue-700 border-blue-600",
        },
        //@ts-expect-error sonner types
        icons: {
          success: <CheckCircle2 className="w-5 h-5 text-white" />,
          error: <AlertCircle className="w-5 h-5 text-white" />,
          info: <Info className="w-5 h-5 text-blue-100" />,
        },
      }}
    />
  );
}
