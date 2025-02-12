window.MathJax = {
    tex: {
        inlineMath: [ ['$', '$'], ['\\(', '\\)'] ],
        displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
        processEscapes: true,
        tags: "ams",
        autoload: {
            color: [],
            colorv2: ['color']
        },
        packages: { '[+]': ['noerrors', 'configmacros'] },
        macros: {
            class: " ",
            style: " ",
            href: " ",
        }
    },
    options: {
        ignoreHtmlClass: "no-mathjax|redactor-editor|redactor-box",
        processHtmlClass: 'mathjax',
        enableMenu: false,
    },
    chtml: {
        scale: 0.9
    },
    loader: {
        load: ['input/tex', 'output/chtml', '[tex]/noerrors'],
    },
    startup: {
        ready() {
            const {newState, STATE} = MathJax._.core.MathItem;
            const {AbstractMathDocument} = MathJax._.core.MathDocument;
            const {CHTML} = MathJax._.output.chtml_ts;
            newState('ADDTEXT', 156);
            AbstractMathDocument.ProcessBits.allocate('addtext');
            CHTML.commonStyles['mjx-copytext'] = {
                display: 'inline-block',
                position: 'absolute',
                top: 0, left: 0, width: 0, height: 0,
                opacity: 0,
                overflow: 'hidden'
            };
            MathJax.STATE = STATE;
            MathJax.startup.defaultReady();
        }
    }
};
