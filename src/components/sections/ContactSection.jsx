import { useState } from 'react';
import CommandLine from '../terminal/CommandLine';
import TerminalOutput from '../terminal/TerminalOutput';

const WEBHOOK_URL = "https://discord.com/api/webhooks/1345817746583060520/XDfTWRU2XiKQAc5stGLFdsLxELU6Gim63Sti7E-ThVjbBO5r-n86tB8uyay7UvwRkVV3";

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'sending' | 'success' | 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const discordMessage = {
      embeds: [{
        title: "New Contact Form Submission",
        color: 16760576, // amber
        fields: [
          { name: "Name", value: formData.name || "No Name Provided", inline: true },
          { name: "Email", value: formData.email || "No Email Provided", inline: true },
          { name: "Message", value: formData.message || "No Message Provided" }
        ],
        footer: { text: "Portfolio Terminal Contact Form" },
        timestamp: new Date().toISOString()
      }]
    };

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discordMessage)
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="py-16">
      <CommandLine command="mail ethan@portfolio" />
      <TerminalOutput delay={600}>
        <div className="max-w-xl text-sm">
          <div className="mb-4" style={{ color: 'var(--terminal-comment)' }}>
            Composing new message...
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* To line (static) */}
            <div>
              <span style={{ color: 'var(--terminal-comment)' }}>To: </span>
              <span style={{ color: 'var(--terminal-fg)' }}>ethan@sirnotethan.com</span>
            </div>

            {/* Name */}
            <div className="flex items-start gap-2">
              <label
                htmlFor="contact-name"
                className="shrink-0 pt-2"
                style={{ color: 'var(--terminal-amber)' }}
              >
                name:
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="flex-1 px-3 py-2 terminal-input rounded-sm"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div className="flex items-start gap-2">
              <label
                htmlFor="contact-email"
                className="shrink-0 pt-2"
                style={{ color: 'var(--terminal-amber)' }}
              >
                email:
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="flex-1 px-3 py-2 terminal-input rounded-sm"
                placeholder="you@example.com"
              />
            </div>

            {/* Message */}
            <div className="flex items-start gap-2">
              <label
                htmlFor="contact-message"
                className="shrink-0 pt-2"
                style={{ color: 'var(--terminal-amber)' }}
              >
                message:
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="flex-1 px-3 py-2 terminal-input rounded-sm resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="px-6 py-2 rounded-sm font-bold text-sm transition-all cursor-pointer hover:opacity-90 disabled:opacity-50"
                style={{
                  background: 'var(--terminal-amber)',
                  color: '#000',
                  border: 'none'
                }}
              >
                {status === 'sending' ? '$ sending...' : '$ send --confirm'}
              </button>
            </div>

            {/* Status messages */}
            {status === 'success' && (
              <div style={{ color: 'var(--terminal-green)' }}>
                Message sent successfully. Connection closed.
              </div>
            )}
            {status === 'error' && (
              <div style={{ color: 'var(--terminal-red)' }}>
                Error: Failed to send message. Exit code 1.
              </div>
            )}
          </form>
        </div>
      </TerminalOutput>
    </section>
  );
}
