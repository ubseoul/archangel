// lyric-forge.js (Finalized V2.2 with Info Content)

let currentChallenge = null;
let savedProgress = JSON.parse(localStorage.getItem('lyricForgeProgress')) || [];

// --- A. Utility Functions ---

function estimateSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const match = word.match(/[aeiouy]{1,2}/g);
    return match ? match.length : 0;
}

function getNonEmptyLines(text) {
    return text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
}

function updateCounters() {
    const text = document.getElementById('lyric-input').value;
    const lines = getNonEmptyLines(text);
    const lineCount = lines.length;
    
    let totalSyllables = 0;
    lines.forEach(line => {
        line.split(/\s+/).forEach(word => {
            totalSyllables += estimateSyllables(word);
        });
    });

    const avgSylPerLine = lineCount > 0 ? (totalSyllables / lineCount).toFixed(1) : 0;

    document.getElementById('line-count').textContent = lineCount;
    document.getElementById('bar-count').textContent = Math.floor(lineCount / 4);
    document.getElementById('syl-count').textContent = avgSylPerLine;
}
document.getElementById('lyric-input').addEventListener('input', updateCounters);


// --- B. Info Content (New V3.0 UX Feature) ---

const INFO_CONTENT = {
    drake_structure: {
        title: "Drake Drill: Structural Efficiency (F-Score)",
        content: `
            <h4>Structure Strategy: The Sandwich Method</h4>
            <ul>
                <li>Always prioritize the hook. Verses are "Spacers" and must be short (max 12 lines) to get back to the Chorus quickly.</li>
                <li>The structure is rigid: Chorus -> Verse -> Chorus -> Verse -> Chorus.</li>
            </ul>
            <h4>Lexicon Focus</h4>
            <ul>
                <li>Use high-impact words (Lexicon words) as **rhythmic anchors** or structural markers, like the word "Yeah".</li>
                <li>Rhyme Strategy: Focus on **simple couplets (AABB)** for clarity and cognitive ease.</li>
            </ul>
        `
    },
    drake_rhythm_conv: {
        title: "Drake Drill: Conversational Flow (R-Score)",
        content: `
            <h4>Conversational Flow (40-55% Stress)</h4>
            <ul>
                <li>This is the signature **Trochaic Rhythm** (stressed-unstressed) that mimics natural speech.</li>
                <li>Use the **/** marker primarily on naturally stressed words (nouns and key verbs).</li>
                <li>**Goal:** Make the lyric feel conversational and "real".</li>
            </ul>
            <h4>The Pause Tactic</h4>
            <ul>
                <li>Use the **||** marker strategically to leave silence to emphasize a punchline or let the beat breathe.</li>
            </ul>
        `
    },
    drake_rhythm_trip: {
        title: "Drake Drill: Triplet Flow (R-Score)",
        content: `
            <h4>Triplet Flow (30-38% Stress)</h4>
            <ul>
                <li>Subdivide the beat: ONE-e-uh. Your map should have many unstressed markers (**.**) for every one stressed marker (**/ **).</li>
                <li>**Goal:** Achieve a high syllable density with a rolling, hypnotic effect (Trap Zeitgeist).</li>
            </ul>
        `
    },
    ocean_poetics: {
        title: "Ocean Opus: Poetic Depth (P-Score)",
        content: `
            <h4>Metaphor Focus: No Abstractions</h4>
            <ul>
                <li>**Do not explicitly state the emotion** (e.g., don't use 'sadness'). Describe the **concrete object** you assigned as the metaphor.</li>
                <li>The Metaphor Cohesion check looks for the **co-occurrence** of your motif (Car/Color) and the implied sentiment.</li>
            </ul>
            <h4>Narrative Strategy: Structural Subversion</h4>
            <ul>
                <li>**Linear Path:** Avoid repetition (no choruses). Write a song that moves from A to B.</li>
                <li>Use the **[SWITCH] marker** to simulate abrupt time shifts or changes in perspective.</li>
            </ul>
        `
    }
};

function toggleInfo() {
    const infoPanel = document.getElementById('info-section');
    infoPanel.classList.toggle('active');
}

// --- C. Challenge Definitions (Stable) ---

