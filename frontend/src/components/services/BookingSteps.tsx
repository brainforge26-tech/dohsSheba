'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface BookingStepsProps {
  currentStep: number; // 1, 2, 3, 4
}

const STEPS = [
  { id: 1, label: 'Select Addons' },
  { id: 2, label: 'Schedule & Time' },
  { id: 3, label: 'Address & Notes' },
  { id: 4, label: 'Summary & Payment' },
];

export function BookingSteps({ currentStep }: BookingStepsProps) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between max-w-2xl mx-auto relative">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : isCurrent
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-lg scale-110'
                    : 'bg-card border-2 border-border text-muted-foreground'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <span
                className={`text-[11px] font-bold hidden sm:block ${
                  isCurrent ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
