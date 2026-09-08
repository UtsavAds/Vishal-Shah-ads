const params = new URLSearchParams(window.location.search);
const paymentId = params.get("razorpay_payment_id");
const paymentLinkId = params.get("razorpay_payment_link_id");
const paymentLinkStatus = params.get("razorpay_payment_link_status");
const paymentSignature = params.get("razorpay_signature");
const successfulPaymentRedirect = Boolean(paymentId) && paymentLinkStatus === "paid";

if (successfulPaymentRedirect && typeof window.fbq === "function") {
  const eventId = `workshop-purchase-${paymentId}`;
  const storageKey = `meta-purchase-recorded:${paymentId}`;
  let alreadyRecorded = false;

  try {
    alreadyRecorded = window.sessionStorage.getItem(storageKey) === "1";
  } catch (error) {
    alreadyRecorded = false;
  }

  const workshop = {
    content_name: "Business Skool Ahmedabad Offline Workshop",
    content_category: "Offline Workshop",
    content_ids: ["business-skool-ahmedabad-workshop-2026"],
    content_type: "product",
    num_items: 1,
    status: true,
    value: 1499,
    currency: "INR"
  };

  if (!alreadyRecorded) {
    window.fbq("track", "CompleteRegistration", workshop, {eventID: `${eventId}-registration`});
    window.fbq("track", "Purchase", workshop, {eventID: eventId});
    window.fbq("trackCustom", "WorkshopRegistrationSuccess", {
      payment_id_present: true,
      payment_link_id_present: Boolean(paymentLinkId),
      signature_present: Boolean(paymentSignature),
      workshop_city: "Ahmedabad"
    }, {eventID: `${eventId}-success`});

    try {
      window.sessionStorage.setItem(storageKey, "1");
    } catch (error) {
      // Tracking has already been queued; storage is only used to prevent refresh duplicates.
    }
  }
}
