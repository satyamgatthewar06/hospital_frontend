import React from 'react';
import {
    TestTube,
    Activity,
    UserPlus,
    Clock,
    Edit,
    ShieldCheck,
    CreditCard,
    FileText,
    Check
} from 'lucide-react';
import './WorkflowStepper.css';

const STEP_ICONS = {
    testMaster: TestTube,
    collection: Activity,
    assignment: UserPlus,
    processing: Clock,
    resultEntry: Edit,
    verification: ShieldCheck,
    billing: CreditCard,
    reports: FileText
};

const WorkflowStepper = ({ steps, currentStep, onStepClick, stepCompletion }) => {
    return (
        <div className="workflow-stepper">
            {steps.map((step, index) => {
                const Icon = STEP_ICONS[step.id] || TestTube;
                const isActive = index === currentStep;
                const isCompleted = stepCompletion[step.id];
                const isAccessible = index <= currentStep;

                return (
                    <div key={step.id} className="step-wrapper">
                        <div
                            className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${!isAccessible ? 'disabled' : ''}`}
                            onClick={() => isAccessible && onStepClick(index)}
                        >
                            <div className="step-number">
                                {isCompleted ? <Check size={20} /> : index + 1}
                            </div>
                            <div className="step-icon">
                                <Icon size={24} />
                            </div>
                            <div className="step-label">{step.label}</div>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`step-connector ${isCompleted ? 'completed' : ''}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default WorkflowStepper;
