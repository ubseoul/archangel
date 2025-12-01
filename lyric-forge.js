// lyric-forge.js (Finalized V4.1 - Seamless Creative Engine - Fixed)

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

function calculateAverageScores() {
    if (savedProgress.length === 0) return { avgF: 0, avgP: 0 };
    
    const totalF = savedProgress.reduce((sum, entry) => sum + (entry.fScore || 0), 0);
    const totalP = savedProgress.reduce((sum, entry) => sum + (entry.pScore || 0), 0);
    
    return {
        avgF: Math.round(totalF / savedProgress.length),
        avgP: Math.round(totalP / savedProgress.length)
    };
}

// --- B. UI & Navigation (FIXED: Ensures function runs only after elements exist) ---

function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
        if (viewId === 'dashboard-view') {
            updateDashboardProgress();
        }
    }
}

function updateDashboardProgress() {
    const { avgF, avgP } = calculateAverageScores();
    // Check for element existence before setting textContent (Robustness fix)
    const avgFElement = document.getElementById('avg-f-score');
    const avgPElement = document.getElementById('avg-p-score');

    if (avgFElement) avgFElement.textContent = `${avgF}%`;
    if (avgPElement) avgPElement.textContent = `${avgP}%`;
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

    const avgSylPerLine = lineCount > 0 ? (totalSyllables / lineCount) : 0;
    const flowType = inferFlowStyle(avgSylPerLine);

    // Check for element existence before setting textContent (The original error source fix)
    const lineCountElement = document.getElementById('line-count');
    const barCountElement = document.getElementById('bar-count');
    const sylCountElement = document.getElementById('syl-count');
    const flowTypeElement = document.getElementById('flow-type');
    
    if (lineCountElement) lineCountElement.textContent = lineCount;
    if (barCountElement) barCountElement.textContent = Math.floor(lineCount / 4);
    if (sylCountElement) sylCountElement.textContent = avgSylPerLine.toFixed(1);
    if (flowTypeElement) flowTypeElement.textContent = flowType;
}

function inferFlowStyle(avgSylPerLine) {
    const T = LEXICON.FLOW_SYLLABLE_THRESHOLDS;
    if (avgSylPerLine >= T.TRIPLET_MIN && avgSylPerLine <= T.TRIPLET_MAX) {
        return "Triplet (Dense)";
    } else if (avgSylPerLine >= T.CONVERSATIONAL_MIN && avgSylPerLine <= T.CONVERSATIONAL_MAX) {
        return "Conversational (Trochaic)";
    } else {
        return "--";
    }
}

function toggleInfo() {
    document.getElementById('info-section').classList.toggle('active');
}

// --- C. Challenge Definitions & Setup ---

const CHALLENGES = {
    drake_structure: {
        title: "🎤 Synthesis Drill: Structure (F-Score)",
        prompt: "Write 28 non-empty lines (Chorus-Verse-Chorus). Select a mood and motif to provide contextual imagery.",
        scoreType: 'F',
        targetLines: 28,
        moodRequired: true,
        motifRequired: true, 
    },
    ocean_poetics: {
        title: "🌊 Poetic Workout: Depth (P-Score)",
        prompt: "Write 16 non-empty lines (No Chorus). Define a mood and motif. The tool STICTLY penalizes abstract nouns, forcing reliance on concrete imagery.",
        scoreType: 'P', 
        targetLines: 16,
        moodRequired: true,
        motifRequired: true,
    }
};

function startChallenge(type) {
    currentChallenge = CHALLENGES[type];
    document.getElementById('lyric-input').value = '';
    document.getElementById('challenge-title').textContent = currentChallenge.title;
    document.getElementById('challenge-prompt').textContent = currentChallenge.prompt;
    
    // Reset inputs
    document.getElementById('input-mood').value = "";
    document.getElementById('input-motif').value = "";
    
    // Inject relevant info content
    document.getElementById('info-section').innerHTML = INFO_CONTENT[type].content;
    document.getElementById('info-section').classList.remove('active'); 

    updateCounters();
    showView('challenge-view');
}

