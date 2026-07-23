import { getGoalData } from '@/actions/goals'
import { GoalManager } from './GoalManager'

export default async function GoalsPage() {
    const goalData = await getGoalData()
    return <GoalManager initialGoal={goalData} />
}
