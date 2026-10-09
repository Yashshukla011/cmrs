const BASE_URL = "http://127.0.0.1:8000/api";

async function request(method, endpoint, body = null) {
const token =
localStorage.getItem("access_token") ||
localStorage.getItem("access") ||
localStorage.getItem("token");

const headers = {
"Content-Type": "application/json",
};

if (token) {
headers.Authorization = `Bearer ${token}`;
}

const response = await fetch(`${BASE_URL}${endpoint}`, {
method,
headers,
...(body !== null ? { body: JSON.stringify(body) } : {}),
});

const data = await response.json().catch(() => ({}));

if (!response.ok) {
const error = new Error(
data.detail || data.message || `Request failed: ${response.status}`
);
error.response = {
status: response.status,
data,
};
throw error;
}

return { data };
}

const api = {
get: (endpoint) => request("GET", endpoint),
post: (endpoint, body) => request("POST", endpoint, body),
put: (endpoint, body) => request("PUT", endpoint, body),
patch: (endpoint, body) => request("PATCH", endpoint, body),
delete: (endpoint) => request("DELETE", endpoint),
};

export default api;
