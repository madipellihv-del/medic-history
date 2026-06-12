/* ============================================================
   Autocomplete Dropdown Component
   Type-to-filter with keyboard navigation & cascading support
   ============================================================ */

const AutocompleteInput = (() => {

    /**
     * Initialize an autocomplete on a text input.
     * @param {string}   inputId       - The ID of the <input> element
     * @param {Function} getOptionsFn  - Returns string[] of options (called on every focus / keystroke)
     * @param {Function} onSelectFn    - Called with the selected value string
     */
    function init(inputId, getOptionsFn, onSelectFn) {
        const input = document.getElementById(inputId);
        if (!input) return;

        // Prevent duplicate init
        if (input.dataset.acInit) return;
        input.dataset.acInit = 'true';

        // Wrap input in a container
        const wrapper = document.createElement('div');
        wrapper.className = 'ac-wrapper';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);

        // Create dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'ac-dropdown';
        dropdown.id = inputId + '-ac-dropdown';
        wrapper.appendChild(dropdown);

        let highlighted = -1;
        let currentOptions = [];
        let isOpen = false;

        function renderDropdown(filter) {
            const allOptions = getOptionsFn();
            const q = (filter || '').toLowerCase();

            // Filter: match from beginning of string or anywhere
            currentOptions = q
                ? allOptions.filter(opt => opt.toLowerCase().includes(q))
                : allOptions;

            // Sort: prioritize options that START with the query
            if (q) {
                currentOptions.sort((a, b) => {
                    const aStarts = a.toLowerCase().startsWith(q) ? 0 : 1;
                    const bStarts = b.toLowerCase().startsWith(q) ? 0 : 1;
                    if (aStarts !== bStarts) return aStarts - bStarts;
                    return a.localeCompare(b);
                });
            }

            if (currentOptions.length === 0) {
                dropdown.innerHTML = '<div class="ac-empty">No matches found</div>';
            } else {
                dropdown.innerHTML = currentOptions.map((opt, i) => {
                    // Highlight matching text
                    let display = opt;
                    if (q) {
                        const idx = opt.toLowerCase().indexOf(q);
                        if (idx >= 0) {
                            display = opt.substring(0, idx)
                                + '<strong>' + opt.substring(idx, idx + q.length) + '</strong>'
                                + opt.substring(idx + q.length);
                        }
                    }
                    return `<div class="ac-item${i === highlighted ? ' ac-highlighted' : ''}" data-index="${i}" data-value="${opt}">${display}</div>`;
                }).join('');
            }

            highlighted = -1;
            openDropdown();
        }

        function openDropdown() {
            if (isOpen) return;
            isOpen = true;
            dropdown.classList.add('ac-open');
        }

        function closeDropdown() {
            if (!isOpen) return;
            isOpen = false;
            dropdown.classList.remove('ac-open');
            highlighted = -1;
        }

        function selectOption(value) {
            input.value = value;
            closeDropdown();
            if (onSelectFn) onSelectFn(value);
        }

        function highlightItem(index) {
            const items = dropdown.querySelectorAll('.ac-item');
            items.forEach(el => el.classList.remove('ac-highlighted'));
            if (index >= 0 && index < items.length) {
                items[index].classList.add('ac-highlighted');
                items[index].scrollIntoView({ block: 'nearest' });
            }
            highlighted = index;
        }

        // --- Events ---

        input.addEventListener('input', () => {
            renderDropdown(input.value);
        });

        input.addEventListener('focus', () => {
            renderDropdown(input.value);
        });

        input.addEventListener('keydown', (e) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const next = highlighted + 1;
                if (next < currentOptions.length) highlightItem(next);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = highlighted - 1;
                if (prev >= 0) highlightItem(prev);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (highlighted >= 0 && highlighted < currentOptions.length) {
                    selectOption(currentOptions[highlighted]);
                } else if (currentOptions.length === 1) {
                    selectOption(currentOptions[0]);
                }
            } else if (e.key === 'Escape') {
                closeDropdown();
            } else if (e.key === 'Tab') {
                closeDropdown();
            }
        });

        dropdown.addEventListener('mousedown', (e) => {
            // Prevent input blur
            e.preventDefault();
        });

        dropdown.addEventListener('click', (e) => {
            const item = e.target.closest('.ac-item');
            if (item) {
                selectOption(item.dataset.value);
            }
        });

        // Hover highlight
        dropdown.addEventListener('mouseover', (e) => {
            const item = e.target.closest('.ac-item');
            if (item) {
                highlightItem(Number(item.dataset.index));
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                closeDropdown();
            }
        });

        // Return control API
        return {
            clear() {
                input.value = '';
                closeDropdown();
            },
            setValue(val) {
                input.value = val || '';
            },
            refresh() {
                if (isOpen) renderDropdown(input.value);
            }
        };
    }

    return { init };
})();
