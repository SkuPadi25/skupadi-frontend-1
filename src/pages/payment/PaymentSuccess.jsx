import PaymentStatusCard from "./components/PaymentStatusCard";

export default function PaymentSuccess() {
  return (
    <PaymentStatusCard
      status="success"
      title="Transaction Successful"
      message="Your payment has been processed successfully."
      amount={60000}
      primaryAction={{
        label: "Download Receipt",
        onClick: () => console.log("Download"),
      }}
      secondaryAction={{
        label: "Share",
        onClick: () => console.log("Share"),
      }}
    />
  );
}