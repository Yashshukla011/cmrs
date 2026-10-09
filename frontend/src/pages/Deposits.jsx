import RecordModule from "../components/RecordModule";

export default function Deposits() {
return (
<RecordModule
title="Bank Deposits"
endpoint="/deposits/"
fields={[
{ name: "branch", label: "Branch", required: true },
{ name: "amount", label: "Deposit Amount", type: "number", required: true },
{ name: "deposit_date", label: "Deposit Date", type: "date", required: true },
{ name: "bank_reference", label: "Bank Reference", required: true },
]}
columns={[
{ name: "id", label: "ID" },
{ name: "branch", label: "Branch" },
{ name: "amount", label: "Amount" },
{ name: "deposit_date", label: "Deposit Date" },
{ name: "bank_reference", label: "Bank Reference" },
{ name: "status", label: "Status" },
]}
/>
);
}
