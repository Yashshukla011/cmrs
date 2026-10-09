
import { useEffect, useState } from "react";
import "./ModulePage.css";
const API = "http://127.0.0.1:8000/api";

const MODULES = {
  "/customers/": {
    createTitle: "Add Customer",
    fields: [
      { name: "customer_id", label: "Customer ID", required: true },
      { name: "full_name", label: "Full Name", required: true },
      { name: "phone", label: "Phone", required: true },
      { name: "email", label: "Email", type: "email" },
      { name: "address", label: "Address", required: true },
      { name: "branch", label: "Branch ID", type: "number", required: true },
    ],
  },
  "/loans/": {
    createTitle: "Create Loan",
    fields: [
      { name: "loan_number", label: "Loan Number", required: true },
      { name: "customer", label: "Customer", type: "customer", required: true },
      { name: "principal_amount", label: "Principal Amount", type: "number", required: true },
      { name: "interest_rate", label: "Interest Rate (%)", type: "number", required: true, defaultValue: "0" },
      { name: "tenure_months", label: "Tenure (Months)", type: "number", required: true },
      { name: "outstanding_balance", label: "Outstanding Balance", type: "number", required: true },
      { name: "status", label: "Status", type: "select", options: ["ACTIVE", "CLOSED", "DEFAULTED"], defaultValue: "ACTIVE" },
      { name: "issued_at", label: "Issued Date", type: "date", required: true },
    ],
  },
  
"/collections/": {
  createTitle: "Record Cash Collection",
  fields: [
    {
      name: "receipt_number",
      label: "Receipt Number",
      required: true,
    },
    {
      name: "branch",
      label: "Branch ID",
      type: "number",
      required: true,
    },
    {
      name: "customer",
      label: "Customer",
      type: "customer",
      required: true,
    },
    {
      name: "agent",
      label: "Agent ID",
      type: "number",
      required: true,
    },
    {
      name: "loan",
      label: "Loan ID",
      type: "number",
    },
    {
      name: "amount",
      label: "Collected Amount",
      type: "number",
      required: true,
    },
    {
      name: "payment_mode",
      label: "Payment Mode",
      type: "select",
      options: ["CASH", "UPI", "BANK_TRANSFER", "CHEQUE"],
      required: true,
      defaultValue: "CASH",
    },
    {
      name: "collected_at",
      label: "Collection Date",
      type: "date",
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["COLLECTED", "PENDING", "RECONCILED"],
      defaultValue: "COLLECTED",
    },
  ],
},
"/reconciliation/": {
  createTitle: "Record Reconciliation",
  fields: [
    {
      name: "reconciliation_date",
      label: "Reconciliation Date",
      type: "date",
      required: true,
    },
    {
      name: "branch",
      label: "Branch ID",
      type: "number",
      required: true,
    },
    {
      name: "expected_amount",
      label: "Expected Amount",
      type: "number",
      required: true,
    },
    {
      name: "actual_amount",
      label: "Actual Amount",
      type: "number",
      required: true,
    },
  ],
},

"/deposits/": {
  createTitle: "Record Deposit",
  fields: [
    {
      name: "deposit_number",
      label: "Deposit Number",
      required: true,
    },
    {
      name: "deposit_type",
      label: "Deposit Type",
      type: "select",
      options: ["BRANCH", "BANK"],
      defaultValue: "BRANCH",
      required: true,
    },
    {
      name: "branch",
      label: "Branch ID",
      type: "number",
      required: true,
    },
    {
      name: "amount",
      label: "Deposit Amount",
      type: "number",
      required: true,
    },
    {
      name: "deposit_reference",
      label: "Bank Deposit Reference",
      required: false,
    },
    {
      name: "notes",
      label: "Notes",
      required: false,
    },
  ],
},
"/settlements/": {
  createTitle: "Record Settlement",
  fields: [
    {
      name: "settlement_reference",
      label: "Settlement Reference",
      required: true,
    },
    {
      name: "bank_deposit",
      label: "Bank Deposit ID",
      type: "number",
      required: true,
    },
    {
      name: "amount",
      label: "Settlement Amount",
      type: "number",
      required: true,
    },
    {
      name: "settlement_date",
      label: "Settlement Date",
      type: "date",
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["PENDING"],
      defaultValue: "PENDING",
      required: true,
    },
  ],
},
};

