// /data/lexicon.js (Stable V5.0 - Personalized)

const LEXICON = {
    // --- Drake (F-Score) Metrics ---
    DRAKE_LEXICON_WORDS: ['time', 'love', 'god', 'plan', 'city', 'team', 'real', 'yeah', 'bottom', 'top'], 
    
    // --- Frank Ocean (P-Score) Metrics ---
    OCEAN_MOTIFS: {
        CAR: 'car', COLOR: 'color', TIME: 'time', WATER: 'water',
    },
    // Used for simpler mood selection
    GOAL_MOODS: {
        SAD: 'NEGATIVE', AMBITIOUS: 'POSITIVE', NOSTALGIC: 'NEGATIVE', CONFLICT: 'NEGATIVE',
    },
    
    // --- Sentiment & Specificity ---
    SENTIMENT_WORDS: {
        NEGATIVE: ['betrayal', 'lonely', 'regret', 'stuck', 'cold', 'numb', 'hollow', 'broke', 'empty', 'crash', 'fade', 'scar', 'shame'],
        POSITIVE: ['love', 'happy', 'success', 'loyal', 'bright', 'gold', 'safe', 'warm', 'future', 'shine', 'win', 'glory', 'top'],
    },
    // Words explicitly penalized (Strict "No Abstractions" Rule)
    ABSTRACT_NOUNS: ['sadness', 'anger', 'feeling', 'passion', 'trust', 'anxiety', 'joy', 'truth'], 
    // REWARD FOR USING THESE: Includes your unique, highly specific imagery.
    CONCRETE_REPLACERS: [
        'markings', 'surface', 'spec', 'crystal', 'ozone', 'texture', 'scars', 'shadows', 'leather', 'engine', 'oil',
        'wagyu', 'toblerone', 'honeycomb', 'provolone', 'ash', 'snow', 'sauce', 'wii', 'marble', 'hoop' 
    ], 
    
    // --- Structural Targets ---
    DRAKE_TARGET_STRUCTURE: [8, 12, 8], // Chorus-Verse-Chorus line count
    FLOW_SYLLABLE_THRESHOLDS: {
        CONVERSATIONAL_MIN: 5, CONVERSATIONAL_MAX: 7, 
        TRIPLET_MIN: 9, TRIPLET_MAX: 11, 
    }
};

window.LEXICON = LEXICON;
