/ /data/lexicon.js (V5.0 - Semantic Intelligence Engine)

const LEXICON = {
    // ============================================
    // DRAKE PROTOCOL (F-SCORE) METRICS
    // ============================================
    
    DRAKE_LEXICON_WORDS: [
        'time', 'love', 'god', 'plan', 'city', 'team', 'real', 'yeah', 
        'bottom', 'top', 'trust', 'loyal', 'ride', 'day', 'night'
    ],
    
    // ============================================
    // OCEAN METHODOLOGY - SEMANTIC MOTIFS
    // ============================================
    
    SEMANTIC_MOTIFS: {
        CAR: {
            vehicles: ['car', 'vehicle', 'auto', 'ride', 'whip', 'coupe', 'sedan', 'suv', 
                      'truck', 'van', 'convertible', 'hatchback'],
            brands: ['porsche', 'tesla', 'toyota', 'benz', 'mercedes', 'bmw', 'audi', 
                    'honda', 'ford', 'chevy', 'dodge', 'lexus', 'acura'],
            actions: ['drive', 'drift', 'cruise', 'steer', 'brake', 'accelerate', 'park', 
                     'crash', 'rev', 'idle', 'speed', 'race', 'skid', 'swerve'],
            parts: ['engine', 'wheel', 'tire', 'brake', 'steering', 'dashboard', 'trunk', 
                   'hood', 'mirror', 'window', 'seat', 'belt', 'pedal', 'clutch'],
            roads: ['road', 'highway', 'lane', 'street', 'freeway', 'avenue', 'exit', 
                   'intersection', 'corner', 'turn', 'curve', 'straightaway'],
            states: ['fast', 'slow', 'stuck', 'moving', 'parked', 'crashed', 'racing', 
                    'stopped', 'rolling', 'coasting'],
            sensory: ['leather', 'gas', 'gasoline', 'fuel', 'oil', 'exhaust', 'smoke', 
                     'rubber', 'metal', 'chrome', 'paint', 'wax']
        },
        
        COLOR: {
            basic: ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 
                   'black', 'white', 'gray', 'grey', 'brown', 'beige', 'tan'],
            shades: ['crimson', 'scarlet', 'ruby', 'maroon', 'burgundy',
                    'navy', 'azure', 'cobalt', 'sapphire', 'turquoise', 'teal', 'cyan',
                    'lime', 'emerald', 'jade', 'olive', 'mint', 'forest', 'sage',
                    'amber', 'gold', 'golden', 'bronze', 'copper',
                    'violet', 'indigo', 'lavender', 'mauve', 'plum',
                    'coral', 'salmon', 'rose', 'magenta', 'fuchsia',
                    'ivory', 'pearl', 'cream', 'vanilla', 'beige',
                    'charcoal', 'slate', 'silver', 'platinum', 'steel',
                    'obsidian', 'onyx', 'ebony', 'ink', 'midnight'],
            objects: ['frog', 'lime', 'pistachio', 'mint', 'grass', 'leaf', 'moss',
                     'ruby', 'emerald', 'sapphire', 'diamond', 'gold', 'silver',
                     'blood', 'wine', 'cherry', 'rose', 'sunset', 'ocean', 'sky'],
            qualities: ['bright', 'dark', 'pale', 'vivid', 'faded', 'dull', 'vibrant', 
                       'muted', 'saturated', 'washed', 'bold', 'subtle', 'neon'],
            concepts: ['color', 'shade', 'hue', 'tint', 'tone', 'pigment', 'gradient', 
                      'spectrum', 'palette', 'contrast']
        },
        
        TIME: {
            units: ['second', 'minute', 'hour', 'day', 'week', 'month', 'year', 
                   'decade', 'century', 'millennium', 'moment', 'instant'],
            periods: ['morning', 'noon', 'afternoon', 'evening', 'night', 'midnight', 
                     'dawn', 'dusk', 'twilight', 'sunrise', 'sunset'],
            seasons: ['spring', 'summer', 'fall', 'autumn', 'winter', 'season'],
            concepts: ['time', 'past', 'present', 'future', 'memory', 'moment', 
                      'eternity', 'forever', 'never', 'always', 'temporary', 'permanent'],
            age: ['young', 'old', 'aging', 'youth', 'age', 'elderly', 'ancient', 
                 'new', 'fresh', 'vintage', 'modern', 'dated', 'timeless'],
            actions: ['wait', 'pass', 'fly', 'drag', 'rush', 'linger', 'freeze', 
                     'rewind', 'forward', 'pause', 'stop', 'start', 'end', 'begin'],
            objects: ['clock', 'watch', 'timer', 'hourglass', 'calendar', 'sundial', 
                     'alarm', 'stopwatch', 'bell', 'chime']
        },
        
        WATER: {
            bodies: ['ocean', 'sea', 'lake', 'river', 'stream', 'creek', 'brook', 
                    'pond', 'pool', 'bay', 'gulf', 'channel', 'lagoon'],
            states: ['wave', 'waves', 'tide', 'tides', 'current', 'flow', 'ripple', 
                    'splash', 'flood', 'drought', 'tsunami', 'surf', 'swell'],
            actions: ['swim', 'dive', 'drown', 'float', 'sink', 'wade', 'splash', 
                     'surf', 'sail', 'drift', 'submerge', 'emerge', 'plunge'],
            qualities: ['deep', 'shallow', 'clear', 'murky', 'calm', 'stormy', 
                       'frozen', 'boiling', 'cold', 'warm', 'still', 'turbulent'],
            locations: ['shore', 'beach', 'coast', 'dock', 'pier', 'harbor', 'port', 
                       'reef', 'island', 'sandbar', 'cliff'],
            weather: ['rain', 'storm', 'drizzle', 'downpour', 'mist', 'fog', 'dew', 
                     'snow', 'ice', 'hail', 'sleet', 'monsoon']
        }
    },
    
    // ============================================
    // CONCRETE NOUNS (BY SENSORY CATEGORY)
    // ============================================
    
    CONCRETE_LEXICON: {
        FOOD: [
            // High-end/luxury foods (your style)
            'wagyu', 'steak', 'ribeye', 'filet', 'toblerone', 'truffle', 'caviar',
            'lobster', 'oyster', 'sushi', 'sashimi',
            // Common foods
            'meat', 'beef', 'chicken', 'pork', 'fish', 'shrimp',
            'chocolate', 'candy', 'sugar', 'honey', 'syrup', 'caramel', 'vanilla',
            'coffee', 'espresso', 'latte', 'beans', 'tea', 'sencha', 'matcha',
            'wine', 'whiskey', 'bourbon', 'vodka', 'champagne', 'beer',
            'bread', 'toast', 'bagel', 'croissant', 'butter', 'jam',
            'cheese', 'provolone', 'cheddar', 'brie', 'mozzarella',
            'fruit', 'apple', 'orange', 'lemon', 'lime', 'grape', 'berry',
            'nuts', 'pistachio', 'almond', 'hazelnut', 'walnut', 'cashew',
            'spice', 'salt', 'pepper', 'cinnamon', 'ginger', 'mint',
            'milk', 'cream', 'ice', 'water', 'juice', 'soda'
        ],
        
        TEXTURE: [
            // Fabrics
            'leather', 'silk', 'velvet', 'cotton', 'wool', 'linen', 'denim',
            'satin', 'cashmere', 'fur', 'suede', 'canvas',
            // Qualities
            'rough', 'smooth', 'soft', 'hard', 'sharp', 'dull', 'slick', 'sticky',
            'coarse', 'fine', 'grainy', 'silky', 'fuzzy', 'bumpy',
            // Surfaces
            'grain', 'surface', 'texture', 'fabric', 'weave', 'thread',
            'skin', 'flesh', 'scar', 'scars', 'wrinkle', 'wrinkles', 'mark', 'marks',
            'scratch', 'scratches', 'dent', 'dents', 'crack', 'cracks'
        ],
        
        VISUAL: [
            // Light & shadow
            'shadow', 'shadows', 'light', 'lights', 'glow', 'glare', 'shimmer',
            'sparkle', 'glitter', 'shine', 'reflection', 'refraction',
            // Materials
            'mirror', 'glass', 'crystal', 'diamond', 'ruby', 'emerald', 'sapphire',
            'gold', 'silver', 'copper', 'bronze', 'platinum', 'brass',
            'iron', 'steel', 'metal', 'chrome', 'aluminum',
            // Marks & stains
            'rust', 'paint', 'ink', 'stain', 'stains', 'spot', 'spots',
            'mark', 'markings', 'spec', 'speck', 'dust', 'dirt', 'grime',
            'smudge', 'streak', 'splatter', 'drip', 'drop'
        ],
        
        NATURE: [
            // Land formations
            'stone', 'rock', 'boulder', 'pebble', 'gravel', 'mountain', 'hill',
            'valley', 'cliff', 'canyon', 'cave', 'cavern',
            'sand', 'dirt', 'soil', 'mud', 'clay', 'earth', 'ground',
            // Plants
            'moss', 'grass', 'weed', 'vine', 'bush', 'shrub',
            'leaf', 'leaves', 'petal', 'petals', 'stem', 'root', 'roots',
            'tree', 'trees', 'oak', 'pine', 'maple', 'willow', 'cedar',
            'wood', 'bark', 'branch', 'branches', 'twig', 'log', 'trunk',
            'flower', 'flowers', 'rose', 'lily', 'daisy', 'tulip',
            'thorn', 'thorns', 'needle', 'needles'
        ],
        
        ATMOSPHERE: [
            // Weather
            'rain', 'snow', 'ice', 'frost', 'hail', 'sleet',
            'fog', 'mist', 'haze', 'cloud', 'clouds',
            'wind', 'breeze', 'gust', 'gale', 'hurricane', 'tornado',
            'storm', 'thunder', 'lightning', 'bolt',
            // Celestial
            'sun', 'moon', 'star', 'stars', 'planet', 'comet',
            'sky', 'heaven', 'horizon', 'sunset', 'sunrise',
            // Air & gas
            'smoke', 'steam', 'ash', 'ember', 'embers',
            'ozone', 'oxygen', 'air', 'breath', 'vapor', 'gas', 'fume', 'fumes'
        ],
        
        OBJECTS: [
            // Mechanical
            'engine', 'motor', 'gear', 'gears', 'wheel', 'wheels',
            'chain', 'chains', 'wire', 'wires', 'cable', 'cables',
            'rope', 'cord', 'string', 'thread',
            // Tools & weapons
            'knife', 'blade', 'sword', 'dagger', 'razor',
            'gun', 'pistol', 'rifle', 'trigger', 'bullet', 'bullets', 'shell', 'shells',
            'hammer', 'nail', 'nails', 'screw', 'screws', 'bolt', 'bolts',
            // Technology
            'phone', 'cell', 'screen', 'screens', 'display',
            'computer', 'laptop', 'keyboard', 'mouse',
            'camera', 'lens', 'film', 'photo', 'picture',
            // Containers
            'bottle', 'bottles', 'glass', 'cup', 'cups', 'mug',
            'plate', 'plates', 'bowl', 'bowls', 'jar', 'jars',
            'box', 'boxes', 'bag', 'bags', 'case', 'cases',
            // Time devices
            'clock', 'clocks', 'watch', 'watches', 'timer', 'alarm'
        ],
        
        BODY: [
            // External body parts
            'hand', 'hands', 'finger', 'fingers', 'thumb', 'palm', 'palms',
            'wrist', 'wrists', 'arm', 'arms', 'elbow', 'elbows',
            'foot', 'feet', 'toe', 'toes', 'ankle', 'ankles', 'heel', 'heels',
            'leg', 'legs', 'knee', 'knees', 'thigh', 'thighs',
            'neck', 'shoulder', 'shoulders', 'back', 'chest', 'stomach',
            'head', 'face', 'eye', 'eyes', 'nose', 'ear', 'ears',
            'mouth', 'lip', 'lips', 'tongue', 'teeth', 'tooth', 'jaw',
            'hair', 'skin', 'nail', 'nails',
            // Internal/medical
            'bone', 'bones', 'skull', 'rib', 'ribs', 'spine',
            'blood', 'vein', 'veins', 'artery', 'arteries',
            'heart', 'lung', 'lungs', 'liver', 'kidney',
            // Injuries
            'scar', 'scars', 'wound', 'wounds', 'cut', 'cuts',
            'bruise', 'bruises', 'burn', 'burns',
            // Bodily fluids/states
            'tear', 'tears', 'sweat', 'breath', 'spit', 'saliva'
        ],
        
        ARCHITECTURE: [
            // Spaces
            'room', 'rooms', 'hall', 'hallway', 'corridor',
            'house', 'home', 'building', 'apartment', 'condo',
            'office', 'store', 'shop', 'mall', 'plaza',
            // Structural elements
            'wall', 'walls', 'floor', 'floors', 'ceiling', 'ceilings',
            'door', 'doors', 'window', 'windows', 'gate', 'gates',
            'roof', 'chimney', 'attic', 'basement', 'garage',
            'stairs', 'steps', 'staircase', 'elevator', 'escalator',
            'corner', 'corners', 'edge', 'edges', 'angle', 'angles',
            // Furniture
            'table', 'tables', 'chair', 'chairs', 'couch', 'sofa',
            'bed', 'beds', 'mattress', 'pillow', 'pillows', 'blanket', 'blankets',
            'desk', 'desks', 'shelf', 'shelves', 'cabinet', 'cabinets',
            'drawer', 'drawers', 'closet', 'closets',
            'lamp', 'lamps', 'light', 'lights', 'bulb', 'bulbs',
            // Materials
            'brick', 'bricks', 'concrete', 'cement', 'plaster',
            'wood', 'lumber', 'beam', 'beams', 'plank', 'planks',
            'tile', 'tiles', 'marble', 'granite', 'stone',
            'frame', 'frames', 'panel', 'panels', 'sheet', 'sheets'
        ],
        
        SOUND: [
            'echo', 'echoes', 'hum', 'buzz', 'ring', 'chime', 'chimes',
            'bell', 'bells', 'alarm', 'siren', 'horn', 'whistle',
            'drum', 'drums', 'beat', 'beats', 'rhythm', 'pulse',
            'note', 'notes', 'chord', 'chords', 'melody', 'tune',
            'bass', 'treble', 'pitch', 'tone', 'tones',
            'tap', 'taps', 'click', 'clicks', 'snap', 'snaps',
            'crack', 'cracks', 'pop', 'bang', 'boom', 'crash',
            'whisper', 'whispers', 'shout', 'shouts', 'scream', 'screams',
            'voice', 'voices', 'word', 'words', 'lyric', 'lyrics'
        ]
    },
    
    // ============================================
    // ABSTRACT NOUNS (PENALIZED)
    // ============================================
    
    ABSTRACT_NOUNS: {
        NEGATIVE_EMOTIONS: [
            'sadness', 'sorrow', 'grief', 'misery', 'despair', 'depression',
            'anger', 'rage', 'fury', 'wrath', 'hate', 'hatred',
            'fear', 'dread', 'terror', 'panic', 'anxiety', 'worry',
            'shame', 'guilt', 'regret', 'remorse',
            'envy', 'jealousy', 'bitterness', 'resentment',
            'pain', 'suffering', 'agony', 'anguish', 'torment',
            'loneliness', 'isolation', 'emptiness', 'void', 'nothingness'
        ],
        
        POSITIVE_EMOTIONS: [
            'happiness', 'joy', 'delight', 'pleasure', 'bliss', 'ecstasy', 'euphoria',
            'love', 'affection', 'fondness', 'adoration', 'devotion',
            'desire', 'lust', 'passion', 'craving', 'longing',
            'hope', 'optimism', 'faith', 'trust', 'confidence',
            'pride', 'triumph', 'victory', 'glory', 'success'
        ],
        
        MENTAL_STATES: [
            'thought', 'idea', 'belief', 'opinion', 'view', 'perspective',
            'feeling', 'emotion', 'mood', 'sentiment', 'sense',
            'consciousness', 'awareness', 'mindfulness', 'attention',
            'knowledge', 'wisdom', 'understanding', 'insight', 'intuition',
            'ignorance', 'confusion', 'doubt', 'uncertainty',
            'clarity', 'focus', 'concentration',
            'memory', 'recollection', 'reminiscence', 'nostalgia'
        ],
        
        MORALITY: [
            'truth', 'honesty', 'integrity', 'honor',
            'lie', 'deception', 'deceit', 'dishonesty', 'betrayal',
            'justice', 'fairness', 'equality',
            'injustice', 'unfairness', 'inequality',
            'good', 'goodness', 'virtue', 'righteousness',
            'evil', 'wickedness', 'sin', 'vice',
            'right', 'wrong', 'morality', 'ethics'
        ],
        
        RELATIONSHIPS: [
            'friendship', 'companionship', 'camaraderie',
            'loyalty', 'faithfulness', 'allegiance',
            'bond', 'connection', 'tie', 'link', 'relationship',
            'intimacy', 'closeness', 'distance', 'separation',
            'unity', 'togetherness', 'solidarity'
        ],
        
        QUALITIES: [
            'beauty', 'ugliness', 'appearance',
            'strength', 'power', 'might', 'force',
            'weakness', 'fragility', 'vulnerability',
            'freedom', 'liberty', 'independence',
            'oppression', 'captivity', 'imprisonment',
            'peace', 'tranquility', 'serenity', 'calm',
            'chaos', 'disorder', 'turmoil', 'mayhem',
            'order', 'harmony', 'balance'
        ],
        
        CONCEPTS: [
            'destiny', 'fate', 'fortune', 'luck', 'chance',
            'purpose', 'meaning', 'significance', 'importance',
            'existence', 'being', 'reality', 'illusion', 'dream',
            'life', 'death', 'mortality', 'immortality',
            'soul', 'spirit', 'essence', 'identity', 'self'
        ]
    },
    
    // ============================================
    // SENTIMENT WORDS (FOR COHESION SCORING)
    // ============================================
    
    SENTIMENT_WORDS: {
        NEGATIVE: [
            'betrayal', 'lonely', 'sadness', 'regret', 'stuck', 'cold', 'numb', 
            'hollow', 'broke', 'broken', 'empty', 'crash', 'crashed', 'fade', 'faded', 
            'scar', 'scarred', 'shame', 'dark', 'bitter', 'torn', 'lost', 'waste',
            'hurt', 'pain', 'bleed', 'bleeding', 'burn', 'burning', 'drown', 'drowning',
            'dead', 'death', 'dying', 'kill', 'murder', 'destroy', 'destruction',
            'ruin', 'ruined', 'damage', 'damaged', 'break', 'shatter', 'shattered'
        ],
        
        POSITIVE: [
            'love', 'happy', 'success', 'loyal', 'bright', 'gold', 'golden', 'safe', 
            'warm', 'future', 'shine', 'shining', 'win', 'winning', 'glory', 'top',
            'rise', 'rising', 'climb', 'climbing', 'build', 'building', 'grow', 'growing',
            'heal', 'healing', 'fix', 'fixed', 'mend', 'mended', 'restore', 'restored',
            'alive', 'living', 'thrive', 'thriving', 'flourish', 'flourishing'
        ]
    },
    
    // ============================================
    // STRUCTURAL TARGETS
    // ============================================
    
    DRAKE_TARGET_STRUCTURE: [8, 12, 8],
    
    FLOW_SYLLABLE_THRESHOLDS: {
        CONVERSATIONAL_MIN: 5,
        CONVERSATIONAL_MAX: 7,
        TRIPLET_MIN: 9,
        TRIPLET_MAX: 11
    },
    
    // ============================================
    // STRICTER SCORING THRESHOLDS (V5.0)
    // ============================================
    
    SCORING_THRESHOLDS: {
        // F-Score requirements (stricter)
        F_SCORE: {
            FLOW_PERFECT: { min: 5.0, max: 7.0, points: 30 },
            FLOW_ACCEPTABLE: { min: 4.0, max: 8.0, points: 15 },
            LEXICON_MIN: 3,  // Must use at least 3 Drake words
            LEXICON_PERFECT: 5, // Use 5+ for max points
            LINE_EXACT: 28,
            LINE_TOLERANCE: 2 // Only ±2 lines acceptable
        },
        
        // P-Score requirements (stricter)
        P_SCORE: {
            ABSTRACT_PERFECT: 0,  // Zero abstractions for max points
            ABSTRACT_MAX: 1,      // More than 1 = failure
            CONCRETE_MIN: 5,      // Need 5+ concrete nouns (was 3)
            CONCRETE_PERFECT: 8,  // 8+ for max points
            MOTIF_DENSITY_MIN: 5, // Need 5+ motif words (was 2)
            MOTIF_DIVERSITY: 2,   // Must span 2+ semantic categories
            SENTIMENT_MIN: 4      // Need 4+ sentiment words (was 3)
        }
    }
};

// ============================================
// HELPER FUNCTIONS FOR FLAT ACCESS
// ============================================

// Flatten semantic motifs for easy searching
LEXICON.getFlatMotifWords = function(motifKey) {
    const motif = this.SEMANTIC_MOTIFS[motifKey];
    if (!motif) return [];
    return Object.values(motif).flat();
};

// Flatten concrete lexicon
LEXICON.getAllConcreteWords = function() {
    return Object.values(this.CONCRETE_LEXICON).flat();
};

// Flatten abstract nouns
LEXICON.getAllAbstractNouns = function() {
    return Object.values(this.ABSTRACT_NOUNS).flat();
};

// Get concrete words by category (for UI display)
LEXICON.getConcreteByCategory = function(category) {
    return this.CONCRETE_LEXICON[category] || [];
};

// Get motif words by category (for UI display)
LEXICON.getMotifByCategory = function(motifKey, category) {
    const motif = this.SEMANTIC_MOTIFS[motifKey];
    if (!motif) return [];
    return motif[category] || [];
};

// Export for browser use
if (typeof window !== 'undefined') {
    window.LEXICON = LEXICON;
}

// Export for Node.js use (testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LEXICON;
}
