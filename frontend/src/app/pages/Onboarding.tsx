import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Check } from "lucide-react";
import { cn } from "../lib/utils";

const steps = [
  "Workspace Info",
  "Communication",
  "Contact Form",
  "Booking Setup",
  "Forms",
  "Inventory",
  "Staff Invite",
  "Activation",
];

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/app/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">CO</span>
            </div>
            <span className="font-semibold text-foreground text-lg">CareOps</span>
          </div>
          <Button variant="ghost" onClick={() => navigate("/app/dashboard")}>
            Skip for now
          </Button>
        </div>

        {/* Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors",
                      index < currentStep
                        ? "bg-success border-success"
                        : index === currentStep
                        ? "bg-primary border-primary"
                        : "bg-card border-border"
                    )}
                  >
                    {index < currentStep ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <span
                        className={cn(
                          "text-sm font-medium",
                          index === currentStep ? "text-primary-foreground" : "text-muted-foreground"
                        )}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground mt-2 text-center hidden md:block">
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 mx-2 transition-colors",
                      index < currentStep ? "bg-success" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">{steps[currentStep]}</h2>
          <p className="text-muted-foreground mb-6">
            {currentStep === 0 && "Tell us about your business"}
            {currentStep === 1 && "Set up your communication channels"}
            {currentStep === 2 && "Configure your contact form"}
            {currentStep === 3 && "Set up your booking types"}
            {currentStep === 4 && "Create your custom forms"}
            {currentStep === 5 && "Add your inventory items"}
            {currentStep === 6 && "Invite your team members"}
            {currentStep === 7 && "You're all set! Ready to launch?"}
          </p>

          <div className="space-y-4">
            {currentStep === 0 && (
              <>
                <Input label="Business Name" placeholder="Acme Service Co." />
                <Input label="Industry" placeholder="e.g., Home Services" />
                <Input label="Team Size" type="number" placeholder="5" />
              </>
            )}

            {currentStep === 1 && (
              <>
                <Input label="Phone Number" placeholder="+1 (555) 000-0000" />
                <Input label="Email" type="email" placeholder="contact@company.com" />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Enable SMS Notifications
                  </label>
                  <input type="checkbox" className="rounded border-border" />
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <Input label="Form Title" placeholder="Contact Us" />
                <Input label="Success Message" placeholder="Thank you for reaching out!" />
              </>
            )}

            {currentStep === 3 && (
              <>
                <Input label="Service Name" placeholder="e.g., Home Inspection" />
                <Input label="Duration (minutes)" type="number" placeholder="60" />
                <Input label="Price" type="number" placeholder="150" />
              </>
            )}

            {currentStep === 4 && (
              <>
                <Input label="Form Name" placeholder="Pre-Service Questionnaire" />
                <Input label="Description" placeholder="Customer details form" />
              </>
            )}

            {currentStep === 5 && (
              <>
                <Input label="Item Name" placeholder="Cleaning Supplies" />
                <Input label="Quantity" type="number" placeholder="10" />
                <Input label="Low Stock Threshold" type="number" placeholder="3" />
              </>
            )}

            {currentStep === 6 && (
              <>
                <Input label="Team Member Email" type="email" placeholder="team@company.com" />
                <Input label="Role" placeholder="Technician" />
              </>
            )}

            {currentStep === 7 && (
              <div className="text-center py-8">
                <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Setup Complete!</h3>
                <p className="text-muted-foreground">
                  Your workspace is ready. Click below to start using CareOps.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0}>
              Back
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? "Go to Dashboard" : "Save & Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
