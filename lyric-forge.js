// lyric-forge.js (V5.0 - Semantic Intelligence Engine)

let currentChallenge = null;
let savedProgress = JSON.parse(localStorage.getItem('lyricForgeProgress')) || [];
let liveAnalysis = null; // Store live analysis for highlighting

// ============================================
// CORE NAVIGATION & VIEW MANAGEMENT
// ============================================

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
    const avgFElement = document.getElementById('avg-f-score');
    const avgPElement = document.getElementById('avg-p-score');

    if (avgFElement) avgFElement.textContent = `${avgF}%`;
    if (avgPElement) avgPElement.textContent = `${avgP}%`;
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

// ============================================
// UTILITY FUNCTIONS
// ============================================

function estimateSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const match = word.match(/[aeiouy]{1,2}/g);
    return match ? match.length : 1;
}

function getNonEmptyLines(text) {
    return text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
}

// Debounce function for live updates
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// LIVE ANALYSIS ENGINE
// ============================================

function analyzeLyricLive(text, mood, motif) {
    const lines = getNonEmptyLines(text);
    const lyricText = lines.join(' ').toLowerCase();
    
    // Calculate flow metrics
    let totalSyllables = 0;
    lines.forEach(line => {
        line.split(/\s+/).forEach(word => {
            totalSyllables += estimateSyllables(word);
        });
    });
    const avgSylPerLine = lines.length > 0 ? (totalSyllables / lines.length) : 0;
    const flowType = inferFlowStyle(avgSylPerLine);
    
    // Detect Drake lexicon words
    const drakeWords = LEXICON.DRAKE_LEXICON_WORDS.filter(word => 
        lyricText.includes(word)
    );
    
    // Detect abstract nouns
    const allAbstracts = LEXICON.getAllAbstractNouns();
    const abstractsFound = allAbstracts.filter(word => lyricText.includes(word));
    
    // Detect concrete nouns
    const allConcrete = LEXICON.getAllConcreteWords();
    const concreteFound = allConcrete.filter(word => lyricText.includes(word));
    const concreteCategories = countConcreteCategories(lyricText);
    
    // Detect motif words
    let motifWords = [];
    let motifCategories = {};
    let motifDensity = 0;
    if (motif && LEXICON.SEMANTIC_MOTIFS[motif]) {
        const motifData = calculateMotifDensity(lyricText, motif);
        motifWords = motifData.words;
        motifCategories = motifData.categories;
        motifDensity = motifData.density;
    }
    
    // Detect sentiment words
    let sentimentWords = [];
    if (mood && LEXICON.SENTIMENT_WORDS[mood]) {
        sentimentWords = LEXICON.SENTIMENT_WORDS[mood].filter(word => 
            lyricText.includes(word)
        );
    }
    
    return {
        lines: lines.length,
        avgSylPerLine: avgSylPerLine.toFixed(1),
        flowType: flowType,
        drakeWords: drakeWords,
        drakeCount: drakeWords.length,
        abstractsFound: abstractsFound,
        abstractCount: abstractsFound.length,
        concreteFound: concreteFound,
        concreteCount: concreteFound.length,
        concreteCategories: concreteCategories,
        motifWords: motifWords,
        motifCount: motifDensity,
        motifCategories: Object.keys(motifCategories).length,
        sentimentWords: sentimentWords,
        sentimentCount: sentimentWords.length,
        allWords: { drake: drakeWords, abstract: abstractsFound, concrete: concreteFound, motif: motifWords, sentiment: sentimentWords }
    };
}

function countConcreteCategories(lyricText) {
    const categories = new Set();
    for (let [category, words] of Object.entries(LEXICON.CONCRETE_LEXICON)) {
        if (words.some(word => lyricText.includes(word))) {
            categories.add(category);
        }
    }
    return Array.from(categories);
}

function calculateMotifDensity(lyricText, motifKey) {
    const motif = LEXICON.SEMANTIC_MOTIFS[motifKey];
    if (!motif) return { density: 0, categories: {}, words: [] };
    
    let totalMatches = 0;
    let categoryHits = {};
    let allWords = [];
    
    for (let [category, words] of Object.entries(motif)) {
        const matches = words.filter(word => lyricText.includes(word));
        if (matches.length > 0) {
            totalMatches += matches.length;
            categoryHits[category] = matches;
            allWords.push(...matches);
        }
    }
    
    return {
        density: totalMatches,
        categories: categoryHits,
        words: allWords
    };
}

