// /data/lexicon.js (Stable V4.0)

const LEXICON = {
    // --- Drake (F-Score) Metrics ---
    DRAKE_LEXICON_WORDS: ['time', 'love', 'god', 'plan', 'city', 'team', 'real', 'yeah', 'bottom', 'top'], 
    
    // --- Frank Ocean (P-Score) Metrics ---
    OCEAN_MOTIFS: {
        CAR: 'car', COLOR: 'color', TIME: 'time', WATER: 'water',
    },
    // Used for simpler mood selection
    GOAL_MOODS: {
        SAD: 'betrayal', AMBITIOUS: 'success', NOSTALGIC: 'regret', CONFLICT: 'anger',
    },
    
    // --- Sentiment & Specificity ---
    SENTIMENT_WORDS: {
        // Negative words used for scoring Cohesion with SAD/NOSTALGIC/CONFLICT moods
        NEGATIVE: ['betrayal', 'lonely', 'sadness', 'regret', 'stuck', 'cold', 'numb', 'hollow', 'broke', 'empty', 'crash', 'fade', 'scar', 'shame'],
        // Positive words used for scoring Cohesion with AMBITIOUS moods
        POSITIVE: ['love', 'happy', 'success', 'loyal', 'bright', 'gold', 'safe', 'warm', 'future', 'shine', 'win', 'glory', 'top'],
    },
    ABSTRACT_NOUNS: ['sadness', 'anger', 'feeling', 'passion', 'trust', 'anxiety', 'joy', 'truth'], // Explicitly penalized
    CONCRETE_REPLACERS: ['markings', 'surface', 'spec', 'crystal', 'ozone', 'texture', 'scars', 'shadows', 'leather', 'engine', 'oil'], // Reward for using these
    
    // --- Structural Targets ---
    DRAKE_TARGET_STRUCTURE: [8, 12, 8],
    FLOW_SYLLABLE_THRESHOLDS: {
        CONVERSATIONAL_MIN: 5, CONVERSATIONAL_MAX: 7, // 5-7 syllables per line for conversational
        TRIPLET_MIN: 9, TRIPLET_MAX: 11, // 9-11 syllables per line for assumed triplet/dense flow
    }
};

window.LEXICON = LEXICON;
