const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const path = require('path');
const fs = require('fs');

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
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME, // Replace with env variable in production
        pass: process.env.EMAIL_PASSWORD, // Replace with env variable in production
      },
    });
  }

  /**
   * Sends an email using a specified template and subject.
   * - Renders the email HTML using Pug
   * - Converts HTML to plain text for email clients that don't support HTML
   */
  async send(templateName, subject) {
    const templatePath = path.join(__dirname, `../views/${templateName}.html`);
    const html = fs
      .readFileSync(templatePath, 'utf-8')
      .replace(/{{username}}/g, this.firstName)
      .replace(/{{resetLink}}/g, this.url);

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
      'resetPassword',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
}

module.exports = Email;
