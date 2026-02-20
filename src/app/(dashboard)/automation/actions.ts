"use server"

// Automation Intelligence Layer

export async function getAutomationSequences() {
    // Mocking orchestration delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    return [
        {
            id: 's1',
            name: 'Visionary Onboarding Orbit',
            status: 'Optimized',
            steps: 5,
            activeContacts: 1420,
            avgConversion: '12.4%',
            lastOptimization: '24h ago'
        },
        {
            id: 's2',
            name: 'Churn Risk Reactivation',
            status: 'Needs Improvement',
            steps: 3,
            activeContacts: 450,
            avgConversion: '4.2%',
            lastOptimization: '3d ago'
        },
        {
            id: 's3',
            name: 'Post-Purchase Upsell',
            status: 'Stable',
            steps: 4,
            activeContacts: 890,
            avgConversion: '18.8%',
            lastOptimization: '1w ago'
        }
    ];
}

export async function getSequenceFlow(sequenceId: string) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return [
        { id: '1', type: 'trigger', label: 'User Joined "SaaS Founder" Segment', status: 'active' },
        { id: '2', type: 'email', label: 'Welcome to the Future', performance: '45% Open / 12% Click', status: 'optimized', delay: 'Instant' },
        { id: '3', type: 'wait', label: 'Wait for 2 Days', status: 'stable' },
        { id: '4', type: 'condition', label: 'If Clicked "Activate"', status: 'active' },
        { id: '5', type: 'email', label: 'Tactical Setup Guide', performance: '38% Open / 8% Click', status: 'needs_work', delay: 'Instant' },
    ];
}

export async function getRetargetingInsights() {
    await new Promise(resolve => setTimeout(resolve, 1800));

    return [
        {
            id: 'r1',
            segment: 'Hyper-Engaged Founders',
            reason: 'High click resonance on "Visionary" content',
            predictedUplift: '+14% Conversion',
            action: 'Deploy VIP Upsell Sequence'
        },
        {
            id: 'r2',
            segment: 'Saturated Enterprise',
            reason: 'High unsubscribe risk detected (90-day peak)',
            predictedUplift: '-8% Churn Risk',
            action: 'Switch to Low-Frequency Value Digest'
        }
    ];
}

export async function optimizeSequenceOrder(sequenceId: string) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
        suggestedOrder: ['1', '2', '3', '5', '4'],
        reasoning: 'Reordering "Tactical Setup" before condition check improves early resonance by 12%.',
        predictedUplift: '+6.8% Sequence Completion'
    };
}
