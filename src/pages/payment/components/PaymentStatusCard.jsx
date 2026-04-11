import React from "react";

const statusConfig = {
  success: {
    color: "text-green-600",
    bg: "bg-green-100",
    icon: "✓",
  },
  pending: {
    color: "text-orange-600",
    bg: "bg-orange-100",
    icon: "⏳",
  },
  failed: {
    color: "text-red-600",
    bg: "bg-red-100",
    icon: "✕",
  },
};

const failureReasons = {
  insufficient_funds: {
    title: "Insufficient Funds",
    message: "Your account balance is too low to complete this payment.",
    primaryAction: { label: "Try Again" },
  },

  network_error: {
    title: "Network Issue",
    message: "We couldn’t confirm your payment due to a network issue.",
    primaryAction: { label: "Retry" },
  },

  user_cancelled: {
    title: "Payment Cancelled",
    message: "You cancelled the payment process.",
    primaryAction: { label: "Try Again" },
  },

  bank_declined: {
    title: "Payment Declined",
    message: "Your bank declined this transaction.",
    primaryAction: { label: "Use Another Method" },
  },

  duplicate_payment: {
    title: "Payment Already Made",
    message: "This transaction has already been completed.",
    primaryAction: { label: "View Receipt" },
  },

  unknown_error: {
    title: "Payment Failed",
    message: "Something went wrong. Please try again.",
    primaryAction: { label: "Retry" },
  },
};

export default function PaymentStatusCard({
  status = "success",
  reason,
  amount,
  primaryAction,
  secondaryAction,
}) {
  const config = statusConfig[status];
  const failure = status === "failed" ? failureReasons[reason] : null;
  const title = failure?.title || "Transaction Successful";
  const message = failure?.message || "Payment completed successfully";
  const primary = primaryAction || failure?.primaryAction;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 text-center">
        
        {/* Icon */}
        <div className={`mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-full ${config.bg}`}>
          <span className={`text-xl font-bold ${config.color}`}>
            {config.icon}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-2">{title}</h2>

        {/* Message */}
        <p className="text-gray-500 text-sm mb-4">{message}</p>

        {/* Amount */}
        {amount && (
          <div className="text-xl font-bold mb-4">
            ₦ {amount.toLocaleString()}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 justify-center">
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-4 py-2 border rounded-md text-sm"
            >
              {secondaryAction.label}
            </button>
          )}

          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
            >
              {primaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}