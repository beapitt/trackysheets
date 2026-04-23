import React from "react";

const GREEN = "#2D5A27";

export default function Disclaimer() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Disclaimer</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: {new Date().getFullYear()}</p>

      <div className="prose prose-sm text-gray-700 space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">1. General Information Only</h2>
          <p>The spreadsheet templates and content provided on Tracky Sheets are for general informational and productivity purposes only. Nothing on this site constitutes financial, legal, accounting, or professional advice.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">2. No Professional Advice</h2>
          <p>Templates related to finance, budgeting, invoicing, or legal matters are provided as tools to help you organize information. They are not a substitute for advice from a qualified professional. Always consult a licensed accountant, financial advisor, or attorney for matters specific to your situation.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">3. Accuracy of Information</h2>
          <p>While we strive to keep our templates accurate and up to date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, or suitability of the templates for any purpose.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">4. External Links</h2>
          <p>Our site links to Google Sheets and other third-party platforms. We have no control over the content or availability of those sites and are not responsible for any loss or damage that may arise from your use of them.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">5. Use at Your Own Risk</h2>
          <p>Your use of any template from Tracky Sheets is entirely at your own risk. Tracky Sheets and its contributors shall not be held liable for any errors, omissions, or outcomes resulting from the use of these templates.</p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200">
        <a href="/" style={{ color: GREEN }} className="text-sm font-medium hover:underline">
          ← Back to Home
        </a>
      </div>
    </div>
  );
}
