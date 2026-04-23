import React from "react";

const GREEN = "#2D5A27";

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: {new Date().getFullYear()}</p>

      <div className="prose prose-sm text-gray-700 space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">1. Information We Collect</h2>
          <p>Tracky Sheets does not collect any personally identifiable information. We do not require you to create an account to download templates. We may collect anonymous usage data (such as page views) through third-party analytics tools to improve the site.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">2. Cookies</h2>
          <p>We may use cookies to improve your browsing experience. These are small text files stored on your device. You can disable cookies in your browser settings at any time without affecting your ability to download templates.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">3. Third-Party Services</h2>
          <p>Our templates link to Google Sheets. By clicking a download link, you are directed to Google's platform and are subject to Google's own Privacy Policy. We are not responsible for the data practices of third-party services.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">4. Data Security</h2>
          <p>We take reasonable precautions to protect any data processed through this site. However, no method of transmission over the internet is 100% secure.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">5. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">6. Contact</h2>
          <p>If you have any questions about this Privacy Policy, please contact us through the site.</p>
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