function inferFlowStyle(avgSylPerLine) {
    const T = LEXICON.FLOW_SYLLABLE_THRESHOLDS;
    if (avgSylPerLine >= T.TRIPLET_MIN && avgSylPerLine <= T.TRIPLET_MAX) {
        return "Triplet (Dense)";
    } else if (avgSylPerLine >= T.CONVERSATIONAL_MIN && avgSylPerLine <= T.CONVERSATIONAL_MAX) {
        return "Conversational (Melodic)";
    } else if (avgSylPerLine < T.CONVERSATIONAL_MIN) {
        return "Sparse (Too Simple)";
    } else {
        return "Overcomplicated";
    }
}

// ============================================
// LIVE COUNTER UPDATES (WITH HIGHLIGHTING)
// ============================================

const updateCounters = debounce(function() {
    const text = document.getElementById('lyric-input').value;
    const mood = document.getElementById('input-mood').value;
    const motif = document.getElementById('input-motif').value;
    
    liveAnalysis = analyzeLyricLive(text, mood, motif);
    
    // Update line count
    const lineCountElement = document.getElementById('line-count');
    if (lineCountElement) {
        lineCountElement.textContent = liveAnalysis.lines;
        lineCountElement.className = liveAnalysis.lines >= 28 ? 'status-good' : 'status-progress';
    }
    
    // Update flow
    const sylCountElement = document.getElementById('syl-count');
    const flowTypeElement = document.getElementById('flow-type');
    if (sylCountElement) {
        sylCountElement.textContent = liveAnalysis.avgSylPerLine;
        const flowGood = liveAnalysis.flowType === "Conversational (Melodic)";
        sylCountElement.className = flowGood ? 'status-good' : 'status-warn';
    }
    if (flowTypeElement) {
        flowTypeElement.textContent = liveAnalysis.flowType;
    }
    
    // Update Drake lexicon count
    const drakeCountElement = document.getElementById('drake-count');
    if (drakeCountElement) {
        drakeCountElement.textContent = liveAnalysis.drakeCount;
        drakeCountElement.className = liveAnalysis.drakeCount >= 3 ? 'status-good' : 'status-warn';
    }
    
    // Update abstract count
    const abstractCountElement = document.getElementById('abstract-count');
    if (abstractCountElement) {
        abstractCountElement.textContent = liveAnalysis.abstractCount;
        abstractCountElement.className = liveAnalysis.abstractCount <= 1 ? 'status-good' : 'status-error';
    }
    
    // Update concrete count
    const concreteCountElement = document.getElementById('concrete-count');
    if (concreteCountElement) {
        concreteCountElement.textContent = liveAnalysis.concreteCount;
        concreteCountElement.className = liveAnalysis.concreteCount >= 5 ? 'status-good' : 'status-progress';
    }
    
    // Update motif count
    const motifCountElement = document.getElementById('motif-count');
    if (motifCountElement) {
        motifCountElement.textContent = liveAnalysis.motifCount;
        motifCountElement.className = liveAnalysis.motifCount >= 5 ? 'status-good' : 'status-progress';
    }
    
    // Update progress bars
    updateProgressBars(liveAnalysis);
    
    // Update contextual warnings
    updateContextualWarnings(liveAnalysis);
    
    // Apply text highlighting
    applyTextHighlighting(text, liveAnalysis);
    
}, 300);

function updateProgressBars(analysis) {
    // Line progress
    const lineProgress = document.getElementById('line-progress');
    if (lineProgress) {
        const percent = Math.min(100, (analysis.lines / 28) * 100);
        lineProgress.style.width = `${percent}%`;
    }
    
    // Concrete progress
    const concreteProgress = document.getElementById('concrete-progress');
    if (concreteProgress) {
        const percent = Math.min(100, (analysis.concreteCount / 8) * 100);
        concreteProgress.style.width = `${percent}%`;
    }
    
    // Motif progress
    const motifProgress = document.getElementById('motif-progress');
    if (motifProgress) {
        const percent = Math.min(100, (analysis.motifCount / 5) * 100);
        motifProgress.style.width = `${percent}%`;
    }
}

