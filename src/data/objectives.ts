export const TRAINING_FOCUSES = [
    'Mount',
    'High Mount',
    'Back Control',
    'Half Guard Top',
    'Half Guard Bottom',
    'Leg Locks',
    'Positional Escapes',
    'Closed Guard',
    'Pinning & Leg Rides',
    'Grip Fighting',
    'Armbar',
    'Side Control Top',
    'Turtle Attack',
] as const

export type TrainingFocus = (typeof TRAINING_FOCUSES)[number]
export type OpponentSize = 'lighter' | 'similar' | 'heavier'
export type OpponentStyle = 'flexible' | 'strong' | 'explosive' | 'defensive'
export type GuardRetention = 'weak' | 'moderate' | 'strong'

export interface ObjectiveSet {
    objectives: string[]
    principle: string
    flowchartSlug: string
    watchOut?: string
}

interface ObjectiveRule {
    focus: string
    size?: OpponentSize
    style?: OpponentStyle
    guardRetention?: GuardRetention
    objectives: string[]
    principle: string
    flowchartSlug: string
    watchOut?: string
}

const RULES: ObjectiveRule[] = [
    // ── MOUNT ────────────────────────────────────────────────────────────
    {
        focus: 'Mount',
        size: 'heavier',
        style: 'strong',
        objectives: [
            'Establish kata gatame early — single chest wrap, shoulder shrug, compress the chest',
            "Stay low until breathing is restricted; don't advance to high mount prematurely",
            'When they bridge, follow the movement and roll to back control rather than resisting',
        ],
        principle: 'Kata gatame neutralises size and strength — their own shoulder compresses their airway',
        flowchartSlug: 'danaher_4x4_submissions_detailed',
        watchOut: "A heavy bridge can flip you — don't flat-back; stay hip-in and low",
    },
    {
        focus: 'Mount',
        size: 'heavier',
        style: 'explosive',
        objectives: [
            'Survive the first explosion — they will bridge hard immediately',
            'Use leg-split or leg-ride position to remove their feet from the floor before attacking',
            'After their first explosion spends itself, tighten to kata gatame or a chest wrap',
        ],
        principle: 'Let them burn energy on the first escape; then control is easier than fighting directly',
        flowchartSlug: 'new_wave_pinning_system',
        watchOut: "Don't commit to a submission before their feet are off the floor — they can bridge out",
    },
    {
        focus: 'Mount',
        size: 'heavier',
        style: 'defensive',
        objectives: [
            'Use the mounted triangle — their defensive elbows-in posture is the setup',
            'Apply shoulder pressure + cross-face to generate spine rotation until one arm crosses the centre line',
            'Be patient; the triangle threat will force them to open up for other attacks',
        ],
        principle: 'A defensive shell with tight elbows is the perfect trigger for the mounted triangle',
        flowchartSlug: 'danaher_4x4_submissions_detailed',
        watchOut: "Don't rush submission attempts before positional control is locked — they'll buck you off",
    },
    {
        focus: 'Mount',
        size: 'lighter',
        style: 'flexible',
        objectives: [
            'Target juji gatame — flexible opponents escape chokes but extend arms when threatened',
            'Advance to high mount to isolate the arm; track elbow position throughout',
            'When they posture up to defend, their elbow comes off the mat — take it immediately',
        ],
        principle: 'Flexible opponents beat chokes by contorting; juji gatame bypasses flexibility entirely',
        flowchartSlug: 'danaher_ude_gatame_master_the_move',
        watchOut: "Don't linger on rear strangle — they will escape it; commit to the armbar transition early",
    },
    {
        focus: 'Mount',
        size: 'lighter',
        style: 'explosive',
        objectives: [
            'Move to high mount immediately — lighter opponents rely on the knee-elbow escape',
            'Sliding feet to high mount kills the knee-elbow connection before they use it',
            'Rear strangle from high mount while they are still adjusting',
        ],
        principle: 'Lighter explosive partners rely on the knee-elbow escape — high mount removes the space for it',
        flowchartSlug: 'danaher_4x4_submissions_detailed',
        watchOut: 'Stay tight through all transitions; explosive lighter opponents create scrambles from every space',
    },
    {
        focus: 'Mount',
        style: 'defensive',
        objectives: [
            'Mounted triangle — defensive opponents keep elbows tight, which sets up the arm-across trigger',
            'Use cross-face and shoulder pressure to generate the arm movement across the centreline',
            'The triangle threat creates armbar opportunities when they posture up to relieve it',
        ],
        principle: "A defensive player's greatest tool (tight elbows) becomes their liability from mount",
        flowchartSlug: 'danaher_4x4_submissions_detailed',
    },
    {
        focus: 'Mount',
        size: 'similar',
        objectives: [
            'Choose kata gatame or mounted triangle based on their arm position',
            'Cross-face pressure to generate spine rotation; claw grip to keep the elbow open',
            'Advance steadily: low mount → chest wrap → high mount → submission entry',
        ],
        principle: 'Control before submission — each step up the mount hierarchy removes one escape option',
        flowchartSlug: 'danaher_4x4_submissions_detailed',
    },
    {
        focus: 'Mount',
        objectives: [
            'Establish a chest wrap or cross-face before hunting submissions',
            'Kata gatame for stronger partners; juji gatame for flexible ones; mounted triangle for defensive ones',
            'If they recover half guard, convert to back attack rather than fighting to remount',
        ],
        principle: 'Mount is not a static position — each reaction creates a different submission pathway',
        flowchartSlug: 'danaher_4x4_submissions_detailed',
    },

    // ── HIGH MOUNT ───────────────────────────────────────────────────────
    {
        focus: 'High Mount',
        style: 'flexible',
        objectives: [
            'Take juji gatame when they posture up — elbow comes off the mat as they defend',
            'Use pump-flex or elbow-pull method to thread the arm behind the spine',
            "Don't hold the rear strangle against flexible opponents — they rotate out; commit to armbar",
        ],
        principle: 'High mount entry is the same for everyone; the finishing choice depends on how they react',
        flowchartSlug: 'danaher_ude_gatame_master_the_move',
    },
    {
        focus: 'High Mount',
        objectives: [
            'Single chest wrap first — compress breathing before hunting the tap',
            'Shoulder shrug: look away, push centre line, clear arm forward',
            'Jaw trap after the shrug — hook jaw outside tricep, then lift head off the mat',
        ],
        principle: 'The universal key from high mount is lifting the head — it opens the elbow path behind the spine',
        flowchartSlug: 'danaher_4x4_submissions_detailed',
        watchOut: 'Rushing the arm without lifting the head first leaves space for hand-fighting',
    },

    // ── BACK CONTROL ─────────────────────────────────────────────────────
    {
        focus: 'Back Control',
        style: 'strong',
        objectives: [
            "Get rear strangle established before they organise hand-fighting defence",
            'Use body triangle (if available) to restrict hip movement first',
            'Flatten them to prone position — it removes bridging and limits hand-fight angle',
        ],
        principle: "Against strong opponents: strangle while they're still disorganised, not after they've settled",
        flowchartSlug: 'danaher_4x4_submissions_detailed',
        watchOut: "Two-hook chair-sit gives them too much time to hand-fight — flatten out first",
    },
    {
        focus: 'Back Control',
        style: 'flexible',
        objectives: [
            'Track their rotation — when they try to spin out of the strangle, transition to juji gatame',
            'Maintain arm control throughout; never release the arm during their rotation',
            'Dagestani handcuff collapses their posting arm and keeps them flat',
        ],
        principle: 'Flexible partners rotate to escape the strangle — use that rotation to slide into the armbar',
        flowchartSlug: 'danaher_4x4_submissions_detailed',
    },
    {
        focus: 'Back Control',
        style: 'explosive',
        objectives: [
            'Flatten to prone (rear mount) before attacking — their explosiveness needs the floor to work',
            'Reinforce single hook + diagonal chest weight to fully shelf the hips',
            'After they are flattened: Dagestani handcuff → rear naked choke sequence',
        ],
        principle: 'Explosive opponents generate power from the floor — remove that and their athleticism is neutralised',
        flowchartSlug: 'new_wave_pinning_system',
    },
    {
        focus: 'Back Control',
        style: 'defensive',
        objectives: [
            "Patient rear strangle — they'll eventually concede space to relieve pressure",
            'Use half nelson to turn them onto their back if they turtle defensively',
            'Claw grip to keep their elbow away from their body, opening the choke lane',
        ],
        principle: 'Defensive players concede the tap only when every defensive option has been removed — be systematic',
        flowchartSlug: 'danaher_4x4_submissions_detailed',
    },
    {
        focus: 'Back Control',
        objectives: [
            'Flatten to prone when possible — best control position for finishing',
            'Rear strangle primary; armbar secondary when they rotate',
            'Dagestani handcuff collapses their elbow post and opens the choke',
        ],
        principle: 'Back control should end with the opponent flattened out, not seated with two hooks',
        flowchartSlug: 'danaher_4x4_submissions_detailed',
    },

    // ── HALF GUARD TOP ───────────────────────────────────────────────────
    {
        focus: 'Half Guard Top',
        size: 'heavier',
        objectives: [
            'Win the underhook battle first — inside position is everything against a heavier partner',
            'Use bodylock to control hip distance; prevent them from reclaiming the underhook',
            'Attack the backtake via underhook rather than forcing a pass to side control',
        ],
        principle: 'Passing to side control gives a heavier opponent leverage; the back is the safer score',
        flowchartSlug: 'gordon_ryan_half_guard_passing',
        watchOut: "Don't fight their bodyweight head-on — use push-pull to redirect, not resist",
    },
    {
        focus: 'Half Guard Top',
        style: 'flexible',
        guardRetention: 'strong',
        objectives: [
            'When they hit a strong whizzer, roll through rather than resist — go with the pressure',
            'Attack the far knee tap when their outside knee is down',
            'Insert far hook when their outside knee is up — creates the backtake opportunity',
        ],
        principle: 'Strong guard retention + flexibility = roll-through is more effective than forcing a pass',
        flowchartSlug: 'gordon_ryan_half_guard_passing',
        watchOut: "Don't stalemate by resisting the whizzer — use it as an invitation to roll through",
    },
    {
        focus: 'Half Guard Top',
        style: 'explosive',
        objectives: [
            "Stay tight and take the space away — explosive partners need space to generate movement",
            'Use the cutback when they push forward hard: let pressure build, then redirect and go behind',
            'Win inside knee position to neutralise their explosion attempts',
        ],
        principle: 'Against explosive partners: reduce space, win the inside knee, use their energy against them',
        flowchartSlug: 'gordon_ryan_half_guard_passing',
    },
    {
        focus: 'Half Guard Top',
        style: 'defensive',
        objectives: [
            'Dynamic pinning: heavy cross-face + underhook combination to force movement',
            'When they resist the cross-face, switch to knee cut — the reaction creates the pass',
            'Circle to the far hip when they hold tight — movement creates the scoring opportunity',
        ],
        principle: 'Defensive players in half guard give you position for free — they just make you work for the pass',
        flowchartSlug: 'danaher_halfguard_dynamic_pinning',
    },
    {
        focus: 'Half Guard Top',
        guardRetention: 'strong',
        objectives: [
            'Use push-pull theory: when they push, pull; when they pull, push — break their base',
            'Roll-through is the answer to a committed whizzer — go with the pressure, not against it',
            'Knee tap from the far side when their outside knee is down',
        ],
        principle: 'Strong guard retention forces a wrestling match — transition to back attack rather than passing',
        flowchartSlug: 'gordon_ryan_half_guard_passing',
    },
    {
        focus: 'Half Guard Top',
        objectives: [
            'Win inside knee position before anything else',
            'Underhook vs whizzer: inside position determines whose attack works better',
            'Target backtake or knee tap as primary score rather than a straight guard pass',
        ],
        principle: 'Half guard top is a wrestling position — the best outcome is back control, not a guard pass',
        flowchartSlug: 'gordon_ryan_half_guard_passing',
    },

    // ── HALF GUARD BOTTOM ────────────────────────────────────────────────
    {
        focus: 'Half Guard Bottom',
        size: 'heavier',
        objectives: [
            'Fight for the underhook immediately — it gives direct hip control',
            "Use the whizzer only defensively; don't rely on it to control a heavier opponent",
            'Get to lower leg shift and wrestle up rather than trying to sweep from flat',
        ],
        principle: 'Against heavier top players: the underhook + lower leg shift creates a wrestling-up path',
        flowchartSlug: 'gordon_ryan_half_guard_passing',
        watchOut: "Flat on your back in half guard against a heavier opponent is a losing position — get to your side",
    },
    {
        focus: 'Half Guard Bottom',
        objectives: [
            'Get the underhook and hip to hip immediately',
            'Lower leg shift to create the sweep or come up to a wrestling position',
            'If they have the cross-face, work to underclock the arm and reclaim the underhook',
        ],
        principle: 'Half guard bottom without an underhook is just a bad side control — the underhook is the game',
        flowchartSlug: 'gordon_ryan_half_guard_passing',
    },

    // ── LEG LOCKS ────────────────────────────────────────────────────────
    {
        focus: 'Leg Locks',
        style: 'explosive',
        objectives: [
            'Enter ashi garami from scrambles and half-guard transitions — never force entries',
            'Control the knee line before applying heel pressure — explosive partners escape early cranks',
            "Inside position controls their movement; don't let them extract the leg cleanly",
        ],
        principle: 'Explosive opponents escape early heel hooks by creating space — lock the knee line first',
        flowchartSlug: 'gordon_ryan_leg_lock_system',
        watchOut: "Don't over-commit before the position is locked — they'll reverse and take yours",
    },
    {
        focus: 'Leg Locks',
        size: 'heavier',
        objectives: [
            "Use leg lock threats to create scrambles and transition to top — don't try to finish early",
            'Cross ashi garami gives better control against heavier partners who muscle out of single leg X',
            'Protect your own legs during entry — heavier partners can counter effectively',
        ],
        principle: 'Leg locks against heavier opponents are a transitional tool — use the threat, not the finish',
        flowchartSlug: 'gordon_ryan_leg_lock_system',
    },
    {
        focus: 'Leg Locks',
        objectives: [
            'Enter ashi garami from the half guard lower-leg-shift sequence',
            "Control the hip line with inside position; don't let them step over your leg",
            'Cross ashi for control; heel hook or ankle lock depending on rule set',
        ],
        principle: 'Leg lock entries are the same as wrestling takedowns — position and timing beat strength',
        flowchartSlug: 'gordon_ryan_leg_lock_system',
    },

    // ── POSITIONAL ESCAPES ───────────────────────────────────────────────
    {
        focus: 'Positional Escapes',
        size: 'heavier',
        objectives: [
            'Technical hip escape over explosive bridge — bridging against a heavier opponent wastes energy',
            'Frame first, create space, then move — one movement at a time',
            'Target the knee-elbow connection to build a useful frame before escaping',
        ],
        principle: 'Against heavier partners, technical timing beats explosive effort — conserve energy',
        flowchartSlug: 'danaher_positional_escapes',
        watchOut: "Don't bridge flat against heavier opponents — you will lose that exchange every time",
    },
    {
        focus: 'Positional Escapes',
        style: 'explosive',
        objectives: [
            "Wait for their movement to create your escape — don't fight against their explosions",
            'When they switch pressure during an attack, use that moment to hip escape',
            'Defensive framing and elbow-knee connection during their attacks, not before',
        ],
        principle: 'Explosive top players create their own scrambles — learn to read and capitalise on their movement',
        flowchartSlug: 'danaher_positional_escapes',
    },
    {
        focus: 'Positional Escapes',
        style: 'defensive',
        objectives: [
            'Create movement through selective bridging — force their reaction, then make your technical escape',
            "Don't try to escape in a single movement; two-step: create reaction, then escape",
            'Guard recovery before trying to sweep — position first',
        ],
        principle: 'Defensive top players give you less scramble opportunity — generate the scramble yourself',
        flowchartSlug: 'danaher_positional_escapes',
    },
    {
        focus: 'Positional Escapes',
        objectives: [
            'Frame, hip escape, recover guard — in that order, not all at once',
            'Bridge to create reaction; hip escape to create space; frame to prevent them following',
            'Escape to guard recovery first; sweep is secondary',
        ],
        principle: 'Positional escapes are sequential — rushing the sequence means losing the escape',
        flowchartSlug: 'danaher_positional_escapes',
    },

    // ── CLOSED GUARD ─────────────────────────────────────────────────────
    {
        focus: 'Closed Guard',
        size: 'heavier',
        style: 'strong',
        objectives: [
            "Use the scissor sweep threat to create openings — don't fight statically for submissions",
            'When they post arm to stop the sweep: kimura; when they drive forward: triangle',
            'Maintain collar grip throughout to prevent posture breaks',
        ],
        principle: 'Against heavier, stronger opponents in guard: movement and transitions beat static attacks',
        flowchartSlug: 'forgotten_sweep_flowchart',
        watchOut: "Don't try to hold a heavier opponent down with arm strength — use legs and collar grip",
    },
    {
        focus: 'Closed Guard',
        size: 'heavier',
        style: 'explosive',
        objectives: [
            'Control posture through collar grip before attempting any attack',
            'Scissor sweep chain: sweep → they post → kimura or triangle based on their reaction',
            'Accept a sweep outcome over a submission — sweeps are the win against explosive guard passers',
        ],
        principle: 'Explosive partners break guard to pass — collar grip control slows this down significantly',
        flowchartSlug: 'forgotten_sweep_flowchart',
    },
    {
        focus: 'Closed Guard',
        objectives: [
            'Establish grips (collar + sleeve) before loading the sweep',
            'Scissor sweep: drop, chop, hook climb — commit fully to the sweep',
            'Each reaction (hand-post, backstep, head spear) has a counter in the chain',
        ],
        principle: 'The scissor sweep system works best as a chain of threats — each counter leads to the next attack',
        flowchartSlug: 'forgotten_sweep_flowchart',
    },

    // ── PINNING & LEG RIDES ──────────────────────────────────────────────
    {
        focus: 'Pinning & Leg Rides',
        size: 'heavier',
        objectives: [
            "Split the legs to prevent their feet from reaching the floor — no floor contact = no bridging",
            'Use the single-leg shelf (reinforced hook) as the strongest control position',
            "Don't rush past the legs to side control — control on the legs is superior",
        ],
        principle: "Heavier partners generate power from the floor — the leg split removes that foundation entirely",
        flowchartSlug: 'new_wave_pinning_system',
        watchOut: "Side control lets them put feet to floor and bridge — stay on the legs",
    },
    {
        focus: 'Pinning & Leg Rides',
        style: 'explosive',
        objectives: [
            "Surf the legs as they move — follow their movement, don't fight it",
            'Two legs on is always better than one; ride both knees when possible',
            'Cross-face after their explosion to prevent them building height on the elbow post',
        ],
        principle: 'Leg surfing converts their explosiveness into wasted energy — they tire themselves out',
        flowchartSlug: 'new_wave_pinning_system',
    },
    {
        focus: 'Pinning & Leg Rides',
        objectives: [
            'Core four controls: split, ride, turk, shelf — use each based on their movement',
            'Upper body tools follow lower body control: cross-face → claw → open elbow → Dagestani handcuff',
            'The goal is the flattened-out rear mount — work toward it systematically',
        ],
        principle: 'Control before submission: pin the lower half first, then remove upper body options one by one',
        flowchartSlug: 'new_wave_pinning_system',
    },

    // ── GRIP FIGHTING ────────────────────────────────────────────────────
    {
        focus: 'Grip Fighting',
        style: 'strong',
        objectives: [
            "Win outside collar position before anything else — don't fight their grip directly",
            "Break their grips first, then establish yours — never build on top of their grips",
            "Use kuzushi (off-balancing) as the primary weapon; don't fight strength with strength",
        ],
        principle: 'Against strong grip fighters: breaking > establishing — control the process, not the result',
        flowchartSlug: 'grip_fighting_kuzushi_system',
        watchOut: "Fighting for grips against a stronger opponent without breaking theirs first will exhaust you",
    },
    {
        focus: 'Grip Fighting',
        style: 'defensive',
        objectives: [
            'Constant small off-balance (kuzushi) to prevent them from settling into a stable grip',
            'Feint grip attempts to get them to react, then establish the grip you actually want',
            "Force reactive grip-fighting — don't let them dictate the exchange",
        ],
        principle: 'Defensive grip fighters want a static battle — constant kuzushi prevents them from ever settling',
        flowchartSlug: 'grip_fighting_kuzushi_system',
    },
    {
        focus: 'Grip Fighting',
        objectives: [
            'Break before building — clear their grips before working on your own',
            'Inside collar position is the priority; outside collar controls the distance',
            'Constant off-balance (kuzushi) to disrupt their grip attempts and create your entries',
        ],
        principle: 'Grip fighting is about sequencing: clear their grips, establish yours, then off-balance and attack',
        flowchartSlug: 'grip_fighting_kuzushi_system',
    },

    // ── ARMBAR ────────────────────────────────────────────────────────────
    {
        focus: 'Armbar',
        style: 'flexible',
        objectives: [
            "Don't stall on the high mount — enter juji gatame before they adapt to the position",
            'Pump flex or elbow pull to get the arm behind the spine — lift the head first',
            'Hold the arm tight to your chest when finishing — flexible opponents can recover grip',
        ],
        principle: 'Flexible opponents adapt quickly to armbar setups — entry speed matters as much as mechanics',
        flowchartSlug: 'danaher_ude_gatame_master_the_move',
    },
    {
        focus: 'Armbar',
        style: 'strong',
        objectives: [
            'Lift the head off the mat first — this removes their ability to post and resist the extension',
            'Elbow-pull method against strong opponents — gives more mechanical advantage than pump flex',
            "Keep hips high and rotate toward the finish — don't stall with the arm isolated",
        ],
        principle: 'Against strong opponents: the head lift removes their defensive base before you isolate the arm',
        flowchartSlug: 'danaher_ude_gatame_master_the_move',
    },
    {
        focus: 'Armbar',
        objectives: [
            'High mount entry first — single chest wrap, shoulder shrug, jaw trap',
            'Lift the head off the mat — pump flex or elbow pull to thread arm behind spine',
            'Rotate hips toward the arm line and extend — slow and controlled beats explosive',
        ],
        principle: 'Juji gatame from mount is a sequential lock — each step closes one escape route',
        flowchartSlug: 'danaher_ude_gatame_master_the_move',
    },

    // ── SIDE CONTROL TOP ─────────────────────────────────────────────────
    {
        focus: 'Side Control Top',
        size: 'heavier',
        objectives: [
            'Move immediately to leg control — side control alone lets heavier partners put feet to floor',
            'Transition to north-south or mount rather than sitting in side control',
            'When they hip escape, follow to leg ride position rather than chasing the re-pass',
        ],
        principle: 'Side control on a heavier opponent is a transit point, not a destination — keep moving',
        flowchartSlug: 'new_wave_pinning_system',
    },
    {
        focus: 'Side Control Top',
        objectives: [
            'Cross-face and underhook to pin; then transition toward mount or north-south',
            'When they hip escape, move to leg ride rather than chasing the re-pass',
            "Side control is a transition — score the points but don't stall here",
        ],
        principle: 'Side control is rewarded by points but outclassed in control by mount and leg rides — transit quickly',
        flowchartSlug: 'new_wave_pinning_system',
    },

    // ── TURTLE ATTACK ─────────────────────────────────────────────────────
    {
        focus: 'Turtle Attack',
        size: 'heavier',
        objectives: [
            'Front headlock control before attempting back take — get head control first',
            'Arm drag or shoulder roll to take the back when they post their outside arm',
            "Don't try to flatten a heavier turtle by force — use direction changes to off-balance",
        ],
        principle: 'Turtle attacks rely on misdirection — force one direction, attack the other',
        flowchartSlug: 'gordon_ryan_half_guard_passing',
    },
    {
        focus: 'Turtle Attack',
        objectives: [
            'Front headlock is the primary control grip from turtle',
            'Circling to the far hip creates the back take opportunity',
            'When they post arm to stop the circle: knee tap; when they resist front headlock: roll them through',
        ],
        principle: 'Turtle is a dilemma position — every defensive reaction opens a different attack',
        flowchartSlug: 'gordon_ryan_half_guard_passing',
    },
]

