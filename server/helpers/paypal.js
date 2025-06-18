const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AUGJB2BXh7gt7NzFJad-BBQOQy_6AnLFEHE_BUy7tukh6ClshN9avPh4yaN5mAwfDgJOHtrbwEbEov0d",
  client_secret: "EOD3v3WnyjryLqy-eBoGIpaY6XAYilNbn1v15CTfsKQ_D8ablgdwZq2ivyyW2cL0zLmr6vsRoEXvQAgd",
});

module.exports = paypal;
