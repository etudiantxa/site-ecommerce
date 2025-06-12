const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AdtMk4Z3lKEnyy5pfwhHWQFz8t9A9heWV0zVhty-usYVfGxPtrLwGpgJV-Ne3vsIqNc4Gvp0_aCAIVmY",
  client_secret: "EDF6crLaj2gvWIwKeump6qzW6_s8k3yEu_4aYsElZ9v7-BxjYqsTIV9bUOi6wCJtflbA6zHxhHLSPWM8",
});

module.exports = paypal;