function getInitialValues(fields) {
  return Object.fromEntries(
    fields.map((field) => [
      field.name,
      field.defaultValue ??
        (field.type === "date"
          ? new Date().toISOString().slice(0, 10)
          : ""),
    ])
  );
}

function getErrorMessage(result, status) {
  if (result && typeof result === "object") {
    return Object.entries(result)
      .map(([key, value]) => {
        const message =
          typeof value === "object"
            ? JSON.stringify(value)
            : String(value);
        return `${key}: ${message}`;
      })
      .join(" | ") || `Request failed (${status})`;
  }
  return `Request failed (${status})`;
}

export default function ModulePage({ title, endpoint, description }) {
  const config = MODULES[endpoint];
  const fields = config?.fields ?? [];

  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(() => getInitialValues(fields));
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function request(url, options = {}) {
    const token = localStorage.getItem("access");

    const response = await fetch(`${API}${url}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(getErrorMessage(result, response.status));
    }

    return result;
  }

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const result = await request(endpoint);
      setData(Array.isArray(result) ? result : result.results ?? []);
    } catch (err) {
      setError(err.message || "Unable to load records.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [endpoint]);

  useEffect(() => {
    if (!fields.some((field) => field.type === "customer")) return;

    request("/customers/")
      .then((result) => {
        setCustomers(
          Array.isArray(result) ? result : result.results ?? []
        );
      })
      .catch((err) => setError(err.message));
  }, [endpoint]);

  useEffect(() => {
    setForm(getInitialValues(fields));
    setShowForm(false);
    setSuccess("");
  }, [endpoint]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "principal_amount" &&
      previous.outstanding_balance === ""
        ? { outstanding_balance: value }
        : {}),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {};

      for (const field of fields) {
        const value = form[field.name];

        if (value === "" || value === undefined) continue;

        payload[field.name] =
          field.type === "number" || field.type === "customer"
            ? Number(value)
            : value;
      }

      await request(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSuccess(`${title} record created successfully.`);
      setForm(getInitialValues(fields));
      setShowForm(false);
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to save record.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="module-page">
      <div className="module-heading">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        {config && (
          <button
            className="btn-primary"
            type="button"
            onClick={() => {
              setShowForm((value) => !value);
              setError("");
              setSuccess("");
            }}
          >
            {showForm ? "Cancel" : `+ ${config.createTitle}`}
          </button>
        )}
      </div>

      {success && <div className="module-success">{success}</div>}
      {error && <div className="module-error" role="alert">{error}</div>}

      {showForm && config && (
        <form className="module-form" onSubmit={handleSubmit}>
          <h2>{config.createTitle}</h2>

          <div className="module-form-grid">
            {fields.map((field) => (
              <label className="module-field" key={field.name}>
                <span>
                  {field.label}
                  {field.required && <span className="required-mark"> *</span>}
                </span>

                {field.type === "customer" ? (
                  <select
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    required={field.required}
                  >
                    <option value="">Select customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.full_name || customer.name || customer.customer_id}
                        {" "}— ID: {customer.id}
                      </option>
                    ))}
                  </select>
                ) : field.type === "select" ? (
                  <select
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    min={field.type === "number" ? "0" : undefined}
                    step={field.type === "number" ? "0.01" : undefined}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </label>
            ))}
          </div>

          <div className="module-form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button className="btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Record"}
            </button>
          </div>
        </form>
      )}

      <div className="module-table-card">
        <div className="module-table-title">
          <h2>{title} Records</h2>
          <button
            className="btn-secondary"
            type="button"
            onClick={loadData}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="module-message">Loading records...</p>
        ) : data.length === 0 ? (
          <p className="module-message">No records found.</p>
        ) : (
          <div className="module-table-wrapper">
            <table className="module-table">
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th key={key}>{key.replaceAll("_", " ")}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.id ?? index}>
                    {Object.keys(data[0]).map((key) => (
                      <td key={key}>
                        {item[key] !== null && typeof item[key] === "object"
                          ? JSON.stringify(item[key])
                          : String(item[key] ?? "-")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}