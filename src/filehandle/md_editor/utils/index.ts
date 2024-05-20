export const toFormData = (params: Record<string, string | Blob>, data?: FormData) => {
  data = data || new FormData();

  const strategy: Record<string, () => string | Blob> = {
    $timestamp() {
      return Date.now().toString();
    }
  };

  for (const key in params) {
    data.append(key, strategy[params[key].toString()]?.() || params[key]);
  }

  return data;
};
