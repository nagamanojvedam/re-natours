const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ').at(0);
    this.url = url;
    this.from = `Naga Manoj Vedam <${process.env.EMAIL_FROM}>`;
  }

  /**
   * Creates and returns a configured Nodemailer transport.
   * You can modify this to use different services in production (like SendGrid).
   */
  createTransport() {
    return nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'ac43acf9ed9ba3', // Replace with env variable in production
        pass: '864714206b4cf4', // Replace with env variable in production
      },
    });
  }

  /**
   * Sends an email using a specified template and subject.
   * - Renders the email HTML using Pug
   * - Converts HTML to plain text for email clients that don't support HTML
   */
  async send(templateName, subject) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${templateName}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      },
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    await this.createTransport().sendMail(mailOptions);
  }

  /**
   * Sends a welcome email using the 'welcome.pug' template.
   */
  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours family!');
  }

  /**
   * Sends a password reset email using the 'passwordReset.pug' template.
   */
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
}

module.exports = Email;