function updateContextualWarnings(analysis) {
    const warningsContainer = document.getElementById('contextual-warnings');
    if (!warningsContainer) return;
    
    let warnings = [];
    
    // Abstract noun warning
    if (analysis.abstractCount > 1) {
        warnings.push({
            type: 'error',
            text: `⚠️ ${analysis.abstractCount} abstract nouns detected. Remove ${analysis.abstractCount - 1}.`,
            words: analysis.abstractsFound.slice(0, 3).join(', ')
        });
    } else if (analysis.abstractCount === 1) {
        warnings.push({
            type: 'caution',
            text: `⚠️ 1 abstract noun found: "${analysis.abstractsFound[0]}". Consider replacing.`
        });
    }
    
    // Concrete imagery suggestion
    if (analysis.concreteCount < 5) {
        warnings.push({
            type: 'tip',
            text: `💡 Need ${5 - analysis.concreteCount} more concrete nouns for depth.`
        });
    }
    
    // Motif density warning
    if (analysis.motifCount < 5) {
        warnings.push({
            type: 'tip',
            text: `💡 Strengthen motif: Need ${5 - analysis.motifCount} more motif words.`
        });
    }
    
    // Render warnings
    if (warnings.length === 0) {
        warningsContainer.innerHTML = '<div class="warning-success">✅ No issues detected - looking good!</div>';
    } else {
        warningsContainer.innerHTML = warnings.map(w => `
            <div class="warning-${w.type}">
                ${w.text}
                ${w.words ? `<br><span class="warning-words">${w.words}</span>` : ''}
            </div>
        `).join('');
    }
}

function applyTextHighlighting(text, analysis) {
    const highlightOverlay = document.getElementById('highlight-overlay');
    if (!highlightOverlay) return;
    
    // Create a map of word positions and their types
    let html = text;
    const allWords = analysis.allWords;
    
    // Sort by length (longest first) to avoid partial replacements
    const wordMap = new Map();
    
    // Priority: abstract (highest) > concrete > motif > sentiment > drake
    allWords.abstract.forEach(word => wordMap.set(word, 'abstract'));
    allWords.concrete.forEach(word => {
        if (!wordMap.has(word)) wordMap.set(word, 'concrete');
    });
    allWords.motif.forEach(word => {
        if (!wordMap.has(word)) wordMap.set(word, 'motif');
    });
    allWords.drake.forEach(word => {
        if (!wordMap.has(word)) wordMap.set(word, 'drake');
    });
    
    // Sort by length descending
    const sortedWords = Array.from(wordMap.entries()).sort((a, b) => b[0].length - a[0].length);
    
    // Apply highlighting
    sortedWords.forEach(([word, type]) => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        html = html.replace(regex, match => `<span class="highlight-${type}">${match}</span>`);
    });
    
    highlightOverlay.innerHTML = html;
}

// ============================================
// CHALLENGE SETUP
// ============================================

