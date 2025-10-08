import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';


const TermsOfServiceModal = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-lg border border-border w-full max-w-2xl max-h-[80vh] modal-shadow">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Terms of Service</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-muted transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="prose prose-sm max-w-none text-foreground space-y-4">
            <p className="text-muted-foreground">
              Last updated: January 2025
            </p>

            <section>
              <h3 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h3>
              <p>
                By creating an account with EduFinance, you agree to be bound by these Terms of Service 
                and our Privacy Policy. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">2. Service Description</h3>
              <p>
                EduFinance provides educational financial management tools including student enrollment, 
                fee collection, payment tracking, and financial reporting for educational institutions.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">3. Account Responsibilities</h3>
              <p>
                You are responsible for maintaining the security of your account credentials and for all 
                activities that occur under your account. You must notify us immediately of any unauthorized use.
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Provide accurate and complete registration information</li>
                <li>Keep your login credentials secure and confidential</li>
                <li>Use the service only for legitimate educational purposes</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">4. Data Privacy and Security</h3>
              <p>
                We take data privacy seriously and implement industry-standard security measures to protect 
                your information. Please review our Privacy Policy for details on how we collect, use, and 
                protect your data.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">5. Payment and Billing</h3>
              <p>
                Our services may include paid features. All payments are processed securely through our 
                authorized payment providers. Billing terms will be clearly communicated before any charges.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">6. Prohibited Uses</h3>
              <p>You agree not to use EduFinance for:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Fraudulent or illegal activities</li>
                <li>Violating any laws or regulations</li>
                <li>Interfering with or disrupting the service</li>
                <li>Attempting to gain unauthorized access to systems</li>
                <li>Uploading malicious software or content</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">7. Service Availability</h3>
              <p>
                While we strive for 99.9% uptime, we do not guarantee uninterrupted service availability. 
                We may perform maintenance that could temporarily affect service access.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">8. Termination</h3>
              <p>
                You may terminate your account at any time. We reserve the right to suspend or terminate 
                accounts that violate these terms or for other legitimate reasons.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">9. Changes to Terms</h3>
              <p>
                We may update these Terms of Service from time to time. We will notify users of material 
                changes via email or through the platform. Continued use constitutes acceptance of new terms.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">10. Contact Information</h3>
              <p>
                If you have questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-2 text-sm">
                <p>Email: support@edufinance.com</p>
                <p>Phone: +234 (0) 123 456 7890</p>
                <p>Address: Lagos, Nigeria</p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onAccept}>
            Accept Terms
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceModal;