export interface KPIMetricDef {
    value: string
    label: string
    period: 'monthly' | 'per_10_rounds'
    unit: string
    higherIsBetter: boolean
    needsFocus: boolean
    description: string
}

export const KPI_METRICS: KPIMetricDef[] = [
    {
        value: 'sessions_on_focus',
        label: 'Sessions on this focus',
        period: 'monthly',
        unit: 'sessions / month',
        higherIsBetter: true,
        needsFocus: true,
        description: 'How many sessions per month you work on this specific position',
    },
    {
        value: 'win_rate_on_focus',
        label: 'Win rate (focus sessions)',
        period: 'monthly',
        unit: '% this month',
        higherIsBetter: true,
        needsFocus: true,
        description: 'Your win rate in sessions where this was the training focus',
    },
    {
        value: 'win_rate',
        label: 'Overall win rate',
        period: 'monthly',
        unit: '% this month',
        higherIsBetter: true,
        needsFocus: false,
        description: 'Your overall win rate across all rounds this month',
    },
    {
        value: 'guard_passes',
        label: 'Guard passes (top)',
        period: 'per_10_rounds',
        unit: 'per 10 rounds',
        higherIsBetter: true,
        needsFocus: false,
        description: 'Average guard passes from top position per 10 rounds (last 30 rounds)',
    },
    {
        value: 'sweeps',
        label: 'Sweeps (bottom)',
        period: 'per_10_rounds',
        unit: 'per 10 rounds',
        higherIsBetter: true,
        needsFocus: false,
        description: 'Average sweeps from bottom per 10 rounds (last 30 rounds)',
    },
    {
        value: 'submissions_for',
        label: 'Submissions completed',
        period: 'per_10_rounds',
        unit: 'per 10 rounds',
        higherIsBetter: true,
        needsFocus: false,
        description: 'Average submissions you finish per 10 rounds (last 30 rounds)',
    },
    {
        value: 'submissions_against',
        label: 'Times submitted',
        period: 'per_10_rounds',
        unit: 'per 10 rounds',
        higherIsBetter: false,
        needsFocus: false,
        description: 'Average times you get submitted per 10 rounds — lower is better',
    },
    {
        value: 'custom',
        label: 'Custom (manual entry)',
        period: 'monthly',
        unit: '',
        higherIsBetter: true,
        needsFocus: false,
        description: 'A custom metric you track and update manually',
    },
]

export function getMetricDef(value: string): KPIMetricDef | undefined {
    return KPI_METRICS.find((m) => m.value === value)
}

export const PRIORITY_LABELS: Record<number, string> = {
    1: 'High',
    2: 'Medium',
    3: 'Low',
}

export const PRIORITY_COLORS: Record<number, string> = {
    1: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
    2: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
    3: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
}
