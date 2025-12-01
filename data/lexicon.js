// /data/lexicon.js (Stable V4.0)
const LEXICON = {
//--- Drake (F-Score) Metrics
一ーー
DRAKE_LEXICON_WORDS: ['time'
" 'love'
'god', 'plan', 'city', 'team',
'real', 'yeah',
'bottom'
,'top'1,
// --- Frank Ocean (P-Score) Metrics ---
OCEAN_MOTIFS: {
CAR: 'car', COLOR: 'color'
• TIME:
'time', WATER: 'water',
// Used for simpler mood selection
GOAL_MOODS: {
SAD: 'betrayal', AMBITIOUS: 'success'
NOSTALGIC: 'regret', CONFLICT: 'anger'
}.
// --- Sentiment & Specificity ---
SENTIMENT
_WORDS : {
I Negative words used for scoring
Cohesion with SAD/NOSTALGIC/CONFLICT moods
NEGATIVE: ['betrayal'
'lonely'
'stuck'
'sadness"" bregee, 'empty", 'crash',
'hollow'
'cold"
'numb',
'fade
'scar',
'shame',
\/ Positive words used for scoring
Cohesion with AMBITIOUS moods
'loyal'
POSITIVE: 'love'
, 'happy', 'success'
'bright'
'gold'
'safe
'warm'
'future
},
'shine',
'win', 'glory', 'top'l,
ABSTRACT_NOUNS: ['sadness',
'feeling', 'passion'
'trust',
'anger'
'anxiety'
'joy',
truth 1, 1/ Explicitly penalized
CONCRETE_REPLACERS: ['markings'
'surface'
'spec',
'crystal'
'ozone'
'texture'
"scars',
'shadows'
'leather'
, 'engíne, 'oil i, "l
Reward for using these
/ --- Structural Targets
DRAKE_TARGET_STRUCTURE: 18, 12, 8],
FLOW_SYLLABLE_THRESHOLDS: {
CONVERSATIONAL_MIN: 5,
CONVERSATIONAL_MAX: 7, 1/ 5-7 syllables per
line for conversational
TRIPLET_MIN: 9, TRIPLET_MAX: 11, 1/
9-11 syllables per line for assumed triplet/ dense flow
}
window.LEXICON = LEXICON;
