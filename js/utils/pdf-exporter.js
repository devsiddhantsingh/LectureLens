
// import { jsPDF } from "jspdf"; 
// import autoTable from "jspdf-autotable"; 
// Using UMD globals from index.html

export async function exportToPDF(data) {
    if (!data || !data.summary) {
        alert("No data to export!");
        return;
    }

    const { jsPDF } = window.jspdf;
    // autoTable is automatically attached to jsPDF instance if loaded correctly via script tag


    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Helper: Centered Text
    const centerText = (text, yPos, size = 16, weight = 'bold') => {
        doc.setFontSize(size);
        doc.setFont('helvetica', weight);
        const textWidth = doc.getTextWidth(text);
        doc.text(text, (pageWidth - textWidth) / 2, yPos);
    };

    // 1. Title Page
    centerText("LectureLens Analysis", y += 10, 22, 'bold');
    doc.setLineWidth(0.5);
    doc.line(20, y + 5, pageWidth - 20, y + 5);

    y += 20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Topic: ${data.topic || 'Untitled Lecture'}`, 20, y);
    y += 7;
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, y);
    y += 7;
    y += 7;
    const type = data.type ? data.type.toUpperCase() : 'GENERAL';
    doc.text(`Type: ${type}`, 20, y);

    // 2. Executive Summary
    y += 20;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    // Calculate text lines first to determine box height
    const summaryLines = doc.splitTextToSize(data.summary.overview, pageWidth - 50);
    const lineHeight = 5; // approx height per line
    const boxHeight = (summaryLines.length * lineHeight) + 20; // + padding

    // Draw background rect with dynamic height
    doc.setFillColor(240, 240, 250);
    doc.rect(15, y - 5, pageWidth - 30, boxHeight, 'F');

    // Header inside box
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(124, 110, 240); // Primary color
    doc.text("Executive Summary", 20, y + 5);

    // Text content inside box
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(summaryLines, 25, y + 15);

    y += boxHeight + 10; // Dynamic spacing

    // 3. Key Highlights
    if (y > 250) { doc.addPage(); y = 20; }

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Key Highlights", 20, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    data.summary.highlights.forEach(h => {
        const lines = doc.splitTextToSize(`• ${h}`, pageWidth - 45);
        if (y + (lines.length * 6) > 280) { doc.addPage(); y = 20; }
        doc.text(lines, 25, y);
        y += (lines.length * 5) + 3;
    });

    // 4. Detailed Notes (Table)
    y += 10;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Detailed Notes", 20, y);
    y += 5;

    const noteRows = data.notes.map(n => [n.topic, n.content]);
    doc.autoTable({
        startY: y,
        head: [['Topic', 'Content']],
        body: noteRows,
        theme: 'grid',
        headStyles: { fillColor: [124, 110, 240], textColor: 255 },
        columnStyles: {
            0: { cellWidth: 50, fontStyle: 'bold', valign: 'top' },
            1: { cellWidth: 'auto', overflow: 'linebreak', valign: 'top' }
        },
        styles: {
            fontSize: 10,
            cellPadding: 4,
            overflow: 'linebreak',
            valign: 'top',
            cellWidth: 'wrap' // Ensure text wraps
        },
        margin: { top: 20 },
        pageBreak: 'auto'
    });

    y = doc.lastAutoTable.finalY + 20;

    // 5. Quiz
    if (data.quiz && data.quiz.length > 0) {
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("Quiz Verification", 20, y);
        y += 5;

        const quizRows = data.quiz.map((q, i) => [`Q${i + 1}: ${q.question}`, `Answer: ${q.answer}`]);
        doc.autoTable({
            startY: y,
            body: quizRows,
            theme: 'striped',
            styles: { fontSize: 9, cellPadding: 2 },
            columnStyles: { 0: { cellWidth: 120 }, 1: { cellWidth: 'auto', textColor: [40, 167, 69] } }
        });
    }

    // Save
    doc.save(`LectureLens_Analysis_${Date.now()}.pdf`);
}
