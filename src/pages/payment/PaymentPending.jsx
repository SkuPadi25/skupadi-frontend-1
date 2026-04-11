import PaymentStatusCard from "./components/PaymentStatusCard";

export default function PaymentPending() {
  return (
    <PaymentStatusCard
      status="pending"
      title="Transaction Pending"
      message="Your payment is being processed. Please wait..."
      amount={60000}
      primaryAction={{
        label: "Refresh Status",
        onClick: () => window.location.reload(),
      }}
    />
  );
}