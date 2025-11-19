async function callAgent(mode, input) {
    try {
        const response = await fetch('/agent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mode, input })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        return data.result;
    } catch (error) {
        console.error('Error calling agent:', error);
        throw error;
    }
}

async function runSummarizer() {
    const input = document.getElementById('summarizerInput').value.trim();
    const loading = document.getElementById('summarizerLoading');
    const result = document.getElementById('summarizerResult');
    const content = document.getElementById('summarizerContent');
    const error = document.getElementById('summarizerError');
    
    if (!input) {
        error.textContent = 'Please enter some text to summarize';
        error.classList.add('show');
        return;
    }
    
    error.classList.remove('show');
    result.classList.remove('show');
    loading.classList.add('show');
    
    try {
        const summary = await callAgent('summarizer', input);
        content.textContent = summary;
        result.classList.add('show');
    } catch (err) {
        error.textContent = 'Error: ' + err.message;
        error.classList.add('show');
    } finally {
        loading.classList.remove('show');
    }
}

async function runTaskGenerator() {
    const input = document.getElementById('taskInput').value.trim();
    const loading = document.getElementById('taskLoading');
    const result = document.getElementById('taskResult');
    const content = document.getElementById('taskContent');
    const error = document.getElementById('taskError');
    
    if (!input) {
        error.textContent = 'Please enter a goal';
        error.classList.add('show');
        return;
    }
    
    error.classList.remove('show');
    result.classList.remove('show');
    loading.classList.add('show');
    
    try {
        const tasks = await callAgent('taskGenerator', input);
        content.textContent = tasks;
        result.classList.add('show');
    } catch (err) {
        error.textContent = 'Error: ' + err.message;
        error.classList.add('show');
    } finally {
        loading.classList.remove('show');
    }
}

async function runQuoteTool() {
    const loading = document.getElementById('quoteLoading');
    const result = document.getElementById('quoteResult');
    const content = document.getElementById('quoteContent');
    const error = document.getElementById('quoteError');
    
    error.classList.remove('show');
    result.classList.remove('show');
    loading.classList.add('show');
    
    try {
        const quote = await callAgent('quote', '');
        content.textContent = quote;
        result.classList.add('show');
    } catch (err) {
        error.textContent = 'Error: ' + err.message;
        error.classList.add('show');
    } finally {
        loading.classList.remove('show');
    }
}
