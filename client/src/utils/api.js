// const BASE_URL = "https://bansoswatch.okattako.site";
const BASE_URL = "http://localhost:5000";

export const fetchApi = async (
  endpoint,
  method = "GET",
  body = null,
  headers = {}
) => {
  const options = {
    method,
    headers: { "Content-Type": "application/json", ...headers },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw data;
  }

  return data;
};