const CHALLENGES = {
    drake_structure: {
        title: "🎤 Drake Drill: Structural Efficiency (F-Score)",
        prompt: "Objective: Commercial Ubiquity. Write **28 non-empty lines** following the Chorus-Verse-Chorus structure. Max lines for Verse is 12, Chorus is 8. Must use **3 words** from the Drake Lexicon. Score focuses on structure and simple rhyme.",
        scoreType: 'F',
        targetLines: 28,
    },
    drake_rhythm_conv: {
        title: "🥁 Drake Drill: Conversational Flow",
        prompt: "Objective: Flow Mastery (Conversational). Write a 4-line verse. Immediately below each line, create a **Rhythmic Map** ( / for stressed, . for unstressed). Target Stress Ratio: 40-55%.",
        scoreType: 'R', 
        rhythmTarget: 'CONVERSATIONAL',
    },
    drake_rhythm_trip: {
        title: "🥁 Drake Drill: Triplet Flow",
        prompt: "Objective: Flow Mastery (Triplet). Write a 4-line verse. Immediately below each line, create a **Rhythmic Map** ( / for stressed, . for unstressed). Target Stress Ratio: 30-38%.",
        scoreType: 'R', 
        rhythmTarget: 'TRIPLET',
    },
    ocean_poetics: {
        title: "🌊 Ocean Opus: Poetic Depth (P-Score)",
        prompt: "Objective: Narrative Depth. Write **17 non-empty lines** (Line 1 = Metaphor). Must lack a chorus. Score checks Cohesion and Lexical Specificity.",
        scoreType: 'P', 
        targetLines: 17,
    }
};

function startChallenge(type) {
    currentChallenge = CHALLENGES[type];
    document.getElementById('lyric-input').value = '';
    document.getElementById('challenge-title').textContent = currentChallenge.title;
    document.getElementById('challenge-prompt').textContent = currentChallenge.prompt;
    
    // Inject relevant info content
    const infoData = INFO_CONTENT[type];
    document.getElementById('info-section').innerHTML = infoData.content;
    
    updateCounters();
    showView('challenge-view');
}


function submitLyric() {
    const lyric = document.getElementById('lyric-input').value;
    const lines = getNonEmptyLines(lyric); 
    
    if (lines.length < 4) {
        alert("Please write at least 4 non-empty lines for a valid analysis.");
        return;
    }

    let fScore = 0;
    let pScore = 0;
    let rScore = 0;
    let feedback = [];

    if (currentChallenge.scoreType === 'F') {
        ({ fScore, feedback } = scoreDrakeDrill_Structure(lines, fScore, feedback));
    } else if (currentChallenge.scoreType === 'R') {
        ({ rScore, feedback } = scoreDrakeDrill_Rhythm(lines, rScore, feedback));
    } else if (currentChallenge.scoreType === 'P') {
        ({ pScore, feedback } = scoreOceanOpus(lines, pScore, feedback));
    }

    document.getElementById('f-score').textContent = fScore;
    document.getElementById('r-score').textContent = rScore;
    document.getElementById('p-score').textContent = pScore;
    displayFeedback(feedback);
    showView('results-view');

    saveProgress(fScore, pScore, rScore, lyric, currentChallenge.title);
}

// --- F-SCORE (Structure) ---

function scoreDrakeDrill_Structure(lines, fScore, feedback) {
    const structureConstraint = currentChallenge.targetLines;

    // 1. Structural Blueprinting (Max 40 points)
    if (lines.length >= structureConstraint - 4 && lines.length <= structureConstraint + 4) {
        fScore += 40;
        feedback.push({ type: 'success', text: `🏆 Structure: Line count (${lines.length}) is near the target (${structureConstraint}). Adheres to the Commercial Algorithm.` }); 
    } else {
        feedback.push({ type: 'fail', text: `❌ Structure: Line count of ${lines.length} is far from the target. Focus on short "Spacer" Verses.` }); 
    }

    // 2. Lexicon Use (Max 30 points)
    const drakeWordsFound = LEXICON.DRAKE_LEXICON_WORDS.filter(word => lines.some(line => line.toLowerCase().includes(word))).length;
    if (drakeWordsFound >= 3) {
        fScore += 30;
        feedback.push({ type: 'success', text: `💡 Lexicon: Used ${drakeWordsFound} required lexicon words. Good anchoring.` }); 
    } else {
        feedback.push({ type: 'fail', text: `❌ Lexicon: Only used ${drakeWordsFound} required lexicon words. Need 3 to ground the lyric.` });
    }

    // 3. Rhyme Scheme Verification (AABB - Low Weight) (Max 10 points)
    const endWords = lines.slice(0, 4).map(line => {
        const words = line.trim().split(/\s+/);
        return words[words.length - 1].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
    });
    
    let rhymeScore = 0;
    if (endWords.length >= 4) {
        if (endWords[0] === endWords[1] && endWords[2] === endWords[3]) { rhymeScore += 10; }
    }
    
    if (rhymeScore > 0) {
        fScore += rhymeScore;
        feedback.push({ type: 'success', text: `✅ Rhyme: Detected clear AABB couplets. Prioritize perfect rhymes for clarity.` });
    } else {
        feedback.push({ type: 'fail', text: `❌ Rhyme: Did not confirm the simple AABB scheme. Consider using simple, direct end rhymes.` });
    }

    // 4. Flow Pacing (The Pause Tactic) (Max 20 points)
    const pauseTacticUsed = lines.some(line => line.includes(LEXICON.DRAKE_PAUSE_MARKER));
    if (pauseTacticUsed) {
        fScore += 20;
        feedback.push({ type: 'success', text: `✅ Pause Tactic: The [PAUSE] marker was used, emulating the "stop-start" flow for emphasis.` }); 
    } else {
        feedback.push({ type: 'fail', text: `❌ Pause Tactic: No [PAUSE] marker found. This technique is crucial for rhythmic emphasis.` });
    }

    return { fScore: Math.min(100, fScore), feedback };
}

