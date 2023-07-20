const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailUsingSendgrid = async (recipientEmail, recipientName) => {
  const msg = {
    to: recipient,
    from: {
      name: "FIFO",
      email: process.env.SEND_EMAIL,
    },
    subject: "Welcome to FIFO.",
    text: `Hello ${recipientName}, Explore expert insights on latest technology innovations from FIFO.`,
    html: `<strong>Hello ${recipientName}, Explore expert insights on latest technology innovations from FIFO.</strong>`,
  };

  return sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = sendEmailUsingSendgrid;