const CHALLENGES = {
    drake_structure: {
        title: "🎤 Synthesis Drill: Melodic Flow (F-Score)",
        prompt: "Write 28 lines in 8/12/8 structure. Focus on melodic flow (5-7 syl/line) and commercial accessibility.",
        scoreType: 'F',
        targetLines: 28,
        moodRequired: true,
        motifRequired: true,
    },
    ocean_poetics: {
        title: "🌊 Poetic Workout: Narrative Depth (P-Score)",
        prompt: "Write 16 lines with zero abstractions. Build cohesive imagery through concrete sensory details.",
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
    
    // Clear live analysis
    liveAnalysis = null;
    
    // Reset counters
    updateCounters();
    showView('challenge-view');
}

function toggleInfo() {
    document.getElementById('info-section').classList.toggle('active');
}

function toggleWordList() {
    document.getElementById('word-list-panel').classList.toggle('active');
}

// ============================================
// WORD LIST DISPLAY (FOR UX)
// ============================================

function showMotifWords() {
    const motif = document.getElementById('input-motif').value;
    if (!motif) {
        alert('Please select a motif first');
        return;
    }
    
    const wordListContent = document.getElementById('word-list-content');
    const motifData = LEXICON.SEMANTIC_MOTIFS[motif];
    
    let html = `<h3>📘 ${motif} Motif Word Bank</h3>`;
    html += '<p class="word-list-hint">Use these words to strengthen your motif density:</p>';
    
    for (let [category, words] of Object.entries(motifData)) {
        html += `
            <div class="word-category">
                <h4>${category.toUpperCase()}</h4>
                <div class="word-chips">
                    ${words.map(w => `<span class="word-chip">${w}</span>`).join('')}
                </div>
            </div>
        `;
    }
    
    wordListContent.innerHTML = html;
    toggleWordList();
}

function showConcreteWords() {
    const wordListContent = document.getElementById('word-list-content');
    
    let html = '<h3>🎨 Concrete Noun Reference</h3>';
    html += '<p class="word-list-hint">Replace abstractions with these sensory details:</p>';
    
    const categories = ['FOOD', 'TEXTURE', 'VISUAL', 'NATURE', 'BODY'];
    categories.forEach(cat => {
        const words = LEXICON.CONCRETE_LEXICON[cat];
        html += `
            <div class="word-category">
                <h4>${cat}</h4>
                <div class="word-chips">
                    ${words.slice(0, 30).map(w => `<span class="word-chip">${w}</span>`).join('')}
                    ${words.length > 30 ? `<span class="word-chip-more">+${words.length - 30} more</span>` : ''}
                </div>
            </div>
        `;
    });
    
    wordListContent.innerHTML = html;
    toggleWordList();
}

function showAbstractWords() {
    const wordListContent = document.getElementById('word-list-content');
    
    const allAbstracts = LEXICON.getAllAbstractNouns();
    
    let html = '<h3>🚫 Abstract Nouns (AVOID THESE)</h3>';
    html += '<p class="word-list-hint">These words weaken your specificity. Use concrete replacements instead.</p>';
    
    html += `
        <div class="word-category">
            <div class="abstract-words">
                ${allAbstracts.map(w => `<span class="abstract-chip">${w}</span>`).join('')}
            </div>
        </div>
    `;
    
    wordListContent.innerHTML = html;
    toggleWordList();
}

// ============================================
// SCORING ENGINE (V5.0 - SEMANTIC INTELLIGENCE)
// ============================================

function submitLyric() {
    const lyric = document.getElementById('lyric-input').value;
    const lines = getNonEmptyLines(lyric);
    
    const mood = document.getElementById('input-mood').value;
    const motif = document.getElementById('input-motif').value;
    
    if (lines.length < 8) {
        alert("Please write at least 8 non-empty lines before scoring.");
        return;
    }
    
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
    
    // Calculate synthesis score
    const synthesisScore = Math.round((fScore / 100) * (pScore / 100) * 100);
    const synthesisElement = document.getElementById('synthesis-score');
    if (synthesisElement) {
        synthesisElement.textContent = synthesisScore;
    }
    
    displayFeedback(fScore, pScore, feedback);
    saveProgress(fScore, pScore, lyric, currentChallenge.title);
    showView('results-view');
}

// ============================================
// F-SCORE: SYNTHESIS DRILL (Drake Protocol)
// ============================================

function scoreSynthesisDrill(lines, mood, motif, feedback) {
    let fScore = 0;
    let pScore = 0;
    const lyricText = lines.join(' ').toLowerCase();
    const T = LEXICON.SCORING_THRESHOLDS;
    
    // 1. F-SCORE: Line Structure (40 points)
    const lineCount = lines.length;
    const targetLines = T.F_SCORE.LINE_EXACT;
    const tolerance = T.F_SCORE.LINE_TOLERANCE;
    
    if (lineCount === targetLines) {
        fScore += 40;
        feedback.push({ type: 'success', scoreType: 'F', text: `✅ Structure: Perfect ${targetLines} lines achieved. Optimal hook frequency.` });
    } else if (lineCount >= targetLines - tolerance && lineCount <= targetLines + tolerance) {
        fScore += 30;
        feedback.push({ type: 'success', scoreType: 'F', text: `✅ Structure: ${lineCount} lines (within range). Good structure.` });
    } else {
        feedback.push({ type: 'fail', scoreType: 'F', text: `❌ Structure: ${lineCount} lines. Target is ${targetLines} (±${tolerance}). Adjust line count for commercial algorithm.` });
    }
    
    // 2. F-SCORE: Flow Quality (30 points) - STRICTER
    let totalSyllables = 0;
    lines.forEach(line => {
        line.split(/\s+/).forEach(word => {
            totalSyllables += estimateSyllables(word);
        });
    });
    const avgSylPerLine = totalSyllables / lines.length;
    
    if (avgSylPerLine >= T.F_SCORE.FLOW_PERFECT.min && avgSylPerLine <= T.F_SCORE.FLOW_PERFECT.max) {
        fScore += 30;
        feedback.push({ type: 'success', scoreType: 'F', text: `🏆 Flow: Perfect melodic flow (${avgSylPerLine.toFixed(1)} syl/line). Maximum sing-along accessibility.` });
    } else if (avgSylPerLine >= T.F_SCORE.FLOW_ACCEPTABLE.min && avgSylPerLine <= T.F_SCORE.FLOW_ACCEPTABLE.max) {
        fScore += 15;
        feedback.push({ type: 'success', scoreType: 'F', text: `✅ Flow: Acceptable range (${avgSylPerLine.toFixed(1)} syl/line). Could be tighter for melodic perfection.` });
    } else {
        feedback.push({ type: 'fail', scoreType: 'F', text: `❌ Flow: ${avgSylPerLine.toFixed(1)} syl/line is outside the melodic range (${T.F_SCORE.FLOW_PERFECT.min}-${T.F_SCORE.FLOW_PERFECT.max}). Simplify phrasing.` });
    }
    
    // 3. F-SCORE: Drake Lexicon (30 points) - STRICTER
    const drakeWords = LEXICON.DRAKE_LEXICON_WORDS.filter(word => lyricText.includes(word));
    const drakeCount = drakeWords.length;
    
    if (drakeCount >= T.F_SCORE.LEXICON_PERFECT) {
        fScore += 30;
        feedback.push({ type: 'success', scoreType: 'F', text: `🏆 Lexicon: ${drakeCount} anchor words used (${drakeWords.join(', ')}). Elite commercial anchoring.` });
    } else if (drakeCount >= T.F_SCORE.LEXICON_MIN) {
        fScore += 20;
        feedback.push({ type: 'success', scoreType: 'F', text: `✅ Lexicon: ${drakeCount} anchor words (${drakeWords.join(', ')}). Meets minimum.` });
    } else {
        feedback.push({ type: 'fail', scoreType: 'F', text: `❌ Lexicon: Only ${drakeCount} anchor words. Need ${T.F_SCORE.LEXICON_MIN}+ for commercial viability. Add: time, team, top, real.` });
    }
    
    // DUAL CONSTRAINT: Ocean Imagery (30 points for P-Score)
    pScore = scoreImageryDensity(lines, pScore, feedback, motif);
    
    return { fScore: Math.min(100, fScore), pScore: pScore, feedback: feedback };
}

// ============================================
// P-SCORE: POETIC WORKOUT (Ocean Methodology)
// ============================================

function scorePoeticWorkout(lines, mood, motif, feedback) {
    let fScore = 0;
    let pScore = 0;
    const lyricText = lines.join(' ').toLowerCase();
    const T = LEXICON.SCORING_THRESHOLDS;
    
    // 1. P-SCORE: Lexical Purity (40 points) - STRICTER
    const allAbstracts = LEXICON.getAllAbstractNouns();
    const abstractsFound = allAbstracts.filter(word => lyricText.includes(word));
    const abstractCount = abstractsFound.length;
    
    if (abstractCount === T.P_SCORE.ABSTRACT_PERFECT) {
        pScore += 40;
        feedback.push({ type: 'success', scoreType: 'P', text: `🏆 Purity: Zero abstractions. Perfect lexical specificity achieved.` });
    } else if (abstractCount <= T.P_SCORE.ABSTRACT_MAX) {
        pScore += 25;
        feedback.push({ type: 'success', scoreType: 'P', text: `✅ Purity: ${abstractCount} abstraction found (${abstractsFound[0]}). Acceptable control.` });
    } else {
        feedback.push({ type: 'fail', scoreType: 'P', text: `❌ Purity: ${abstractCount} abstractions (${abstractsFound.slice(0, 3).join(', ')}). Maximum ${T.P_SCORE.ABSTRACT_MAX} allowed. Replace with concrete imagery.` });
    }
    
    // 2. P-SCORE: Concrete Imagery Density (30 points) - STRICTER
    const allConcrete = LEXICON.getAllConcreteWords();
    const concreteFound = allConcrete.filter(word => lyricText.includes(word));
    const concreteCount = concreteFound.length;
    const concreteCategories = countConcreteCategories(lyricText);
    
    if (concreteCount >= T.P_SCORE.CONCRETE_PERFECT) {
        pScore += 30;
        feedback.push({ type: 'success', scoreType: 'P', text: `🏆 Imagery: ${concreteCount} concrete nouns across ${concreteCategories.length} sensory categories. Rich, multi-dimensional imagery.` });
    } else if (concreteCount >= T.P_SCORE.CONCRETE_MIN) {
        pScore += 20;
        feedback.push({ type: 'success', scoreType: 'P', text: `✅ Imagery: ${concreteCount} concrete nouns. Good density. Push to ${T.P_SCORE.CONCRETE_PERFECT}+ for mastery.` });
    } else {
        feedback.push({ type: 'fail', scoreType: 'P', text: `❌ Imagery: Only ${concreteCount} concrete nouns. Need ${T.P_SCORE.CONCRETE_MIN}+ for narrative depth. Add sensory details.` });
    }
    
    // 3. P-SCORE: Motif Cohesion (30 points) - STRICTER
    const motifData = calculateMotifDensity(lyricText, motif);
    const motifDensity = motifData.density;
    const motifCategoryCount = Object.keys(motifData.categories).length;
    
    const sentimentKey = mood;
    const sentimentWords = LEXICON.SENTIMENT_WORDS[sentimentKey];
    const sentimentCount = sentimentWords.filter(word => lyricText.includes(word)).length;
    
    if (motifDensity >= T.P_SCORE.MOTIF_DENSITY_MIN && motifCategoryCount >= T.P_SCORE.MOTIF_DIVERSITY && sentimentCount >= T.P_SCORE.SENTIMENT_MIN) {
        pScore += 30;
        feedback.push({ type: 'success', scoreType: 'P', text: `🏆 Cohesion: ${motifDensity} motif words across ${motifCategoryCount} categories + ${sentimentCount} sentiment words. Extended metaphor is dense and cohesive.` });
    } else {
        const issues = [];
        if (motifDensity < T.P_SCORE.MOTIF_DENSITY_MIN) issues.push(`need ${T.P_SCORE.MOTIF_DENSITY_MIN - motifDensity} more motif words`);
        if (motifCategoryCount < T.P_SCORE.MOTIF_DIVERSITY) issues.push(`use ${T.P_SCORE.MOTIF_DIVERSITY - motifCategoryCount} more motif categories`);
        if (sentimentCount < T.P_SCORE.SENTIMENT_MIN) issues.push(`need ${T.P_SCORE.SENTIMENT_MIN - sentimentCount} more ${mood} sentiment words`);
        
        feedback.push({ type: 'fail', scoreType: 'P', text: `❌ Cohesion: Weak metaphor density (${issues.join(', ')}). Sustain your ${motif} motif throughout.` });
    }
    
    // DUAL CONSTRAINT: Drake Rhyme Discipline (40 points for F-Score)
    fScore = scoreRhymeDiscipline(lines, fScore, feedback);
    
    return { fScore: fScore, pScore: Math.min(100, pScore), feedback: feedback };
}

// ============================================
// DUAL CONSTRAINT HELPERS
// ============================================

function scoreImageryDensity(lines, currentScore, feedback, motif) {
    const lyricText = lines.join(' ').toLowerCase();
    const allConcrete = LEXICON.getAllConcreteWords();
    const concreteFound = allConcrete.filter(word => lyricText.includes(word));
    const concreteCount = concreteFound.length;
    const T = LEXICON.SCORING_THRESHOLDS;
    
    if (concreteCount >= T.P_SCORE.CONCRETE_PERFECT) {
        currentScore += 30;
        feedback.push({ type: 'success', scoreType: 'P', text: `💎 DUAL CONSTRAINT (Ocean Imagery): ${concreteCount} concrete nouns. Elite synthesis of commercial structure with poetic depth.` });
    } else if (concreteCount >= T.P_SCORE.CONCRETE_MIN) {
        currentScore += 15;
        feedback.push({ type: 'success', scoreType: 'P', text: `✅ DUAL CONSTRAINT (Ocean Imagery): ${concreteCount} concrete nouns. Good balance.` });
    } else {
        feedback.push({ type: 'fail', scoreType: 'P', text: `❌ DUAL CONSTRAINT (Ocean Imagery): Only ${concreteCount} concrete nouns. Need ${T.P_SCORE.CONCRETE_MIN}+ to ground commercial narrative in specificity.` });
    }
    
    return currentScore;
}

function scoreRhymeDiscipline(lines, currentScore, feedback) {
    // Check AABB couplet in final 4 lines
    if (lines.length < 4) {
        feedback.push({ type: 'fail', scoreType: 'F', text: `❌ DUAL CONSTRAINT (Drake Discipline): Need at least 4 lines to check rhyme scheme.` });
        return currentScore;
    }
    
    const endWords = lines.slice(-4).map(line => {
        const words = line.trim().split(/\s+/);
        return words[words.length - 1].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
    });
    
    if (endWords.length >= 4 && endWords[0] === endWords[1] && endWords[2] === endWords[3]) {
        currentScore += 40;
        feedback.push({ type: 'success', scoreType: 'F', text: `🏆 DUAL CONSTRAINT (Drake Discipline): Perfect AABB couplet in final 4 lines. Structural clarity achieved.` });
    } else {
        feedback.push({ type: 'fail', scoreType: 'F', text: `❌ DUAL CONSTRAINT (Drake Discipline): Final 4 lines don't form AABB couplet. End poetic journey with predictable rhyme: AA-BB.` });
    }
    
    return currentScore;
}

// ============================================
// FEEDBACK DISPLAY
// ============================================

function displayFeedback(fScore, pScore, feedback) {
    const list = document.getElementById('feedback-list');
    list.innerHTML = '';
    
    const sortedFeedback = feedback.sort((a, b) => (a.scoreType > b.scoreType) ? 1 : -1);

    sortedFeedback.forEach(item => {
        const li = document.createElement('li');
        const icon = item.type === 'success' ? '🏆' : '❌';
        
        li.innerHTML = `<span class="feedback-label">${icon} ${item.scoreType}-SCORE:</span> ${item.text}`;
        li.classList.add('feedback-item', item.type === 'success' ? 'feedback-success' : 'feedback-fail');
        list.appendChild(li);
    });
}

// ============================================
// PROGRESS TRACKING & EXPORT
// ============================================

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
        
    } catch (e) {
        console.error("Saving Error:", e);
    }
}

