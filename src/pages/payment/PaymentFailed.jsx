import { useSearchParams } from "react-router-dom";
import PaymentStatusCard from "./components/PaymentStatusCard";

export default function PaymentFailed() {
  const [params] = useSearchParams();
  const reason = params.get("reason") || "unknown_error";
  const amount = Number(params.get("amount")) || 0;

  return (
    <PaymentStatusCard
      status="failed"
      reason={reason}
      amount={amount}
      primaryAction={{
        label: "Try Again",
        onClick: () => console.log("Retry"),
      }}
      secondaryAction={{
        label: "Contact Support",
        onClick: () => console.log("Support"),
      }}
    />
  );
}