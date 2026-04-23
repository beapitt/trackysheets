import React from "react";

const GREEN = "#2D5A27";

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Use</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: {new Date().getFullYear()}</p>

      <div className="prose prose-sm text-gray-700 space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h2>
          <p>By accessing and using Tracky Sheets, you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use this site.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">2. License to Use Templates</h2>
          <p>All templates on Tracky Sheets are provided free of charge for personal and commercial use. You may download, modify, and use them in your own projects. You may not resell or redistribute the templates as your own original work without significant modification.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">3. Intellectual Property</h2>
          <p>The Tracky Sheets name, logo, and site design are the property of Tracky Sheets. The spreadsheet templates are provided for free use but remain the intellectual property of their creators.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">4. No Warranty</h2>
          <p>Templates are provided "as is" without warranty of any kind. We do not guarantee that templates are error-free, complete, or suitable for any particular purpose. Use them at your own risk.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">5. Limitation of Liability</h2>
          <p>Tracky Sheets shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use our templates or this website.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">6. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms of Use at any time. Continued use of the site after changes constitutes acceptance of the new terms.</p>
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
