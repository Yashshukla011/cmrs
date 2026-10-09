import RecordModule from "../components/RecordModule";

export default function Collections() {
return (
<RecordModule
title="Cash Collections"
endpoint="/collections/"
fields={[
{ name: "loan", label: "Loan ID", required: true },
{ name: "agent", label: "Agent ID", required: true },
{ name: "amount", label: "Collection Amount", type: "number", required: true },
{ name: "collection_date", label: "Collection Date", type: "date", required: true },
{ name: "receipt_number", label: "Receipt Number", required: true },
]}
columns={[
{ name: "id", label: "ID" },
{ name: "loan", label: "Loan" },
{ name: "agent", label: "Agent" },
{ name: "amount", label: "Amount" },
{ name: "collection_date", label: "Date" },
{ name: "receipt_number", label: "Receipt" },
{ name: "status", label: "Status" },
]}
/>
);
}
