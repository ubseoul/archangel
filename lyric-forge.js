// lyric-forge.js (Finalized V4.0 - Seamless Creative Engine)

let currentChallenge = null;
let savedProgress = JSON.parse(localStorage.getItem('lyricForgeProgress')) || [];

// --- A. Utility & Setup ---

function estimateSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const match = word.match(/[aeiouy]{1,2}/g);
    return match ? match.length : 0;
}

function getNonEmptyLines(text) {
    // Only non-empty, trimmed lines count towards structure
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

// --- B. UI & Navigation ---

function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    
    if (viewId === 'dashboard-view') {
        updateDashboardProgress();
    }
}

function updateDashboardProgress() {
    const { avgF, avgP } = calculateAverageScores();
    document.getElementById('avg-f-score').textContent = `${avgF}%`;
    document.getElementById('avg-p-score').textContent = `${avgP}%`;
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

    document.getElementById('line-count').textContent = lineCount;
    document.getElementById('bar-count').textContent = Math.floor(lineCount / 4);
    document.getElementById('syl-count').textContent = avgSylPerLine.toFixed(1);
    document.getElementById('flow-type').textContent = flowType;
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
        motifRequired: true, // Dual Constraint
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
    
    // Reset inputs and inject info content
    document.getElementById('input-mood').value = "";
    document.getElementById('input-motif').value = "";
    
    // Inject relevant info content (Now relies on the simplified INFO_CONTENT object)
    document.getElementById('info-section').innerHTML = INFO_CONTENT[type].content;
    document.getElementById('info-section').classList.remove('active'); // Start closed
    
    // Show/hide inputs based on challenge requirements
    document.getElementById('input-mood').parentNode.classList.remove('hidden'); // Simplified inputs are always shown in V4.0
    document.getElementById('input-motif').parentNode.classList.remove('hidden');

    updateCounters();
    showView('challenge-view');
}

