import { loadConnectAndInitialize } from "@stripe/connect-js";

const fetchClientSecret = async () => {
  // Fetch the AccountSession client secret
  const response = await fetch("/payments", { method: "POST" });
  if (!response.ok) {
    // Handle errors on the client side here
    const { error } = await response.json();
    console.log("An error occurred: ", error);
    document.querySelector("#container").setAttribute("hidden", "");
    document.querySelector("#error").removeAttribute("hidden");
    return undefined;
  } else {
    const { client_secret: clientSecret } = await response.json();
    document.querySelector("#container").removeAttribute("hidden");
    document.querySelector("#error").setAttribute("hidden", "");
    return clientSecret;
  }
};

const instance = loadConnectAndInitialize({
  // This is your test publishable API key.
  publishableKey:
    "pk_test_51H5GkKGKxADnLRPP5lo1mVj941HQlMGlclWWlZ0G5sN9XsU162PRKz3vYG3585asb1Z6Hpy5caHpmFpmZ3QN1Wp500gXc017ZA",
  fetchClientSecret: fetchClientSecret,
  appearance: {
    overlays: "dialog",
    variables: {
      colorPrimary: "#625afa",
    },
  },
});
const container = document.getElementById("container");
const paymentsComponent = instance.create("payments");
container.appendChild(paymentsComponent);
