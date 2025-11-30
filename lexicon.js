// /data/lexicon.js (Stable V2.2)

const LEXICON = {
    // --- Drake (F-Score) Metrics ---
    DRAKE_LEXICON_WORDS: ['time', 'love', 'god', 'plan', 'city', 'team', 'real', 'yeah', 'bottom', 'top'], 
    DRAKE_PAUSE_MARKER: '[PAUSE]', 
    RHYME_ENDINGS: ['money', 'honey', 'story', 'glory', 'feeling', 'ceiling', 'got it', 'spot it'], 
    
    // --- Frank Ocean (P-Score) Metrics ---
    OCEAN_MOTIFS: {
        COLOR: ['orange', 'pink', 'white', 'gold', 'blue', 'green'], 
        VEHICLE: ['car', 'ferrari', 'nike', 'bike', 'motor', 'gas', 'wheel', 'ride', 'engine'], 
        NATURE: ['sky', 'ground', 'sun', 'tree', 'beach', 'star', 'cloud', 'wave'], 
    },
    
    // --- Sentiment & Specificity ---
    SENTIMENT_WORDS: {
        NEGATIVE: ['betrayal', 'lonely', 'sadness', 'regret', 'stuck', 'cold', 'numb', 'hollow', 'broke', 'empty', 'crash', 'fade'],
        POSITIVE: ['love', 'happy', 'success', 'loyal', 'bright', 'gold', 'safe', 'warm', 'future', 'shine'],
    },
    ABSTRACT_NOUNS: ['love', 'sadness', 'anger', 'happy', 'emotion', 'feeling', 'passion', 'regret', 'trust'],
    CONCRETE_REPLACERS: ['markings', 'surface', 'spec', 'crystal', 'ozone', 'texture', 'scars', 'shadows'],

    // --- Scoring Targets ---
    DRAKE_TARGET_STRUCTURE: [8, 12, 8],
    OCEAN_METAPHOR_TARGET: 0.25, 
};

window.LEXICON = LEXICON;
