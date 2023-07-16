// ==UserScript==
// @name         Blender Stack Exchange Toolbox
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a floating window with message templates to Blender Stack Exchange sites.
// @author       You
// @match       *blender.stackexchange.com/questions/*/*
// @match        *blender.meta.stackexchange.com/questions/*/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    // Helper function to inject a script into the page
    function injectScript(url) {
        const script = document.createElement('script');
        script.src = url;
        document.head.appendChild(script);
    }

    // Create and style the floating window
    const floatingWindow = document.createElement('div');
    floatingWindow.id = 'bse-toolbox';
    floatingWindow.style.position = 'fixed';
    floatingWindow.style.top = '50%';
    floatingWindow.style.left = '50%';
    floatingWindow.style.transform = 'translate(-50%, -50%)';
    floatingWindow.style.padding = '10px';
    floatingWindow.style.backgroundColor = '#fff';
    floatingWindow.style.border = '1px solid #ccc';
    floatingWindow.style.borderRadius = '5px';
    floatingWindow.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    floatingWindow.style.zIndex = '9999';

    // Fetch the templates from the URL
    fetch('https://raw.githubusercontent.com/L0Lock/BSE-Toolbox/main/templates.json')
        .then((response) => response.json())
        .then((data) => {
            if (data && data.templates && data.templates.length > 0) {
                // Create the list of templates
                const templateList = document.createElement('ul');
                data.templates.forEach((template) => {
                    const listItem = document.createElement('li');
                    listItem.innerText = template;
                    listItem.style.cursor = 'pointer';
                    listItem.addEventListener('click', () => insertTemplate(template));
                    templateList.appendChild(listItem);
                });
                // Add the list to the floating window
                floatingWindow.appendChild(templateList);
            } else {
                // Show a message if no templates are available
                const noTemplatesMsg = document.createElement('p');
                noTemplatesMsg.innerText = 'No templates available.';
                floatingWindow.appendChild(noTemplatesMsg);
            }
        })
        .catch((error) => console.error('Error fetching templates:', error));

    // Function to insert the selected template into the active text field
    function insertTemplate(template) {
        const activeTextField = document.activeElement;
        if (!activeTextField || !['INPUT', 'TEXTAREA'].includes(activeTextField.tagName)) {
            // Show a message in the floating window if no text field is active
            const noTextFieldMsg = document.createElement('p');
            noTextFieldMsg.innerText = 'Please select a text field first.';
            floatingWindow.innerHTML = ''; // Clear previous content
            floatingWindow.appendChild(noTextFieldMsg);
        } else {
            // Insert the template into the active text field
            activeTextField.value += template;
        }
    }

    // Add the floating window to the page
    document.body.appendChild(floatingWindow);

    // CSS styles for the floating window
    GM_addStyle(`
        #bse-toolbox {
            max-height: 300px;
            overflow-y: auto;
        }
        #bse-toolbox ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        #bse-toolbox li {
            padding: 5px;
        }
        #bse-toolbox li:hover {
            background-color: #f2f2f2;
        }
    `);
})();