async function saveAndShare() {
    // Use html2canvas for visual export
    const scoreCard = document.getElementById('export-card');
    
    if (typeof html2canvas === 'undefined') {
        // Fallback to text export
        exportAsText();
        return;
    }
    
    try {
        const canvas = await html2canvas(scoreCard, {
            backgroundColor: '#1e3a8a',
            scale: 2,
            logging: false
        });
        
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `lyric-forge-${new Date().toISOString().split('T')[0]}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    } catch (e) {
        console.error("Export error:", e);
        exportAsText();
    }
}

function exportAsText() {
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
♊ GEMINI LYRIC FORGE V5.0 - SESSION REPORT
Date: ${new Date().toLocaleDateString()}
Challenge: ${currentChallenge.title}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TODAY'S SCORES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
F-Score (Structure):  ${fScore}/100
P-Score (Poetry):     ${pScore}/100
Synthesis (F × P):    ${Math.round((fScore/100) * (pScore/100) * 100)}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRESCRIPTIVE FEEDBACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${feedbackText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MASTERY TRAJECTORY (Last 7 Days)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
F-Score Average: ${avgF}%
P-Score Average: ${avgP}%
Goal: 85%+ on both for Synthesis Mastery

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR LYRIC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${lyric}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lyric-forge-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const lyricInput = document.getElementById('lyric-input');
    if (lyricInput) {
        lyricInput.addEventListener('input', updateCounters);
    }
    
    // Mood/motif change triggers update
    const moodSelect = document.getElementById('input-mood');
    const motifSelect = document.getElementById('input-motif');
    if (moodSelect) moodSelect.addEventListener('change', updateCounters);
    if (motifSelect) motifSelect.addEventListener('change', updateCounters);
    
    showView('dashboard-view');
});
