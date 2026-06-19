const params = new URLSearchParams(window.location.search);
const paymentId = params.get("razorpay_payment_id");
const paymentLinkStatus = params.get("razorpay_payment_link_status");
const successfulPaymentRedirect = Boolean(paymentId) || paymentLinkStatus === "paid";

if (successfulPaymentRedirect && typeof window.fbq === "function") {
  window.fbq("track", "CompleteRegistration", {
    content_name: "Business Skool ₹99 Webinar",
    status: true,
    value: 99,
    currency: "INR"
  });
  window.fbq("track", "Purchase", {
    content_name: "Business Skool ₹99 Webinar",
    value: 99,
    currency: "INR"
  });
  window.fbq("trackCustom", "WebinarRegistrationSuccess", {
    payment_id_present: Boolean(paymentId)
  });
}

document.querySelector("#whatsapp-button")?.addEventListener("click", () => {
  if (typeof window.fbq === "function") {
    window.fbq("track", "Contact", {content_name: "Webinar WhatsApp Support"});
    window.fbq("trackCustom", "WhatsAppClick", {page: "thankyou"});
  }
});
