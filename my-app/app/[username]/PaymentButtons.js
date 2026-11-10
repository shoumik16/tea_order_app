
"use client";

import { useState } from "react";

export default function PaymentButtons({ username }) {
  const [loading, setLoading] = useState(false);
  const [donatorName, setDonatorName] = useState("");
  const [message, setMessage] = useState("");

  async function pay(amount) {
    try {
      if (!donatorName.trim()) {
        alert("Please enter your name.");
        return;
      }

      setLoading(true);

      // Load Razorpay checkout script.
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");

          script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

          script.onload = resolve;
          script.onerror = reject;

          document.body.appendChild(script);
        });
      }

      // Create order on server.
      const response = await fetch(
        "/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            amount,
            donatorName,
            message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Order creation failed");
      }

      // Open Razorpay checkout.
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,

        name: "My Website",
        description: `Payment to ${username}`,

        order_id: data.orderId,

        handler: async function (result) {
          try {
            const verifyResponse = await fetch(
              "/api/payment/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(result),
              }
            );

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              alert("Payment successful!");
            } else {
              alert("Payment verification failed.");
            }
          } catch {
            alert("Unable to verify payment.");
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },

        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function () {
        alert("Payment failed. Please try again.");
        setLoading(false);
      });

      razorpay.open();

    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg space-y-5">

      {/* Donator Information Section */}
      <div className="bg-white border rounded-xl p-5 space-y-4">

        <h2 className="text-xl font-bold text-gray-800">
          Support {username}
        </h2>

        <div>
          <label className="block text-sm font-medium mb-2">
            Donator Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={donatorName}
            onChange={(e) => setDonatorName(e.target.value)}
            maxLength={100}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Message
          </label>

          <textarea
            placeholder="Write a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            rows={4}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

      </div>

      {/* Payment Buttons */}
      <div className="flex gap-3 flex-wrap">
        {[5, 10, 20].map((amount) => (
          <button
            key={amount}
            disabled={loading}
            onClick={() => pay(amount)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Loading..." : `Pay ₹${amount}`}
          </button>
        ))}
      </div>

    </div>
  );
}
