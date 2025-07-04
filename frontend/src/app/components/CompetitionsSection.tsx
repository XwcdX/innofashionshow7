'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import DocModal from './DocModal'
import { link } from 'fs'

const CompetitionsSection: React.FC = () => {
  const competitionsData = [
    {
      title: 'Competition',
      description: 'Showcase your unique vision and design prowess on the runway with stunning fashion creations.',
      link: 'https://docs.google.com/document/d/e/2PACX-1vQ2Mq6oOlClIW6tr3kZylgsf9upxypyXztVCfT3zwc5n5bXWBZl-VdwiBxPFLxX89-iYc9fMOpUneDG/pub',
      isDoc: true,
    },
    {
      title: 'Talkshow',
      description: 'Engage in insightful discussions about fashion trends, design inspiration, and the future of style.',
      link: 'https://innofashionshow.petra.ac.id/registration/talkshow',
    },
    {
      title: 'Workshop',
      description: 'Hone your design skills and master new techniques with hands-on guidance from fashion experts.',
      link: 'https://innofashionshow.petra.ac.id/registration/workshop',
    },
  ]

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<string | null>(null)
  const [modalTitle, setModalTitle] = useState('')
  const [isLoadingDoc, setIsLoadingDoc] = useState(false)

  const handleNotStartedClick = (title: string) => {
    Swal.fire({
      icon: 'info',
      title: `${title} - Coming Soon!`,
      text: "This event hasn't started yet or details are being finalized. Please check back later!",
      confirmButtonColor: '#a6ff4d',
      customClass: {
        popup: 'font-neue-montreal',
        title: 'text-white',
        htmlContainer: 'text-gray-300',
        confirmButton: 'font-semibold',
      },
      background: '#1a1a1a',
    })
  }

 const extractFirstTabContent = (htmlString: string, endMarkerText: string, endMarkerTag: string = 'h2'): string => {
  console.log("------------------------------------------------------");
  console.log("Attempting to extract first tab.");
  console.log("Full initial HTML length:", htmlString.length);
  console.log(`Using endMarkerText: "${endMarkerText}", endMarkerTag: "${endMarkerTag.toLowerCase()}"`);

  try {
    if (typeof window === 'undefined') return htmlString;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    const fragment = doc.createDocumentFragment(); 
    let endMarkerFound = false;

    const containsMarker = (element: Element, text: string, tag: string): boolean => {
        if (element.tagName.toLowerCase() === tag.toLowerCase()) {
            const elementTextContent = element.textContent?.trim().toLowerCase() || "";
            const markerTextLower = text.trim().toLowerCase();
            if (elementTextContent.includes(markerTextLower)) {
                return true;
            }
        }
        return false;
    };
    
    const nodesToProcess = Array.from(doc.body.childNodes);

    if (nodesToProcess.length === 0) {
        console.warn("No nodes found to process for tab extraction from doc.body.childNodes. Original htmlString might be empty or structured unexpectedly.");
        return htmlString;
    }
    console.log(`Found ${nodesToProcess.length} top-level nodes to process.`);

    for (let i = 0; i < nodesToProcess.length; i++) {
      const node = nodesToProcess[i];
      let stopAdding = false;

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;

        if (containsMarker(element, endMarkerText, endMarkerTag)) {
            endMarkerFound = true;
            console.log(`%cSUCCESS: End marker "${endMarkerText}" (tag: ${endMarkerTag}) FOUND in or as element:`, "color: green; font-weight: bold;", element.outerHTML.substring(0, 200) + "...");
            stopAdding = true; 
        }
      }
      
      if (stopAdding) {
        console.log("Stopping addition of nodes.");
        break; 
      }
      fragment.appendChild(node.cloneNode(true));
    }

    if (endMarkerFound) {
      const tempDiv = document.createElement('div');
      tempDiv.appendChild(fragment);
      console.log("%cFirst tab content extracted. Final HTML length:", "color: green;", tempDiv.innerHTML.length);
      return tempDiv.innerHTML;
    } else {
      console.warn(`%cALERT: End marker "${endMarkerText}" (tag: ${endMarkerTag}) NOT found. Displaying all fetched content.`, "color: orange;");
      return htmlString; 
    }
  } catch (e) {
    console.error("Error parsing HTML for first tab extraction:", e);
    return htmlString;
  }
};


  const handleCompetitionClick = async (title: string, docLink: string | undefined) => {
    if (!docLink) { /* ... */ return; }
    if (!docLink.includes('/pub')) { /* ... */ return; }

    setModalTitle(title);
    setIsModalOpen(true);
    setIsLoadingDoc(true);
    setModalContent(null);

    try {
      const fetchUrl = `/api/doc-proxy?url=${encodeURIComponent(docLink)}`;
      console.log(`Fetching document content from (via proxy): ${fetchUrl} (Original: ${docLink})`);
      const response = await fetch(fetchUrl);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}. Server response: ${errorText.substring(0, 300)}...`);
      }

      let htmlText = await response.text();

      let initialExtractedContent = '';
      const contentsMatch = htmlText.match(/<div id="contents"[^>]*>([\s\S]*?)<\/div>/i);
      if (contentsMatch && contentsMatch[1]) {
        initialExtractedContent = contentsMatch[1];
      } else {
        const bodyMatch = htmlText.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch && bodyMatch[1]) {
          initialExtractedContent = bodyMatch[1];
        } else {
          initialExtractedContent = htmlText;
        }
      }

      const firstTabMarkerText = "Kategori Lomba";
      const firstTabMarkerTag = "h3";

      const firstTabHtml = extractFirstTabContent(initialExtractedContent, firstTabMarkerText, firstTabMarkerTag);

      setModalContent(firstTabHtml);

    } catch (error: any) {
      console.error('Error fetching or processing document:', error);
      setModalContent(`<p style="color:red;">Sorry, an error occurred: ${error.message}.</p>`);
    } finally {
      setIsLoadingDoc(false);
    }
  };

  return (
    <>
      <section
  id="competitions"
  // TAMBAHKAN z-10 di sini
  // Hapus min-h-dvh dan items-center
className="min-h-dvh flex justify-center py-16 font-neue-montreal transform -translate-y-64 z-30 pt-0 -mt-60 sm:-mt-20 -mb-50 sm:-mb-65"
  style={{
    background: 'transparent',
    scrollSnapAlign: 'start',
  }}
>
        <div className="container mx-auto px-4 text-center">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 ">
            {competitionsData.map((competition, index) => {
              const cardContent = (
                <div
                  className="group relative p-8 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:z-10 h-full flex flex-col justify-center"
                >
                  <div className="relative z-10">
                    <h3
                      className="text-2xl font-semibold mb-3 group-hover:text-white transition-colors duration-300"
                      style={{
                        color: '#a6ff4d',
                        fontFamily: 'MODERNIZ, sans-serif',
                      }}
                    >
                      {competition.title}
                    </h3>
                    <p
                      className="text-gray-300 text-base group-hover:text-white transition-colors duration-500"
                      style={{
                        fontFamily: 'EIRENE SANS, sans-serif',
                      }}
                    >
                      {competition.description}
                    </p>
                  </div>
                  <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4dffff10] to-[#a6ff4d10]"></div>
                    <div className="absolute inset-0 border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                  <div className="absolute inset-0 rounded-2xl shadow-[0_0_0_0_rgba(77,255,255,0.2)] group-hover:shadow-[0_0_30px_10px_rgba(77,255,255,0.4)] transition-shadow duration-500 pointer-events-none"></div>
                  <div className="absolute inset-0 rounded-2xl scale-95 group-hover:scale-100 transition-transform duration-500 bg-white/10 backdrop-blur-xl -z-10"></div>
                </div>
              )

              if (competition.isDoc && competition.link) {
                return (
                  <div
                    key={index}
                    onClick={() => handleCompetitionClick(competition.title, competition.link)}
                    className="cursor-pointer h-full"
                    role="button" // For accessibility
                    tabIndex={0} // For keyboard navigation
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCompetitionClick(competition.title, competition.link) }}
                  >
                    {cardContent}
                  </div>
                )
              } else if (competition.link) {
                return (
                  <Link key={index} href={competition.link} passHref legacyBehavior={false} className="block h-full" target="_blank" rel="noopener noreferrer">
                    <div className="cursor-pointer h-full">{cardContent}</div>
                  </Link>
                )
              }
              else {
                return (
                  <div
                    key={index}
                    onClick={() => handleNotStartedClick(competition.title)}
                    className="cursor-pointer h-full"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNotStartedClick(competition.title) }}
                  >
                    {cardContent}
                  </div>
                )
              }
            })}
          </div>
        </div>
      </section>

      <DocModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        htmlContent={modalContent}
        title={modalTitle}
        isLoading={isLoadingDoc}
      />
    </>
  )
}

export default CompetitionsSection