export function getObjectiveSet(
    focus: string,
    partnerSize?: string | null,
    partnerStyle?: string | null,
    partnerGuardRetention?: string | null,
): ObjectiveSet {
    const matching = RULES.filter((r) => {
        if (r.focus !== focus) return false
        if (r.size && r.size !== partnerSize) return false
        if (r.style && r.style !== partnerStyle) return false
        if (r.guardRetention && r.guardRetention !== partnerGuardRetention) return false
        return true
    })

    if (matching.length === 0) {
        return {
            objectives: [
                'Focus on position before submission — establish control first',
                'Study the relevant flowchart for this position before the session',
                'Track what happens in your rounds and adjust your approach',
            ],
            principle: 'There are no shortcuts in jiu-jitsu — mastery comes from systematic practice',
            flowchartSlug: 'danaher_4x4_submissions_detailed',
        }
    }

    // Return the most specific match (most conditions specified)
    const scored = matching.map((r) => ({
        rule: r,
        score: (r.size ? 3 : 0) + (r.style ? 3 : 0) + (r.guardRetention ? 2 : 0),
    }))
    scored.sort((a, b) => b.score - a.score)
    const best = scored[0].rule

    return {
        objectives: best.objectives,
        principle: best.principle,
        flowchartSlug: best.flowchartSlug,
        watchOut: best.watchOut,
    }
}