// --- R-SCORE (Rhythm - CORRECTED V2.2) ---

function scoreDrakeDrill_Rhythm(lines, rScore, feedback) {
    if (lines.length !== 8) {
        feedback.push({ type: 'fail', text: '❌ Rhythmic Map requires exactly 4 lines of lyric and 4 lines of map (8 total non-empty lines).' });
        return { rScore: 0, feedback };
    }

    let mapLines = lines.filter((_, i) => i % 2 !== 0);
    let rhythmScore = 0;

    let targetMinRatio = 0;
    let targetMaxRatio = 0;
    let targetStyle = currentChallenge.rhythmTarget;

    if (targetStyle === 'CONVERSATIONAL') {
        targetMinRatio = 0.40; targetMaxRatio = 0.55; 
    } else if (targetStyle === 'TRIPLET') {
        targetMinRatio = 0.30; targetMaxRatio = 0.38;
    }

    mapLines.forEach((map, index) => {
        const stressed = (map.match(/\//g) || []).length;
        const totalMarkers = stressed + (map.match(/\./g) || []).length;

        if (totalMarkers === 0) {
            feedback.push({ type: 'fail', text: `❌ Line ${index + 1}: Map is empty. Cannot score stress ratio.` });
            return;
        }

        const actualRatio = stressed / totalMarkers;

        // 1. Stress Density Check (Max 80 points) - Uses simplified logic
        if (actualRatio >= targetMinRatio && actualRatio <= targetMaxRatio) {
            rhythmScore += 20; 
            feedback.push({ type: 'success', text: `✅ Line ${index + 1}: Stress ratio (${actualRatio.toFixed(2)}) is compliant with ${targetStyle} flow.` });
        } else {
            feedback.push({ type: 'fail', text: `❌ Line ${index + 1}: Stress ratio (${actualRatio.toFixed(2)}) is outside the target range for ${targetStyle} flow.` });
        }
    });

    // 2. Final Critique (Max 20 points)
    if (rhythmScore >= 60) {
        rhythmScore += 20;
        feedback.push({ type: 'success', text: '🏆 Flow Mastery: You successfully engineered rhythmic predictability. Excellent flow compliance!' });
    } else {
        feedback.push({ type: 'fail', text: '📝 Flow Feedback: Need more consistency in your stress pattern to hit the target density.' });
    }

    return { rScore: Math.min(100, rhythmScore), feedback };
}

// --- P-SCORE (Poetry) ---

function scoreOceanOpus(lines, pScore, feedback) {
    if (lines.length !== 17) {
        feedback.push({ type: 'fail', text: `❌ Structural Violation: Expected 17 lines (1 metaphor + 16 lyric), found ${lines.length}.` });
        return { pScore: 0, feedback };
    }

    const metaphorLine = lines[0].toLowerCase().trim();
    const lyricLines = lines.slice(1);
    const lyricText = lyricLines.join(' ').toLowerCase();

    // Check 1: Metaphor Format and Extraction (Max 10 points)
    let metaphorCheck = metaphorLine.match(/(\w+)\s*=\s*(\w+)/);
    if (!metaphorCheck) {
        feedback.push({ type: 'fail', text: "❌ Metaphor Format: First line must be formatted as 'Motif = Emotion'." });
        return { pScore: 0, feedback };
    }
    
    const motif = metaphorCheck[1];
    const coreEmotion = metaphorCheck[2];
    pScore += 10; 

    // Check 2: Metaphor Cohesion (Max 40 points)
    let targetSentiment = LEXICON.SENTIMENT_WORDS.NEGATIVE; 
    if (LEXICON.SENTIMENT_WORDS.POSITIVE.includes(coreEmotion)) {
        targetSentiment = LEXICON.SENTIMENT_WORDS.POSITIVE;
    }
    
    const sentimentCount = targetSentiment.filter(word => lyricText.includes(word)).length;
    const motifCount = (lyricText.match(new RegExp(motif, 'g')) || []).length;
    
    if (sentimentCount >= 3 && motifCount >= 3) {
        pScore += 40;
        feedback.push({ type: 'success', text: `🏆 Cohesion: High density of the **${motif}** motif and its associated **${coreEmotion}** sentiment words. Excellent Extended Metaphor.` });
    } else {
        feedback.push({ type: 'fail', text: `❌ Cohesion: Motif count (${motifCount}) or Sentiment count (${sentimentCount}) is too low. The motif is not being used to describe the core emotion.` });
    }

    // Check 3: Lexical Specificity (The "No Abstractions" Rule) (Max 30 points - CORRECTED V2.2)
    const abstractUsage = LEXICON.ABSTRACT_NOUNS.filter(word => 
        word !== coreEmotion && lyricText.includes(word)
    ).length;
    
    const concreteUsed = LEXICON.CONCRETE_REPLACERS.filter(word => lyricText.includes(word)).length;

    if (abstractUsage === 0 && concreteUsed >= 2) {
        pScore += 30;
        feedback.push({ type: 'success', text: `✅ Specificity: Avoided abstractions and used ${concreteUsed} specific nouns, grounding the poetry.` });
    } else if (abstractUsage > 2) {
        feedback.push({ type: 'fail', text: `🛑 Specificity Fail: Used ${abstractUsage} abstract nouns (more than 2). Replace them with concrete nouns. (0 points)` });
        // Score remains unchanged (0 points added for this section)
    } else if (abstractUsage > 0 || concreteUsed < 2) {
        pScore += 15;
        feedback.push({ type: 'fail', text: `❌ Specificity: Used ${abstractUsage} abstractions. Focus on finding concrete nouns.` });
    } else {
        pScore += 30;
        feedback.push({ type: 'success', text: `✅ Specificity: Used ${concreteUsed} concrete replacers. Good focus.` }); 
    }


    // Check 4: Structural Subversion (Max 20 points)
    const hasRepetitiveLines = lyricLines.some((line, i) => lyricLines.slice(i + 1).some(otherLine => otherLine.trim() === line.trim() && line.length > 10));
    const switchMarkerUsed = lyricText.includes(LEXICON.OCEAN_NARRATIVE_MARKER);
    
    if (switchMarkerUsed && !hasRepetitiveLines) {
        pScore += 20;
        feedback.push({ type: 'success', text: `✅ Subversion: Used the [SWITCH] marker and avoided repetition, adhering to a Linear Path.` });
    } else {
        feedback.push({ type: 'fail', text: `❌ Subversion: Did not use [SWITCH] or detected repetition. Needs fragmentation and linearity.` });
    }

    return { pScore: Math.min(100, pScore), feedback };
}


// --- E. Progress Tracking and Navigation ---

function displayFeedback(feedback) {
    const list = document.getElementById('feedback-list');
    list.innerHTML = '';
    feedback.forEach(item => {
        const li = document.createElement('li');
        const icon = item.type === 'success' ? '🏆' : '❌';
        li.innerHTML = `<span style="font-weight: bold;">${icon}</span> ${item.text}`;
        li.classList.add(item.type === 'success' ? 'feedback-success' : 'feedback-fail');
        list.appendChild(li);
    });
}

function saveProgress(fScore, pScore, rScore, lyric, title) {
    const newEntry = {
        date: new Date().toISOString().split('T')[0],
        title: title,
        fScore: fScore,
        pScore: pScore,
        rScore: rScore,
        lyric: lyric
    };
    savedProgress.push(newEntry);
    localStorage.setItem('lyricForgeProgress', JSON.stringify(savedProgress));
}

// Placeholder for download 
function saveAndShare() {
    const fScore = document.getElementById('f-score').textContent;
    const rScore = document.getElementById('r-score').textContent;
    const pScore = document.getElementById('p-score').textContent;
    const feedbackText = Array.from(document.getElementById('feedback-list').children).map(li => li.textContent).join('\n');
    const lyric = document.getElementById('lyric-input').value;
    
    const content = `
*** Gemini Lyric Forge Analysis ***
Challenge: ${currentChallenge.title}
Date: ${new Date().toLocaleDateString()}

Flow/Structure Score (F-Score): ${fScore}/100
Rhythm/Flow Score (R-Score): ${rScore}/100
Poetry/Depth Score (P-Score): ${pScore}/100

--- Feedback ---
${feedbackText}

--- Your Lyric ---
${lyric}

(Save this file to your device to track progress!)
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LyricForge_Score_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
    showView('dashboard-view');
});