const INFO_CONTENT = {
    drake_structure: {
        content: `
            <h4>Structure Strategy: The Sandwich Method (F-Score Value)</h4>
            <ul>
                <li>**Action:** Aim for short verses (max 12 lines) to keep the hook frequency high. This maximizes commercial viability.</li>
                <li>**Dual Constraint:** Use your selected Motif (Car/Color/Time) frequently to ground the accessible topic in specific, Ocean-style imagery.</li>
            </ul>
            <h4>Flow Strategy: Inferred Rhythm (R-Score Value)</h4>
            <ul>
                <li>**Insight:** The tool infers your flow from the **Syl/Line** status. Aim for 5-7 Syl/Line to maintain a relaxed, conversational rhythm (Drake's signature).</li>
            </ul>
        `
    },
    ocean_poetics: {
        content: `
            <h4>Lexical Specificity (P-Score Value)</h4>
            <ul>
                <li>**STRICT PENALTY:** The tool will penalize you heavily for using Abstract Nouns (e.g., sadness, passion).</li>
                <li>**Action:** Replace abstract words with **concrete imagery** (e.g., swap 'sadness' for 'cold texture' or 'oil marks').</li>
            </ul>
            <h4>Narrative Strategy: Structural Subversion</h4>
            <ul>
                <li>**Value:** This creates layers of meaning and intimacy. **Action:** Avoid repeating any line longer than 5 words. The lyric must move linearly from A to B.</li>
            </ul>
        `
    }
};

// --- D. Core Scoring Logic ---

function submitLyric() {
    const lyric = document.getElementById('lyric-input').value;
    const lines = getNonEmptyLines(lyric); 
    
    // FIX 1: Retrieve values and check for empty string
    const mood = document.getElementById('input-mood').value;
    const motif = document.getElementById('input-motif').value;
    
    if (lines.length < 8) {
        alert("Please write at least 8 non-empty lines before scoring.");
        return;
    }
    
    // FIX 2: Ensure Mood and Motif are selected (Prevents ReferenceError on scoring functions)
    if (!mood || !motif) {
        alert("Please select both a Goal Mood and a Core Motif before scoring.");
        return;
    }

    let fScore = 0;
    let pScore = 0;
    let feedback = [];

    if (currentChallenge.scoreType === 'F') {
        ({ fScore, pScore, feedback } = scoreSynthesisDrill(lines, mood, motif, feedback));
    } else if (currentChallenge.scoreType === 'P') {
        ({ fScore, pScore, feedback } = scorePoeticWorkout(lines, mood, motif, feedback));
    }

    document.getElementById('f-score').textContent = fScore;
    document.getElementById('p-score').textContent = pScore;
    
    displayFeedback(fScore, pScore, feedback);
    showView('results-view');

    saveProgress(fScore, pScore, lyric, currentChallenge.title);
}

// --- SYNTHESIS DRILL (F-Score Focus with P-Score Dual Constraint) ---

function scoreSynthesisDrill(lines, mood, motif, feedback) {
    let fScore = 0;
    let pScore = 0;
    const lyricText = lines.join(' ').toLowerCase();

    // 1. F-Score: Structural Compliance (Max 40 points)
    const structureConstraint = CHALLENGES.drake_structure.targetLines;
    if (lines.length >= structureConstraint - 4 && lines.length <= structureConstraint + 4) {
        fScore += 40;
        feedback.push({ type: 'success', scoreType: 'F', text: `🏆 Structure: Line count (${lines.length}) is near the target. Commercial Algorithm structure met.` }); 
    } else {
        fScore += 5; 
        feedback.push({ type: 'fail', scoreType: 'F', text: `❌ Structure: Line count of ${lines.length} is far from the target. **Action:** Aim for ${structureConstraint} lines (8/12/8) to meet the hook-frequency goal.` }); 
    }

    // 2. F-Score: Lexicon Use (Max 30 points)
    const drakeWordsFound = LEXICON.DRAKE_LEXICON_WORDS.filter(word => lines.some(line => line.toLowerCase().includes(word))).length;
    if (drakeWordsFound >= 3) {
        fScore += 30;
        feedback.push({ type: 'success', scoreType: 'F', text: `💡 Lexicon: Used ${drakeWordsFound} high-impact lexicon words. Good anchoring.` }); 
    } else {
        feedback.push({ type: 'fail', scoreType: 'F', text: `❌ Lexicon: Only used ${drakeWordsFound} lexicon words. **Action:** Incorporate at least 3 high-impact words (e.g., time, team, top).` });
    }

    // 3. F-Score: Inferred Flow Style (Max 30 points)
    const avgSylPerLine = lines.length > 0 ? lines.join(' ').split(/\s+/).reduce((sum, word) => sum + estimateSyllables(word), 0) / lines.length : 0;
    const T = LEXICON.FLOW_SYLLABLE_THRESHOLDS;
    
    if (avgSylPerLine >= T.CONVERSATIONAL_MIN && avgSylPerLine <= T.CONVERSATIONAL_MAX) {
        fScore += 30;
        feedback.push({ type: 'success', scoreType: 'F', text: `🥁 Flow: Inferred Conversational Flow (${avgSylPerLine.toFixed(1)} Syl/Line). Ideal for Drake's melodic hybrid.` });
    } else {
        feedback.push({ type: 'fail', scoreType: 'F', text: `❌ Flow: Density (${avgSylPerLine.toFixed(1)} Syl/Line) is too high/low. **Action:** Aim for 5-7 Syl/Line to achieve a relaxed, conversational rhythm.` });
    }

    // --- DUAL CONSTRAINT: P-SCORE Check (Ocean's Imagery) (Max 30 points, affects PScore only) ---
    pScore = scoreImageryDensity(lines, pScore, feedback, motif, 'Synthesis');

    return { fScore: Math.min(100, fScore), pScore: pScore, feedback: feedback };
}


