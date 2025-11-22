import { toast } from "sonner";

export const toastUtils = {
  showApiError: (errorData: any) => {
  
    const errors: string[] | null =
      Array.isArray(errorData) 
        ? errorData
        : Array.isArray(errorData?.errores) 
        ? errorData.errores
        : Array.isArray(errorData?.response?.data?.errores)
        ? errorData.response.data.errores
        : Array.isArray(errorData?.response?.data)
        ? errorData.response.data
        : null;

    if (errors) {
      return toast.error(
        <div className="space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="text-sm text-red-600 dark:text-red-400">
               {err}
            </p>
          ))}
        </div>,
        {
          duration: 6000,
        }
      );
    }

    toast.error("Ocurrió un error inesperado.");
  },
  
  success: (title: string, description?: string) => {
    toast.success(title, { description });
  },

  toastPromise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,

      success: (data) =>
        typeof messages.success === "function"
          ? messages.success(data)
          : messages.success,

      error: (err) => {
        const apiErrors =
          Array.isArray(err?.response?.data?.errores)
            ? err.response.data.errores
            : Array.isArray(err?.response?.data)
            ? err.response.data
            : null;

        if (apiErrors) return apiErrors.join("\n");

        return (
          err?.message ||
          (typeof messages.error === "function"
            ? messages.error(err)
            : messages.error)
        );
      },
    });
  },
};