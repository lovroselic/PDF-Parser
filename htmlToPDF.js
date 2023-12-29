/*jshint browser: true */
/*jshint -W097 */
/*jshint -W117 */
/*jshint -W061 */
"use strict";

/** IIFE */
(() => {

    const INI = {
        WIDTH: 192,
        LEFT: 10,
        TOP: 10,
        VERSION: 0.05,
    };

    async function renderPageToPDF(doc, page, imgWidth) {
        try {
            const canvas = await html2canvas(page, { logging: false });
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const imgData = canvas.toDataURL('image/png');
            doc.addImage(imgData, 'PNG', INI.LEFT, INI.TOP, imgWidth, imgHeight, '', 'FAST');
        } catch (error) {
            console.error("Error rendering page to PDF:", error);
        }
    }

    function pageFooter(doc, page, totalPages) {
        doc.text(`Page: ${page}/${totalPages}; generated by tralala hopsasa`, 10, doc.internal.pageSize.height - 10);
    }

    function pageLine(doc) {
        const linePosY = doc.internal.pageSize.height - 15;
        doc.line(INI.LEFT, linePosY, INI.WIDTH, linePosY, 'S');
    }

    async function createPDF() {
        const filename = $("#fn")[0].value || 'document.pdf';
        const doc = new window.jspdf.jsPDF('p', 'mm');

        doc.setFont("times", "normal");
        doc.setFontSize(10);

        doc.setProperties({
            title: '',
            subject: '',
            author: '',
            keywords: '',
            creator: ''
        });

        const imgWidth = INI.WIDTH;
        const pages = $('div[id^="page-"]');                            // Select all divs with id starting with "page-"

        for (let i = 0; i < pages.length; i++) {
            if (i > 0) doc.addPage();
            await renderPageToPDF(doc, pages[i], imgWidth);
            pageLine(doc);
            pageFooter(doc, i + 1, pages.length);
        }

        doc.save(filename);
    }

    function htmlToPDF() {
        console.clear();
        console.log(`HTML document to PDF V${INI.VERSION} (LS) running.`);
        $('#export-pdf-btn').on('click', createPDF);
    }

    $(htmlToPDF);

})();