// Simplified Info Content for V4.0 UX
const INFO_CONTENT = {
    drake_structure: {
        content: `
            <h4>Structure Strategy: The Sandwich Method (F-Score Value)</h4>
            <ul>
                <li>**Action:** Aim for short verses (max 12 lines) to keep the hook frequency high.</li>
                <li>**Value:** This maximizes streaming retention and commercial viability.</li>
                <li>**Dual Constraint:** Use your selected Motif (Car/Color) frequently to ground the commercial topic in specific, Ocean-style imagery.</li>
            </ul>
            <h4>Flow Strategy: Inferred Rhythm (R-Score Value)</h4>
            <ul>
                <li>**Insight:** Keep your **Avg Syl/Line** status between 5-7 to maintain a relaxed, conversational flow (Drake's signature).</li>
            </ul>
        `
    },
    ocean_poetics: {
        content: `
            <h4>Lexical Specificity (P-Score Value)</h4>
            <ul>
                <li>**STRICT PENALTY:** The tool will penalize you heavily for using Abstract Nouns (sadness, truth, passion).</li>
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
    const mood = document.getElementById('input-mood').value;
    const motif = document.getElementById('input-motif').value;
    
    if (lines.length < 8 || !mood || !motif) {
        alert("Please write at least 8 lines and select a Mood and Motif before scoring.");
        return;
    }

    let fScore = 0;
    let pScore = 0;
    let feedback = [];

    // Run scoring logic based on the current challenge type
    if (currentChallenge.scoreType === 'F') {
        ({ fScore, pScore, feedback } = scoreSynthesisDrill(lines, mood, motif, feedback));
    } else if (currentChallenge.scoreType === 'P') {
        ({ fScore, pScore, feedback } = scorePoeticWorkout(lines, mood, motif, feedback));
    }

    // Display results
    document.getElementById('f-score').textContent = fScore;
    document.getElementById('p-score').textContent = pScore;
    
    displayFeedback(fScore, pScore, feedback);
    showView('results-view');

    // Save for progress tracking
    saveProgress(fScore, pScore, lyric, currentChallenge.title);
}

// --- SYNTHESIS DRILL (F-Score Focus with P-Score Dual Constraint) ---

function scoreSynthesisDrill(lines, mood, motif, feedback) {
    let fScore = 0;
    let pScore = 0;
    
    // 1. F-Score: Structural Compliance (Max 40 points)
    const structureConstraint = CHALLENGES.drake_structure.targetLines;
    if (lines.length >= structureConstraint - 4 && lines.length <= structureConstraint + 4) {
        fScore += 40;
        feedback.push({ type: 'success', scoreType: 'F', text: `🏆 Structure: Line count (${lines.length}) is near the target. Commercial Algorithm structure met.` }); 
    } else {
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

    // --- DUAL CONSTRAINT: P-SCORE Check (Ocean's Imagery) (Max 100 points, does not affect FScore) ---
    pScore = scoreImageryDensity(lines, pScore, feedback, 'Synthesis');

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
        // Severe penalty for 2+ abstract words
        feedback.push({ type: 'fail', scoreType: 'P', text: `🛑 Specificity Fail: Used ${abstractUsage} abstract nouns. **Action:** Swap words like 'sadness' or 'joy' for concrete nouns (e.g., cold texture, shadow).` });
    }

    // 2. P-SCORE: Imagery Cohesion (Max 40 points)
    const emotionWords = LEXICON.SENTIMENT_WORDS[mood].filter(word => lyricText.includes(word)).length;
    const motifWords = LEXICON.OCEAN_MOTIFS[motif] ? (lyricText.match(new RegExp(LEXICON.OCEAN_MOTIFS[motif], 'g')) || []).length : 0;
    const concreteReplaced = LEXICON.CONCRETE_REPLACERS.filter(word => lyricText.includes(word)).length;

    if (emotionWords >= 3 && motifWords >= 3 && concreteReplaced >= 2) {
        pScore += 40;
        feedback.push({ type: 'success', scoreType: 'P', text: `🏆 Cohesion: High density of **${motif}** motif and ${mood} sentiment. The Extended Metaphor is cohesive!` });
    } else {
        feedback.push({ type: 'fail', scoreType: 'P', text: `❌ Cohesion: Low density of motif/sentiment words. **Action:** Integrate your ${motif} motif more often alongside ${mood} language (need 3+ hits on each).` });
    }

    // 3. P-SCORE: Structural Subversion (Max 20 points)
    const hasRepetitiveLines = lines.some((line, i) => lines.slice(i + 1).some(otherLine => otherLine.trim() === line.trim() && line.length > 8));
    
    if (!hasRepetitiveLines) {
        pScore += 20;
        feedback.push({ type: 'success', scoreType: 'P', text: `✅ Subversion: Avoided repetition. **Value:** This linearity ensures active decoding and critical engagement.` });
    } else {
        feedback.push({ type: 'fail', scoreType: 'P', text: `❌ Subversion: Detected repetitive lines. **Action:** Avoid choruses; strive for a linear (A-B-C-D) narrative path.` });
    }

    // --- DUAL CONSTRAINT: F-SCORE Check (Drake's Rhyme Simplicity) (Max 100 points, does not affect PScore) ---
    fScore = scoreRhymeDiscipline(lines, fScore, feedback, 'Workout');

    return { fScore: fScore, pScore: Math.min(100, pScore), feedback: feedback };
}

// --- DUAL CONSTRAINT HELPER FUNCTIONS (New V4.0) ---

function scoreImageryDensity(lines, currentScore, feedback, challengeType) {
    // This runs during the DRAKE drill to ensure the lyric has depth (P-Score element)
    const lyricText = lines.join(' ').toLowerCase();
    const concreteReplaced = LEXICON.CONCRETE_REPLACERS.filter(word => lyricText.includes(word)).length;
    
    if (concreteReplaced >= 4) {
        currentScore += 30; // 30 bonus points for deep imagery
        feedback.push({ type: 'success', scoreType: 'P', text: `💎 **DUAL CONSTRAINT** (P-Score Bonus): Used ${concreteReplaced} high-impact imagery words. Excellent blending of commercial structure with poetic depth.` });
    } else if (concreteReplaced >= 2) {
        currentScore += 15;
        feedback.push({ type: 'success', scoreType: 'P', text: `✅ **DUAL CONSTRAINT** (P-Score Bonus): Used ${concreteReplaced} imagery words. Continue to enrich the commercial narrative with specific nouns.` });
    } else {
        feedback.push({ type: 'fail', scoreType: 'P', text: `❌ **DUAL CONSTRAINT** (P-Score Bonus): Low concrete imagery count. **Action:** Even in commercial tracks, ground the narrative with specific, tangible details.` });
    }

    return currentScore;
}

function scoreRhymeDiscipline(lines, currentScore, feedback, challengeType) {
    // This runs during the OCEAN workout to ensure the lyric has structural discipline (F-Score element)
    const endWords = lines.slice(-4).map(line => {
        const words = line.trim().split(/\s+/);
        return words[words.length - 1].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
    });
    
    let rhymeScore = 0;
    if (endWords.length >= 4) {
        // Check for AABB couplet in the last 4 lines
        if (endWords[0] === endWords[1] && endWords[2] === endWords[3]) { 
            rhymeScore += 40; 
        }
    }
    
    if (rhymeScore > 0) {
        currentScore += rhymeScore;
        feedback.push({ type: 'success', scoreType: 'F', text: `🏆 **DUAL CONSTRAINT** (F-Score Bonus): Last 4 lines achieved a strict AABB couplet. This trains structural discipline even during a poetic exercise.` });
    } else {
        feedback.push({ type: 'fail', scoreType: 'F', text: `❌ **DUAL CONSTRAINT** (F-Score Bonus): Failed to achieve an AABB couplet in the final 4 lines. **Action:** Practice controlling the listener's ear by ending the poetic journey with structural clarity.` });
    }

    return currentScore;
}


// --- E. Progress Tracking and Sharing (Fixed and Enhanced) ---

function displayFeedback(fScore, pScore, feedback) {
    const list = document.getElementById('feedback-list');
    list.innerHTML = '';
    
    // Sort feedback by score type for clarity
    const sortedFeedback = feedback.sort((a, b) => (a.scoreType > b.scoreType) ? 1 : -1);

    sortedFeedback.forEach(item => {
        const li = document.createElement('li');
        const icon = item.type === 'success' ? '🏆' : '❌';
        
        // Use bold text to highlight the action/insight
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
            // R-score is now inferred or secondary, focus on F and P
            lyric: lyric
        };
        
        savedProgress.push(newEntry);
        localStorage.setItem('lyricForgeProgress', JSON.stringify(savedProgress));
        
        // Show immediate success confirmation
        console.log("Progress Saved Successfully!");
        
    } catch (e) {
        console.error("Saving Error: Failed to write to localStorage.", e);
        alert("Saving Failed: Your browser storage might be full or blocked. Progress will not be tracked.");
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

    // Download logic
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
    showView('dashboard-view');
});
