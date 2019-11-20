import gs from './GettingStarted.md'
import opts from './Options.md'
import struct from './Structure.md'
import layout from './Layout.md'
import data from './DataFlow.md'

import hljs from 'highlight.js';///lib/languages/javascript';
import 'highlight.js/styles/tomorrow-night-eighties.css';

function domHighlightAll (el) {
    el.querySelectorAll('pre').forEach(block => {
        hljs.highlightBlock(block)
    })
}

export const GettingStartedPage = () => {
    return {
        css: 'learn-docs content box',
        innerHTML: gs,
    }
}

export const OptionsPage = () => {
    return {
        css: 'learn-docs content box',
        innerHTML: opts,
//        dom: { domHighlightAll }  
    }
}

export const StructurePage = () => {
    return {
        css: 'learn-docs content box',
        innerHTML: struct,
//        dom: { domHighlightAll }  
    }
}

export const LayoutPage = () => {
    return {
        css: 'learn-docs content box',
        innerHTML: layout,
//        dom: { domHighlightAll }  
    }
}

export const DataFlowPage = () => {
    return {
        css: 'learn-docs content box',
        innerHTML: data,
//        dom: { domHighlightAll }  
    }
}
