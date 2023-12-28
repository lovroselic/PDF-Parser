/*jshint browser: true */
/*jshint -W097 */
/*jshint -W117 */
/*jshint -W061 */
"use strict";

async function renderPageToPDF(doc, page, imgWidth) {
    try {
        const canvas = await html2canvas(page, { logging: false });
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, '', 'FAST');
    } catch (error) {
        console.error("Error rendering page to PDF:", error);
    }
}
async function createPDF() {
    const filename = $("#fn")[0].value || 'document.pdf';
    const doc = new window.jspdf.jsPDF('p', 'mm');

    doc.setProperties({
        title: '',
        subject: '',
        author: '',
        keywords: '',
        creator: ''
    });

    const imgWidth = 208;  // Width of the image in the PDF
    const pages = $('div[id^="page-"]');  // Select all divs with id starting with "page-"

    for (let i = 0; i < pages.length; i++) {
        //console.log("page", i, pages[i]);
        if (i > 0) doc.addPage();
        await renderPageToPDF(doc, pages[i], imgWidth);
    }

    doc.save(filename);
}

$(document).ready(function () {
    console.clear();
    console.log("HTML document to PDF v0.03 (LS) running.");
    $('#export-pdf-btn').on('click', createPDF);
});
