export function formatError(response) {
  if (response?.data) {
    const { data, errors, title, message, error } = response;

    if (error) {
      return Object.values(error).join(" ");
    }

    if (data) {
      if (data?.message) {
        return data?.message;
      }
      return Object.values(data).join(" ");
    }

    if (errors) {
      return errors;
    }
    if (message) {
      return message;
    }

    return title;
  }
}
