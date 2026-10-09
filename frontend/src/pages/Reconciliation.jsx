import RecordModule from "../components/RecordModule";

export default function Reconciliation() {
return (
<RecordModule
title="Reconciliation"
endpoint="/reconciliation/"
fields={[
{ name: "collection", label: "Collection ID", required: true },
{ name: "deposit", label: "Deposit ID", required: true },
{ name: "expected_amount", label: "Expected Amount", type: "number", required: true },
{ name: "deposited_amount", label: "Deposited Amount", type: "number", required: true },
]}
columns={[
{ name: "id", label: "ID" },
{ name: "collection", label: "Collection" },
{ name: "deposit", label: "Deposit" },
{ name: "expected_amount", label: "Expected Amount" },
{ name: "deposited_amount", label: "Deposited Amount" },
{ name: "status", label: "Status" },
]}
/>
);
}
