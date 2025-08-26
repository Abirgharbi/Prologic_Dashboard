import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { VisitorData, EmployeeStat, StatsData } from '../types/dashboard';

export const exportToExcel = (visitorData: VisitorData[], stats: StatsData, filename: string) => {
  if (!visitorData || visitorData.length === 0) {
    console.warn('No visitor data available for Excel export');
    return;
  }

  const visitData = visitorData.flatMap(visitor =>
    visitor.visitHistory.map(visit => ({
      'Visiteur': `${visitor.firstName} ${visitor.lastName}`,
      'Arrivée': visit.checkInTime ? new Date(visit.checkInTime).toLocaleString('fr-FR') : 'N/A',
      'Départ': visit.checkOutTime ? new Date(visit.checkOutTime).toLocaleString('fr-FR') : 'En cours',
      'Motif': visit.purpose,
      'Contact': visit.contact !== 'non spécifié' ? visit.contact : 'N/A'
    }))
  );

  const statsData = [
    { 'Statistique': 'Nombre total de visiteurs', 'Valeur': stats.totalVisitors },
    { 'Statistique': 'Heure de pointe', 'Valeur': stats.peakHour },
    ...stats.employeeFrequencies.map(freq => ({
      'Statistique': `Fréquence de ${freq.name} (${freq.department})`,
      'Valeur': freq.visits
    }))
  ];

  const wb = XLSX.utils.book_new();
  if (visitData.length > 0) {
    const ws1 = XLSX.utils.json_to_sheet(visitData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Visites');
  }
  const ws2 = XLSX.utils.json_to_sheet(statsData);
  XLSX.utils.book_append_sheet(wb, ws2, 'Statistiques');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportToPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found`);
    alert(`L'élément ${elementId} n'a pas été trouvé pour l'export PDF.`);
    return;
  }

  try {
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('PDF export failed:', error);
    alert('Erreur lors de l\'export PDF. Vérifiez la console pour plus de détails.');
  }
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num);
};