// --- POETIC WORKOUT (P-Score Focus with F-Score Dual Constraint) ---

function scorePoeticWorkout(lines, mood, motif, feedback) {
    let fScore = 0;
    let pScore = 0;
    const lyricText = lines.join(' ').toLowerCase();

    // 1. P-SCORE: Lexical Specificity (The "No Abstractions" Rule) (Max 40 points)
    const abstractUsage = LEXICON.ABSTRACT_NOUNS.filter(word => lyricText.includes(word)).length;
    
    if (abstractUsage === 0) {
        pScore += 40;
        feedback.push({ type: 'success', scoreType: 'P', text: `🏆 Specificity: Zero Abstract Nouns found. **Value:** This maximizes semantic weight and poetic specificity.` });
    } else if (abstractUsage <= 1) {
        pScore += 30;
        feedback.push({ type: 'success', scoreType: 'P', text: `✅ Specificity: Only 1 abstraction found. Good control.` });
    } else {
        feedback.push({ type: 'fail', scoreType: 'P', text: `🛑 Specificity Fail: Used ${abstractUsage} abstract nouns (more than 1). **Action:** Replace abstract words with concrete imagery.` });
    }

    // 2. P-SCORE: Imagery Cohesion (Max 40 points)
    const targetSentimentKey = mood; // Use the selected mood key (NEGATIVE or POSITIVE)
    const sentimentCount = LEXICON.SENTIMENT_WORDS[targetSentimentKey].filter(word => lyricText.includes(word)).length;
    
    const motifKey = motif.toUpperCase();
    const motifWords = LEXICON.OCEAN_MOTIFS[motifKey] ? (lyricText.match(new RegExp(LEXICON.OCEAN_MOTIFS[motifKey], 'g')) || []).length : 0;
    const concreteReplaced = LEXICON.CONCRETE_REPLACERS.filter(word => lyricText.includes(word)).length;

    if (sentimentCount >= 3 && motifWords >= 2 && concreteReplaced >= 2) {
        pScore += 40;
        feedback.push({ type: 'success', scoreType: 'P', text: `🏆 Cohesion: High density of **${motif}** motif and ${mood} sentiment. The Extended Metaphor is cohesive!` });
    } else {
        feedback.push({ type: 'fail', scoreType: 'P', text: `❌ Cohesion: Low density of motif/sentiment words. **Action:** Integrate your ${motif} motif more often alongside ${mood} language (need 3+ hits on sentiment).` });
    }

    // 3. P-SCORE: Structural Subversion (Max 20 points)
    const hasRepetitiveLines = lines.some((line, i) => lines.slice(i + 1).some(otherLine => otherLine.trim() === line.trim() && line.length > 8));
    
    if (!hasRepetitiveLines) {
        pScore += 20;
        feedback.push({ type: 'success', scoreType: 'P', text: `✅ Subversion: Avoided repetition. **Value:** This linearity ensures active decoding and critical engagement.` });
    } else {
        feedback.push({ type: 'fail', scoreType: 'P', text: `❌ Subversion: Detected repetitive lines. **Action:** Avoid choruses; strive for a linear (A-B-C-D) narrative path.` });
    }

    // --- DUAL CONSTRAINT: F-SCORE Check (Drake's Rhyme Simplicity) (Max 40 points, affects FScore only) ---
    fScore = scoreRhymeDiscipline(lines, fScore, feedback, 'Workout');

    return { fScore: fScore, pScore: Math.min(100, pScore), feedback: feedback };
}

// --- DUAL CONSTRAINT HELPER FUNCTIONS ---

function scoreImageryDensity(lines, currentScore, feedback, motif, challengeType) {
    const lyricText = lines.join(' ').toLowerCase();
    const concreteReplaced = LEXICON.CONCRETE_REPLACERS.filter(word => lyricText.includes(word)).length;
    
    if (concreteReplaced >= 4) {
        currentScore += 30; // 30 bonus points for deep imagery
        feedback.push({ type: 'success', scoreType: 'P', text: `💎 **DUAL CONSTRAINT** (Ocean Imagery): Used ${concreteReplaced} high-impact imagery words. Excellent blending of commercial structure with poetic depth.` });
    } else if (concreteReplaced >= 2) {
        currentScore += 15;
        feedback.push({ type: 'success', scoreType: 'P', text: `✅ **DUAL CONSTRAINT** (Ocean Imagery): Used ${concreteReplaced} imagery words. Continue to enrich the commercial narrative with specific nouns.` });
    } else {
        feedback.push({ type: 'fail', scoreType: 'P', text: `❌ **DUAL CONSTRAINT** (Ocean Imagery): Low concrete imagery count. **Action:** Ground the commercial narrative in specific, tangible details.` });
    }

    return currentScore;
}

