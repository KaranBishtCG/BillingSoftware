import React from 'react';
import { MdDone } from 'react-icons/md';

interface Step { label: string; description: string }
interface StepIndicatorProps { currentStep: number; steps: Step[] }

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center mb-8">
      {steps.map((step, index) => {
        const num = index + 1;
        const done = currentStep > num;
        const active = currentStep === num;
        return (
          <React.Fragment key={num}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                done    ? 'bg-green-500 text-white' :
                active  ? 'bg-blue-600 text-white shadow-lg scale-110' :
                          'bg-gray-200 text-gray-500'
              }`}>
                {done ? <MdDone /> : num}
              </div>
              <div className="mt-2 text-center">
                <div className={`text-xs font-semibold ${active ? 'text-blue-600' : done ? 'text-green-600' : 'text-gray-400'}`}>
                  {step.label}
                </div>
                <div className="text-xs text-gray-400 hidden sm:block">{step.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 mb-6 transition-all duration-500 ${currentStep > num ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}