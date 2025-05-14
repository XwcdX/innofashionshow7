'use client'
import React from 'react'

interface DocModalProps {
    isOpen: boolean
    onClose: () => void
    htmlContent: string | null
    title: string
    isLoading: boolean
}

const DocModal: React.FC<DocModalProps> = ({ isOpen, onClose, htmlContent, title, isLoading }) => {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={onClose}
        >
            <div
                // INCREASED MAX WIDTH HERE
                className="rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
                style={{
                    backgroundColor: 'rgba(25, 25, 30, 0.6)',
                    backdropFilter: 'blur(20px) saturate(150%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 sm:p-6 border-b border-white/10">
                    <h2
                        className="text-xl sm:text-2xl font-semibold"
                        style={{ color: '#e0e0e0', fontFamily: 'MODERNIZ, sans-serif' }}
                    >
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-300 hover:text-white transition-colors text-2xl leading-none"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>
                {/* This div already has p-4 sm:p-6 for padding */}
                <div className="p-4 sm:p-6 overflow-y-auto doc-modal-content-wrapper">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
                            <p className="ml-4 text-lg text-gray-200">Loading Document...</p>
                        </div>
                    ) : htmlContent ? (
                        <div
                            className="google-doc-html-content"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    ) : (
                        <p className="text-red-400">Could not load document content. Please try again later.</p>
                    )}
                </div>
            </div>

            <style jsx global>{`
        .doc-modal-content-wrapper {
          color: #f0f0f0 !important; 
          font-family: Arial, sans-serif; 
          line-height: 1.6; /* General line height for content */
          text-align: left; 
        }

        /* Targets a potential wrapper div Google might use for the main document body */
        .google-doc-html-content .doc-content { /* Converted from user's style */
         width: 100% !important;
         padding: 0 !important;
        }
        
        /* Targets a potential title element Google might embed */
        .google-doc-html-content .title { /* Converted from user's style */
            display: none !important;
        }

        .google-doc-html-content * {
            color: inherit !important;
        }
        
        .google-doc-html-content p,
        .google-doc-html-content div:not([class]), 
        .google-doc-html-content div[class^="c"] {
            color: #f0f0f0 !important; 
            text-align: left !important;
            /* General paragraphs will have margin-bottom from below rule */
        }
        .google-doc-html-content p { /* Default paragraph spacing */
            margin-bottom: 0.75em !important; /* Adjust as needed for general p spacing */
        }
        
        .google-doc-html-content span { 
             color: #f0f0f0 !important; 
        }

        .google-doc-html-content strong, 
        .google-doc-html-content b {
            color: #ffffff !important; 
        }

        .google-doc-html-content h1,
        .google-doc-html-content h2,
        .google-doc-html-content h3,
        .google-doc-html-content h4,
        .google-doc-html-content h5,
        .google-doc-html-content h6 {
          color: #ffffff !important; 
          margin-top: 1.2em;
          margin-bottom: 0.6em;
          text-align: left !important; 
        }
        
        .google-doc-html-content a {
          color: #a6ff4d !important;
        }
        .google-doc-html-content a:hover {
          color: #c1ff8a !important;
        }

        .google-doc-html-content img {
          max-width: 100% !important;
          height: auto !important;
          display: block; 
          margin: 1em auto; 
          border-radius: 6px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .google-doc-html-content table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin-top: 1.5em;
          margin-bottom: 1.5em;
          color: #e0e0e0 !important; 
          font-size: 0.9rem;
          background-color: rgba(0,0,0,0.1) !important;
        }
        .google-doc-html-content th,
        .google-doc-html-content td {
          border: 1px solid rgba(255, 255, 255, 0.75) !important; /* User's value */
          padding: 10px 12px !important;
          text-align: left !important;
          vertical-align: top;
          color: #e0e0e0 !important; 
        }
        .google-doc-html-content th {
          background-color: rgba(255, 255, 255, 0.75) !important; /* User's value */
          color: #ffffff !important; 
          font-weight: bold;
        }

        /* LIST STYLING FOR SPACING */
        .google-doc-html-content ul, 
        .google-doc-html-content ol {
          margin-left: 20px !important; /* Indentation for the list itself */
          padding-left: 1.2em !important; /* Space for bullets/numbers */
          margin-bottom: 0.75em !important; /* Space after the whole list */
          text-align: left !important; 
        }

        .google-doc-html-content li {
          margin-top: 0.1em !important;    /* Small space above list item */
          margin-bottom: 0.2em !important; /* Significantly reduced space below list item */
          padding-left: 0 !important;      /* Remove default li padding if any, ul/ol handles indent */
          line-height: 1.5 !important;   /* Tighter line height for list items for denser look */
          list-style-position: outside !important; /* Ensures bullets are outside the text flow */
        }

        /* Crucial: Paragraphs inside list items often cause extra spacing */
        .google-doc-html-content li p {
          margin-top: 0em !important; /* Remove top margin from p inside li */
          margin-bottom: 0em !important; /* Remove bottom margin from p inside li */
          /* It will inherit line-height from the li or its own specific styles if Google applies them */
        }
        
        /* For nested lists, ensure their outer margins are minimal and they indent correctly */
        .google-doc-html-content ul ul,
        .google-doc-html-content ol ol,
        .google-doc-html-content ul ol,
        .google-doc-html-content ol ul {
          margin-top: 0.2em !important;
          margin-bottom: 0.2em !important;
          margin-left: 20px !important; /* Further indent nested lists */
          padding-left: 1em !important; /* Space for their bullets/numbers */
        }
        /* END LIST STYLING */

        .google-doc-html-content body {
          background-color: transparent !important;
          color: inherit !important; 
          text-align: left !important;
        }
        .google-doc-html-content div[class^="c"], 
        .google-doc-html-content span[class^="c"] { 
            background-color: transparent !important;
            color: inherit !important; 
        }
        .doc-content {
        padding: 0 !important;
        }
        .li-bullet-0{
            padding: 0 !important;
        }
        .title{
            display: none !important;
        }
      `}</style>
        </div>
    )
}

export default DocModal