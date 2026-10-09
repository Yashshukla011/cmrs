import RecordModule from "../components/RecordModule";

export default function Settlements() {
return (
<RecordModule
title="Settlements"
endpoint="/settlements/"
fields={[
{ name: "deposit", label: "Deposit ID", required: true },
{ name: "amount", label: "Settlement Amount", type: "number", required: true },
{ name: "settlement_date", label: "Settlement Date", type: "date", required: true },
{ name: "company_account", label: "Company Account", required: true },
]}
columns={[
{ name: "id", label: "ID" },
{ name: "deposit", label: "Deposit" },
{ name: "amount", label: "Amount" },
{ name: "settlement_date", label: "Settlement Date" },
{ name: "company_account", label: "Company Account" },
{ name: "status", label: "Status" },
]}
/>
);
}
