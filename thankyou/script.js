const params = new URLSearchParams(window.location.search);
const paymentId = params.get("razorpay_payment_id");
const paymentLinkStatus = params.get("razorpay_payment_link_status");
const successfulPaymentRedirect = Boolean(paymentId) || paymentLinkStatus === "paid";

if (successfulPaymentRedirect && typeof window.fbq === "function") {
  const workshop = {
    content_name: "Business Skool Ahmedabad Offline Workshop",
    content_category: "Offline Workshop",
    status: true,
    value: 1499,
    currency: "INR"
  };

  window.fbq("track", "CompleteRegistration", workshop);
  window.fbq("track", "Purchase", workshop);
  window.fbq("trackCustom", "WorkshopRegistrationSuccess", {
    payment_id_present: Boolean(paymentId),
    workshop_city: "Ahmedabad"
  });
}
