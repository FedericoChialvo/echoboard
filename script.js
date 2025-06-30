document.addEventListener('DOMContentLoaded', () => {
    // Handle dynamic viewport height for mobile browsers
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Set initial value
    setVH();
    
    // Update on window resize and orientation change
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => {
        setTimeout(setVH, 100); // Slight delay for orientation change
    });

    const textInput = document.getElementById('text-input');
    const messageOutput = document.getElementById('message-output');
    const defaultMessage = 'Your message will appear here...';
    const speakButton = document.getElementById('speak-button');

    // TTS Controls
    const voiceSelect = document.getElementById('voice-select');
    const rateSlider = document.getElementById('rate-slider');
    const pitchSlider = document.getElementById('pitch-slider');
    const rateValueDisplay = document.getElementById('rate-value');
    const pitchValueDisplay = document.getElementById('pitch-value');

    // On-Screen Keyboard Elements
    const onScreenKeyboardContainer = document.getElementById('on-screen-keyboard');

    // Symbol Grid Elements
    const symbolGridContainer = document.getElementById('symbol-grid');
    const symbolCategoryNav = document.getElementById('symbol-category-nav');
    const symbolGridTitle = document.getElementById('symbol-grid-title');
    const symbolsToggleBtn = document.getElementById('symbols-toggle-btn');
    const symbolsPanelContainer = document.getElementById('symbol-grid-container');

    // Add Symbol Form Elements
    const addSymbolFormContainer = document.getElementById('add-symbol-form-container');
    const newSymbolDisplayInput = document.getElementById('new-symbol-display');
    const newSymbolTextInput = document.getElementById('new-symbol-text');
    const newSymbolImageInput = document.getElementById('new-symbol-image');
    const addSymbolButton = document.getElementById('add-symbol-button');

    // Quick Phrase Buttons
    const quickPhraseButtons = document.querySelectorAll('.quick-phrase-button');

    // Message Editing Buttons
    const deleteLastButton = document.getElementById('delete-last-button');
    const clearAllButton = document.getElementById('clear-all-button');

    // UI Customization Buttons
    const fontSizeSmallButton = document.getElementById('font-size-s');
    const fontSizeMediumButton = document.getElementById('font-size-m');
    const fontSizeLargeButton = document.getElementById('font-size-l');
    const themeToggleButton = document.getElementById('theme-toggle-button');

    // Modal Elements
    const controlsModal = document.getElementById('controls-modal');
    const quickPhrasesModal = document.getElementById('quick-phrases-modal');
    const addSymbolModal = document.getElementById('add-symbol-modal');
    
    // Modal Buttons
    const controlsModalBtn = document.getElementById('controls-modal-btn');
    const quickPhrasesModalBtn = document.getElementById('quick-phrases-modal-btn');
    const addSymbolModalBtn = document.getElementById('add-symbol-modal-btn');
    
    // Modal Close Buttons
    const modalCloseButtons = document.querySelectorAll('.modal-close');

    // Local Storage Keys
    const FONT_SIZE_LS_KEY = 'echoboard_fontSize';
    const THEME_LS_KEY = 'echoboard_theme';
    const CUSTOM_SYMBOLS_LS_KEY = 'echoboard_customSymbols';
    const SYMBOLS_PANEL_LS_KEY = 'echoboard_symbolsPanelCollapsed';
    const VOICE_LS_KEY = 'echoboard_voiceName';

    // Current category and symbol data
    let currentCategory = 'basic';
    let currentImagePreview = null;
    let symbolsPanelCollapsed = false;

    // Symbol Categories with organized data
    const symbolCategories = {
        basic: [
            { id: 'basic1', display: 'Help', text: 'Help ', color: '#FF6347' },
            { id: 'basic2', display: 'Yes', text: 'Yes ', color: '#32CD32' },
            { id: 'basic3', display: 'No', text: 'No ', color: '#1E90FF' },
            { id: 'basic4', display: 'Want', text: 'Want ', color: '#FFD700' },
            { id: 'basic5', display: 'More', text: 'More ', color: '#40E0D0' },
            { id: 'basic6', display: 'Finished', text: 'Finished ', color: '#8A2BE2' }
        ],
        emotions: [
            { id: 'emotion1', display: 'Happy', text: 'I feel happy ', color: '#FFD700' },
            { id: 'emotion2', display: 'Sad', text: 'I feel sad ', color: '#4169E1' },
            { id: 'emotion3', display: 'Angry', text: 'I am angry ', color: '#DC143C' },
            { id: 'emotion4', display: 'Excited', text: 'I am excited ', color: '#FF69B4' },
            { id: 'emotion5', display: 'Tired', text: 'I am tired ', color: '#9370DB' },
            { id: 'emotion6', display: 'Scared', text: 'I am scared ', color: '#8B4513' }
        ],
        actions: [
            { id: 'action1', display: 'Eat', text: 'Eat ', color: '#9370DB' },
            { id: 'action2', display: 'Drink', text: 'Drink ', color: '#FFA500' },
            { id: 'action3', display: 'Sleep', text: 'Sleep ', color: '#4682B4' },
            { id: 'action4', display: 'Play', text: 'Play ', color: '#32CD32' },
            { id: 'action5', display: 'Go', text: 'Go ', color: '#FF6347' },
            { id: 'action6', display: 'Stop', text: 'Stop ', color: '#DC143C' },
            { id: 'action7', display: 'Bathroom', text: 'Bathroom ', color: '#DA70D6' },
            { id: 'action8', display: 'Outside', text: 'Go outside ', color: '#00CED1' }
        ],
        custom: [] // Will be loaded from localStorage
    };

    // Color palette for new symbols
    const newSymbolColors = ['#FF69B4', '#7FFFD4', '#FF7F50', '#6495ED', '#DC143C', '#00CED1', '#9400D3', '#FFDAB9', '#8FBC8F'];
    let nextColorIndex = 0;

    let synth;
    let voices = [];

    // Modal Management Functions
    function openModal(modal) {
        if (modal) {
            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
            
            // Focus the first focusable element in the modal
            const firstFocusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                setTimeout(() => firstFocusable.focus(), 100);
            }
            
            // Trap focus in modal
            trapFocus(modal);
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            
            // Return focus to the button that opened the modal or text input
            if (textInput) {
                textInput.focus();
            }
        }
    }

    function closeAllModals() {
        [controlsModal, quickPhrasesModal, addSymbolModal].forEach(modal => {
            if (modal) closeModal(modal);
        });
    }

    function trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // Modal Event Listeners
    if (controlsModalBtn) {
        controlsModalBtn.addEventListener('click', () => openModal(controlsModal));
    }

    if (quickPhrasesModalBtn) {
        quickPhrasesModalBtn.addEventListener('click', () => openModal(quickPhrasesModal));
    }

    if (addSymbolModalBtn) {
        addSymbolModalBtn.addEventListener('click', () => openModal(addSymbolModal));
    }

    // Close button event listeners
    modalCloseButtons.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            closeModal(modal);
        });
    });

    // Close modal when clicking outside
    [controlsModal, quickPhrasesModal, addSymbolModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        }
    });

    // Accessibility and Keyboard Navigation
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    let currentFocusIndex = 0;
    let focusableElementsList = [];

    // Initialize keyboard navigation
    function updateFocusableElements() {
        focusableElementsList = Array.from(document.querySelectorAll(focusableElements)).filter(el => {
            return !el.disabled && el.offsetWidth > 0 && el.offsetHeight > 0;
        });
    }

    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Close modals with Escape key
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                closeModal(openModal);
                return;
            } else if (textInput) {
                textInput.focus();
            }
        }

        // Handle keyboard navigation for all interactive elements
        if (e.key === 'Tab') {
            updateFocusableElements();
            return; // Let browser handle normal tab navigation
        }

        // Handle Enter and Space for button activation
        if ((e.key === 'Enter' || e.key === ' ') && document.activeElement) {
            const activeElement = document.activeElement;
            
            // Special handling for specific element types
            if (activeElement.classList.contains('keyboard-key')) {
                e.preventDefault();
                handleKeyPress(activeElement.getAttribute('data-key'));
            } else if (activeElement.classList.contains('symbol-item')) {
                e.preventDefault();
                handleSymbolClick(activeElement.getAttribute('data-text'));
            } else if (activeElement.classList.contains('category-tab')) {
                e.preventDefault();
                switchCategory(activeElement.getAttribute('data-category'));
            } else if (activeElement.classList.contains('quick-phrase-button')) {
                e.preventDefault();
                const phrase = activeElement.getAttribute('data-phrase');
                handleQuickPhrase(phrase);
                // Close modal after adding phrase
                const modal = activeElement.closest('.modal');
                if (modal) closeModal(modal);
            } else if (activeElement.id === 'symbols-toggle-btn') {
                e.preventDefault();
                toggleSymbolsPanel();
            } else if (activeElement.tagName === 'BUTTON' && e.key === 'Enter') {
                e.preventDefault();
                activeElement.click();
            }
        }

        // Arrow key navigation for symbol grid and keyboard
        if (e.key.startsWith('Arrow')) {
            const activeElement = document.activeElement;
            if (activeElement && (activeElement.classList.contains('symbol-item') || 
                                activeElement.classList.contains('keyboard-key') ||
                                activeElement.classList.contains('category-tab'))) {
                e.preventDefault();
                handleArrowNavigation(e.key, activeElement);
            }
        }
    });

    function handleArrowNavigation(key, currentElement) {
        const parent = currentElement.closest('#symbol-grid, #on-screen-keyboard, #symbol-category-nav');
        if (!parent) return;

        const siblings = Array.from(parent.querySelectorAll('.symbol-item, .keyboard-key, .category-tab'));
        const currentIndex = siblings.indexOf(currentElement);
        let newIndex = currentIndex;

        if (parent.id === 'symbol-category-nav') {
            // Linear navigation for category tabs
            if (key === 'ArrowLeft' || key === 'ArrowUp') {
                newIndex = Math.max(0, currentIndex - 1);
            } else if (key === 'ArrowRight' || key === 'ArrowDown') {
                newIndex = Math.min(siblings.length - 1, currentIndex + 1);
            }
        } else {
            // Grid navigation for symbols and keyboard
            const style = window.getComputedStyle(parent);
            const columns = style.gridTemplateColumns.split(' ').length;

            switch (key) {
                case 'ArrowLeft':
                    newIndex = Math.max(0, currentIndex - 1);
                    break;
                case 'ArrowRight':
                    newIndex = Math.min(siblings.length - 1, currentIndex + 1);
                    break;
                case 'ArrowUp':
                    newIndex = Math.max(0, currentIndex - columns);
                    break;
                case 'ArrowDown':
                    newIndex = Math.min(siblings.length - 1, currentIndex + columns);
                    break;
            }
        }

        if (newIndex !== currentIndex && siblings[newIndex]) {
            siblings[newIndex].focus();
        }
    }

    // TTS Setup
    if ('speechSynthesis' in window) {
        synth = window.speechSynthesis;
    } else {
        console.warn('Text-to-Speech not supported in this browser.');
        if (speakButton) {
            speakButton.disabled = true;
            speakButton.textContent = 'TTS Not Supported';
        }
        if (voiceSelect) voiceSelect.innerHTML = '<option value="">TTS Not Supported</option>';
        if (rateSlider) rateSlider.disabled = true;
        if (pitchSlider) pitchSlider.disabled = true;
        return;
    }

    function populateVoiceList() {
        voices = synth.getVoices().sort((a, b) => {
            const aname = a.name.toUpperCase();
            const bname = b.name.toUpperCase();
            if (aname < bname) return -1;
            else if (aname == bname) return 0;
            else return 1;
        });

        const savedVoiceName = localStorage.getItem(VOICE_LS_KEY);
        let selectedIndex = -1;

        if (savedVoiceName) {
            selectedIndex = voices.findIndex(voice => voice.name === savedVoiceName);
        }

        voiceSelect.innerHTML = '';
        if (voices.length === 0) {
            voiceSelect.innerHTML = '<option value="">No voices available</option>';
            return;
        }

        voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.setAttribute('data-lang', voice.lang);
            option.setAttribute('data-name', voice.name);
            option.value = index;
            voiceSelect.appendChild(option);
        });

        if (selectedIndex !== -1) {
            voiceSelect.selectedIndex = selectedIndex;
        } else {
            voiceSelect.selectedIndex = findBestInitialVoice();
        }
    }

    function findBestInitialVoice() {
        const preferredVoices = [
            'Samantha', // Often a high-quality voice on Apple devices
            'Zoe',      // High-quality natural-sounding voice
            'Google US English', // Standard high-quality Google voice
            'Microsoft Zira - English (United States)', // Common Windows voice
            'Michelle',
            'Cora',
            'Joanna',
            'Salli',
            'Julie',
            'Nancy'
        ];

        // Find the first preferred voice that is available
        for (const name of preferredVoices) {
            const index = voices.findIndex(voice => voice.name === name && voice.lang.startsWith('en-'));
            if (index !== -1) {
                return index;
            }
        }
        
        // Fallback 1: Find the first voice that includes "Natural" and is US English
        const naturalVoiceIndex = voices.findIndex(voice => voice.name.includes('Natural') && voice.lang === 'en-US');
        if (naturalVoiceIndex !== -1) {
            return naturalVoiceIndex;
        }

        // Fallback 2: Find the first available American English female voice
        const firstAmericanFemale = voices.findIndex(voice => voice.lang === 'en-US' && (voice.name.toLowerCase().includes('female') || voice.gender === 'female'));
        if (firstAmericanFemale !== -1) {
            return firstAmericanFemale;
        }

        // Fallback 3: Find any American English voice
        const anyAmerican = voices.findIndex(voice => voice.lang === 'en-US');
        if (anyAmerican !== -1) {
            return anyAmerican;
        }

        return 0; // Default to the first voice if no suitable match is found
    }

    populateVoiceList();
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = populateVoiceList;
    }

    // Save selected voice to local storage
    if (voiceSelect) {
        voiceSelect.addEventListener('change', () => {
            const selectedVoice = voices[voiceSelect.selectedIndex];
            if (selectedVoice) {
                localStorage.setItem(VOICE_LS_KEY, selectedVoice.name);
            }
        });
    }

    // Event listeners for rate and pitch sliders
    if (rateSlider && rateValueDisplay) {
        rateSlider.addEventListener('input', () => {
            rateValueDisplay.textContent = rateSlider.value;
        });
    }
    if (pitchSlider && pitchValueDisplay) {
        pitchSlider.addEventListener('input', () => {
            pitchValueDisplay.textContent = pitchSlider.value;
        });
    }

    // Text input and message display logic
    if (textInput && messageOutput) {
        if (textInput.value === '') {
            messageOutput.textContent = defaultMessage;
            messageOutput.style.fontStyle = 'italic';
            messageOutput.style.color = '#B0C4DE';
        }

        textInput.addEventListener('input', () => {
            console.log('Text input changed. Current value for word prediction: ', textInput.value);

            if (textInput.value === '') {
                messageOutput.textContent = defaultMessage;
                messageOutput.style.fontStyle = 'italic';
                messageOutput.style.color = '#B0C4DE';
            } else {
                messageOutput.textContent = textInput.value;
                messageOutput.style.fontStyle = 'normal';
                messageOutput.style.color = '#FFFFFF';
            }
        });
    } else {
        console.error('Required elements (text-input or message-output) not found.');
    }

    // Speak button logic
    if (speakButton && messageOutput && synth) {
        speakButton.addEventListener('click', () => {
            speakText(messageOutput.textContent);
        });
    }

    function speakText(text) {
        if (synth.speaking) {
            synth.cancel();
        }
        if (text && text !== defaultMessage && text.trim() !== '') {
            const utterance = new SpeechSynthesisUtterance(text);
            
            const selectedVoiceIndex = voiceSelect.selectedIndex;
            if (selectedVoiceIndex >= 0 && voices[selectedVoiceIndex]) {
                utterance.voice = voices[selectedVoiceIndex];
            }

            if (rateSlider) utterance.rate = parseFloat(rateSlider.value);
            if (pitchSlider) utterance.pitch = parseFloat(pitchSlider.value);

            utterance.onerror = (event) => {
                console.error('SpeechSynthesisUtterance.onerror', event);
                alert('Sorry, an error occurred while trying to speak.');
            };
            synth.speak(utterance);
        } else {
            console.log('Nothing to speak or only placeholder text is present.');
        }
    }

    // On-Screen Keyboard Logic
    function initializeOnScreenKeyboard() {
        if (!onScreenKeyboardContainer || !textInput) {
            console.error('On-screen keyboard container or text input not found.');
            return;
        }

        const keyLayout = [
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
            ['Backspace', ' ']
        ];

        onScreenKeyboardContainer.innerHTML = '';

        keyLayout.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('keyboard-row');
            row.forEach(key => {
                const keyButton = document.createElement('button');
                keyButton.classList.add('keyboard-key');
                keyButton.textContent = key === ' ' ? 'Space' : key;
                keyButton.setAttribute('data-key', key);
                keyButton.setAttribute('tabindex', '0');
                keyButton.setAttribute('aria-label', key === ' ' ? 'Space key' : `${key} key`);

                if (key === 'Backspace') {
                    keyButton.classList.add('key-backspace');
                    keyButton.setAttribute('aria-label', 'Backspace key');
                }
                if (key === ' ') {
                    keyButton.classList.add('key-space');
                }

                keyButton.addEventListener('click', () => {
                    handleKeyPress(key);
                });

                rowDiv.appendChild(keyButton);
            });
            onScreenKeyboardContainer.appendChild(rowDiv);
        });
    }

    function handleKeyPress(key) {
        if (!textInput) return;

        const currentValue = textInput.value;
        if (key === 'Backspace') {
            textInput.value = currentValue.substring(0, currentValue.length - 1);
        } else {
            textInput.value += key;
        }
        
        const inputEvent = new Event('input', { bubbles: true });
        textInput.dispatchEvent(inputEvent);
        textInput.focus();
    }

    // Symbol Categories and Grid Logic
    function loadCustomSymbols() {
        try {
            const stored = localStorage.getItem(CUSTOM_SYMBOLS_LS_KEY);
            if (stored) {
                symbolCategories.custom = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading custom symbols:', error);
            symbolCategories.custom = [];
        }
    }

    function saveCustomSymbols() {
        try {
            localStorage.setItem(CUSTOM_SYMBOLS_LS_KEY, JSON.stringify(symbolCategories.custom));
        } catch (error) {
            console.error('Error saving custom symbols:', error);
        }
    }

    function switchCategory(category) {
        currentCategory = category;
        
        // Update category tab states
        document.querySelectorAll('.category-tab').forEach(tab => {
            const isActive = tab.getAttribute('data-category') === category;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive.toString());
        });

        // Update title
        const categoryNames = {
            basic: 'Basic',
            emotions: 'Emotions',
            actions: 'Actions',
            custom: 'Custom'
        };
        symbolGridTitle.textContent = `Symbols - ${categoryNames[category]}`;

        renderSymbolGrid();
    }

    function renderSymbolGrid() {
        if (!symbolGridContainer || !textInput) {
            console.error('Symbol grid container or text input not found for rendering.');
            return;
        }

        symbolGridContainer.innerHTML = '';
        const symbols = symbolCategories[currentCategory] || [];

        symbols.forEach(symbol => {
            const symbolButton = document.createElement('button');
            symbolButton.classList.add('symbol-item');
            symbolButton.style.backgroundColor = symbol.color;
            symbolButton.setAttribute('data-text', symbol.text);
            symbolButton.setAttribute('title', symbol.text);
            symbolButton.setAttribute('tabindex', '0');
            symbolButton.setAttribute('aria-label', `${symbol.display}: ${symbol.text}`);

            if (symbol.image) {
                const img = document.createElement('img');
                img.src = symbol.image;
                img.alt = symbol.display;
                symbolButton.appendChild(img);
                
                const textSpan = document.createElement('span');
                textSpan.classList.add('symbol-text');
                textSpan.textContent = symbol.display;
                symbolButton.appendChild(textSpan);
            } else {
                symbolButton.textContent = symbol.display;
            }

            symbolButton.addEventListener('click', () => {
                handleSymbolClick(symbol.text);
            });

            symbolGridContainer.appendChild(symbolButton);
        });
    }

    function handleSymbolClick(text) {
        if (!textInput) return;
        textInput.value += text;
        const inputEvent = new Event('input', { bubbles: true });
        textInput.dispatchEvent(inputEvent);
        textInput.focus();
    }

    // Category navigation setup
    if (symbolCategoryNav) {
        symbolCategoryNav.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-tab')) {
                const category = e.target.getAttribute('data-category');
                switchCategory(category);
            }
        });
    }

    // Image upload and symbol creation
    if (newSymbolImageInput) {
        newSymbolImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    alert('Image file is too large. Please choose a file smaller than 5MB.');
                    e.target.value = '';
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    currentImagePreview = e.target.result;
                    showImagePreview(currentImagePreview);
                };
                reader.onerror = () => {
                    alert('Error reading image file. Please try again.');
                    currentImagePreview = null;
                };
                reader.readAsDataURL(file);
            } else {
                currentImagePreview = null;
                hideImagePreview();
            }
        });
    }

    function showImagePreview(imageSrc) {
        let preview = document.querySelector('.image-preview');
        if (!preview) {
            preview = document.createElement('img');
            preview.classList.add('image-preview');
            preview.setAttribute('alt', 'Image preview');
            newSymbolImageInput.parentNode.appendChild(preview);
        }
        preview.src = imageSrc;
        preview.style.display = 'block';
    }

    function hideImagePreview() {
        const preview = document.querySelector('.image-preview');
        if (preview) {
            preview.remove();
        }
    }

    if (addSymbolButton && newSymbolDisplayInput && newSymbolTextInput) {
        addSymbolButton.addEventListener('click', () => {
            const display = newSymbolDisplayInput.value.trim();
            const text = newSymbolTextInput.value.trim();

            if (display === '' || text === '') {
                alert('Please enter both display text and message text for the symbol.');
                return;
            }

            const newSymbol = {
                id: 'custom_' + Date.now(),
                display: display,
                text: text + (text.endsWith(' ') ? '' : ' '),
                color: newSymbolColors[nextColorIndex % newSymbolColors.length]
            };

            if (currentImagePreview) {
                newSymbol.image = currentImagePreview;
            }

            nextColorIndex++;

            symbolCategories.custom.push(newSymbol);
            saveCustomSymbols();

            // Switch to custom category to show the new symbol
            switchCategory('custom');

            // Clear input fields
            newSymbolDisplayInput.value = '';
            newSymbolTextInput.value = '';
            newSymbolImageInput.value = '';
            currentImagePreview = null;
            hideImagePreview();

            // Close modal and focus text input
            closeModal(addSymbolModal);

            // Announce to screen readers
            const announcement = `Symbol "${display}" added to custom category`;
            announceToScreenReader(announcement);
        });
    }

    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'screen-reader-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Quick Phrases Logic
    function handleQuickPhrase(phrase) {
        if (!textInput || !phrase) return;
        
        const currentText = textInput.value;
        if (currentText && currentText[currentText.length - 1] !== ' ') {
            textInput.value += ' ';
        }
        textInput.value += phrase + ' ';
        
        const inputEvent = new Event('input', { bubbles: true });
        textInput.dispatchEvent(inputEvent);
        textInput.focus();
    }

    if (quickPhraseButtons.length > 0 && textInput) {
        quickPhraseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const phrase = button.getAttribute('data-phrase');
                handleQuickPhrase(phrase);
                // Close modal after adding phrase
                const modal = button.closest('.modal');
                if (modal) closeModal(modal);
            });
        });
    }

    // Message Editing Logic
    if (deleteLastButton && textInput) {
        deleteLastButton.addEventListener('click', () => {
            let currentValue = textInput.value.trimEnd();
            if (currentValue.length > 0) {
                const parts = currentValue.split(' ');
                parts.pop();
                textInput.value = parts.join(' ');
                if (textInput.value.length > 0) {
                    textInput.value += ' ';
                }
            } else {
                textInput.value = '';
            }
            const inputEvent = new Event('input', { bubbles: true });
            textInput.dispatchEvent(inputEvent);
            textInput.focus();
        });
    }

    if (clearAllButton && textInput) {
        clearAllButton.addEventListener('click', () => {
            textInput.value = '';
            const inputEvent = new Event('input', { bubbles: true });
            textInput.dispatchEvent(inputEvent);
            textInput.focus();
        });
    }

    // UI Customization Logic
    function applyFontSize(size) {
        let multiplier;
        switch (size) {
            case 'small':
                multiplier = getComputedStyle(document.documentElement).getPropertyValue('--font-multiplier-small').trim();
                break;
            case 'large':
                multiplier = getComputedStyle(document.documentElement).getPropertyValue('--font-multiplier-large').trim();
                break;
            case 'medium':
            default:
                multiplier = getComputedStyle(document.documentElement).getPropertyValue('--font-multiplier-medium').trim();
                break;
        }
        document.documentElement.style.setProperty('--current-font-multiplier', multiplier);
        
        [fontSizeSmallButton, fontSizeMediumButton, fontSizeLargeButton].forEach(btn => {
            if (btn) btn.classList.remove('active-font-size');
        });
        if (size === 'small' && fontSizeSmallButton) fontSizeSmallButton.classList.add('active-font-size');
        else if (size === 'large' && fontSizeLargeButton) fontSizeLargeButton.classList.add('active-font-size');
        else if (fontSizeMediumButton) fontSizeMediumButton.classList.add('active-font-size');

        localStorage.setItem(FONT_SIZE_LS_KEY, size);
    }

    function loadFontSize() {
        const savedSize = localStorage.getItem(FONT_SIZE_LS_KEY) || 'medium';
        applyFontSize(savedSize);
    }

    if (fontSizeSmallButton) {
        fontSizeSmallButton.addEventListener('click', () => applyFontSize('small'));
    }
    if (fontSizeMediumButton) {
        fontSizeMediumButton.addEventListener('click', () => applyFontSize('medium'));
    }
    if (fontSizeLargeButton) {
        fontSizeLargeButton.addEventListener('click', () => applyFontSize('large'));
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('theme-dark');
        } else {
            document.body.classList.remove('theme-dark');
        }
        localStorage.setItem(THEME_LS_KEY, theme);
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem(THEME_LS_KEY) || 'default';
        applyTheme(savedTheme);
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const currentThemeIsDark = document.body.classList.contains('theme-dark');
            applyTheme(currentThemeIsDark ? 'default' : 'dark');
        });
    }

    // Symbols Panel Toggle Functionality
    function toggleSymbolsPanel() {
        symbolsPanelCollapsed = !symbolsPanelCollapsed;
        
        if (symbolsPanelCollapsed) {
            symbolsPanelContainer.classList.add('collapsed');
            symbolsToggleBtn.textContent = '◁';  // Point left to expand (panel is on right)
            symbolsToggleBtn.setAttribute('aria-expanded', 'false');
            symbolsToggleBtn.setAttribute('title', 'Expand Symbols');
        } else {
            symbolsPanelContainer.classList.remove('collapsed');
            symbolsToggleBtn.textContent = '▷';  // Point right to collapse (panel is on right)
            symbolsToggleBtn.setAttribute('aria-expanded', 'true');
            symbolsToggleBtn.setAttribute('title', 'Collapse Symbols');
        }
        
        // Save state to localStorage
        localStorage.setItem(SYMBOLS_PANEL_LS_KEY, symbolsPanelCollapsed.toString());
        
        // Announce to screen readers
        const action = symbolsPanelCollapsed ? 'collapsed' : 'expanded';
        announceToScreenReader(`Symbols panel ${action}`);
    }

    function loadSymbolsPanelState() {
        try {
            const stored = localStorage.getItem(SYMBOLS_PANEL_LS_KEY);
            if (stored === 'true') {
                symbolsPanelCollapsed = false; // Set opposite so toggle works correctly
                toggleSymbolsPanel();
            }
        } catch (error) {
            console.error('Error loading symbols panel state:', error);
        }
    }

    // Symbols panel toggle event listener
    if (symbolsToggleBtn) {
        symbolsToggleBtn.addEventListener('click', toggleSymbolsPanel);
    }

    // Initialize everything
    function initialize() {
        loadCustomSymbols();
        loadFontSize();
        loadTheme();
        loadSymbolsPanelState();
        initializeOnScreenKeyboard();
        switchCategory('basic'); // Start with basic category
        updateFocusableElements();
        
        // Set initial focus to text input
        if (textInput) {
            textInput.focus();
        }
    }

    // Run initialization
    initialize();

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('SW registered: ', registration);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    // New content available, show update notification
                                    announceToScreenReader('App update available. Refresh to get latest features.');
                                } else {
                                    // Content cached for first time
                                    announceToScreenReader('App is ready for offline use.');
                                }
                            }
                        });
                    });
                })
                .catch((registrationError) => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // Add PWA install prompt handling
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        
        // Optionally, send analytics event that PWA install promo was shown
        console.log('PWA install prompt available');
        
        // You could show a custom install button here
        // For AAC apps, having an install option can be very helpful
    });

    // Handle PWA installation
    window.addEventListener('appinstalled', (evt) => {
        console.log('PWA was installed');
        announceToScreenReader('EchoBoard has been installed and is ready for offline use.');
    });
}); 