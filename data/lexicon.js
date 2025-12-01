// /data/lexicon.js (Stable V4.1)

const LEXICON = {
    // --- Drake (F-Score) Metrics ---
    DRAKE_LEXICON_WORDS: ['time', 'love', 'god', 'plan', 'city', 'team', 'real', 'yeah', 'bottom', 'top'], 
    
    // --- Frank Ocean (P-Score) Metrics ---
    OCEAN_MOTIFS: {
        CAR: 'car', COLOR: 'color', TIME: 'time', WATER: 'water',
    },
    // Used for simpler mood selection: Mapped to NEGATIVE or POSITIVE keys
    GOAL_MOODS: {
        SAD: 'NEGATIVE', AMBITIOUS: 'POSITIVE', NOSTALGIC: 'NEGATIVE', CONFLICT: 'NEGATIVE',
    },
    
    // --- Sentiment & Specificity ---
    SENTIMENT_WORDS: {
        // NEGATIVE words used for scoring Cohesion with SAD/NOSTALGIC/CONFLICT moods
        NEGATIVE: ['betrayal', 'lonely', 'regret', 'stuck', 'cold', 'numb', 'hollow', 'broke', 'empty', 'crash', 'fade', 'scar', 'shame'],
        // POSITIVE words used for scoring Cohesion with AMBITIOUS moods
        POSITIVE: ['love', 'happy', 'success', 'loyal', 'bright', 'gold', 'safe', 'warm', 'future', 'shine', 'win', 'glory', 'top'],
    },
    // Words explicitly penalized (Strict "No Abstractions" Rule)
    ABSTRACT_NOUNS: ['sadness', 'anger', 'feeling', 'passion', 'trust', 'anxiety', 'joy', 'truth'], 
    // Reward for using these specific, tangible nouns (Concrete Replacers)
    CONCRETE_REPLACERS: ['markings', 'surface', 'spec', 'crystal', 'ozone', 'texture', 'scars', 'shadows', 'leather', 'engine', 'oil'], 
    
    // --- Structural Targets ---
    DRAKE_TARGET_STRUCTURE: [8, 12, 8], // Chorus-Verse-Chorus line count
    FLOW_SYLLABLE_THRESHOLDS: {
        CONVERSATIONAL_MIN: 5, CONVERSATIONAL_MAX: 7, // Syl/Line for Conversational flow
        TRIPLET_MIN: 9, TRIPLET_MAX: 11, // Syl/Line for assumed Triplet/Dense flow
    }
};

window.LEXICON = LEXICON;