function scoreRhymeDiscipline(lines, currentScore, feedback, challengeType) {
    // Check AABB couplet in the last 4 lines (Drake's structural clarity)
    const endWords = lines.slice(-4).map(line => {
        const words = line.trim().split(/\s+/);
        return words[words.length - 1].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
    });
    
    let rhymeScore = 0;
    if (endWords.length >= 4) {
        if (endWords[0] === endWords[1] && endWords[2] === endWords[3]) { 
            rhymeScore += 40; 
        }
    }
    
    if (rhymeScore > 0) {
        currentScore += rhymeScore;
        feedback.push({ type: 'success', scoreType: 'F', text: `🏆 **DUAL CONSTRAINT** (Drake Discipline): Final 4 lines achieved a strict AABB couplet. This trains structural control.` });
    } else {
        feedback.push({ type: 'fail', scoreType: 'F', text: `❌ **DUAL CONSTRAINT** (Drake Discipline): Failed to achieve an AABB couplet in the final 4 lines. **Action:** Offer structural clarity by ending the poetic journey with a predictable rhyme.` });
    }

    return currentScore;
}


// --- E. Progress Tracking and Sharing ---

function displayFeedback(fScore, pScore, feedback) {
    const list = document.getElementById('feedback-list');
    list.innerHTML = '';
    
    // Sort feedback by score type for clarity
    const sortedFeedback = feedback.sort((a, b) => (a.scoreType > b.scoreType) ? 1 : -1);

    sortedFeedback.forEach(item => {
        const li = document.createElement('li');
        const icon = item.type === 'success' ? '🏆' : '❌';
        
        li.innerHTML = `<span style="font-weight: bold;">${icon} ${item.scoreType}-SCORE:</span> ${item.text}`;
        li.classList.add('feedback-item', item.type === 'success' ? 'feedback-success' : 'feedback-fail');
        list.appendChild(li);
    });
}

function saveProgress(fScore, pScore, lyric, title) {
    try {
        const newEntry = {
            date: new Date().toISOString().split('T')[0],
            title: title,
            fScore: fScore,
            pScore: pScore,
            lyric: lyric
        };
        
        savedProgress.push(newEntry);
        localStorage.setItem('lyricForgeProgress', JSON.stringify(savedProgress));
        
        console.log("Progress Saved Successfully!");
        
    } catch (e) {
        console.error("Saving Error: Failed to write to localStorage. Progress will not be tracked.", e);
    }
}

function saveAndShare() {
    // Calculate 7-day average for Report Card
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const recentScores = savedProgress.filter(e => e.date >= sevenDaysAgo);
    
    const totalF = recentScores.reduce((sum, entry) => sum + (entry.fScore || 0), 0);
    const totalP = recentScores.reduce((sum, entry) => sum + (entry.pScore || 0), 0);
    
    const avgF = recentScores.length > 0 ? Math.round(totalF / recentScores.length) : 0;
    const avgP = recentScores.length > 0 ? Math.round(totalP / recentScores.length) : 0;

    const fScore = document.getElementById('f-score').textContent;
    const pScore = document.getElementById('p-score').textContent;
    const feedbackText = Array.from(document.getElementById('feedback-list').children).map(li => li.textContent).join('\n');
    const lyric = document.getElementById('lyric-input').value;
    
    const content = `
*** GEMINI LYRIC FORGE: DAILY REPORT CARD (V4.0) ***
Date: ${new Date().toLocaleDateString()}
Challenge: ${currentChallenge.title}

--- TODAY'S SCORES ---
Flow/Structure Score (F-Score): ${fScore}/100
Poetry/Depth Score (P-Score): ${pScore}/100
Synthesis Score (F x P): ${Math.round((fScore/100) * (pScore/100) * 100)}%

--- PRESCRIPTIVE FEEDBACK ---
${feedbackText}

--- MASTERY TRAJECTORY (Last 7 Days) ---
F-Score Average (Commercial Viability): ${avgF}%
P-Score Average (Critical Depth): ${avgP}%
(Goal is 85% on both for Synthesis Mastery.)

--- YOUR LYRIC ---
${lyric}
`;

    // Download logic (Creates a shareable TXT file)
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LyricForge_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
    // We add the input listener here since DOMContentLoaded ensures the element exists.
    const lyricInput = document.getElementById('lyric-input');
    if (lyricInput) {
        lyricInput.addEventListener('input', updateCounters);
    }
    showView('dashboard-view');
});
