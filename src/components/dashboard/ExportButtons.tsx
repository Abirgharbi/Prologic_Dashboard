import React from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { exportToExcel ,  exportToPDF  } from '@/utils/exportUtils';
import { VisitorData , StatsData } from '@/types/dashboard';
interface ExportButtonsProps {
  visitorData: VisitorData[];
  dashboardStats: any;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ visitorData, dashboardStats }) => {
  const handleExcelExport = () => {
    if (!visitorData || visitorData.length === 0) {
      console.warn('No visitor data available for export');
      return;
    }

    const stats: StatsData = {
      totalVisitors: dashboardStats.totalVisitors || 0,
      peakHour: dashboardStats.peakHour || 'N/A',
      employeeFrequencies: dashboardStats.employeeStats?.map((stat: any) => ({
        name: stat.name,
        visits: stat.visits,
        department: stat.department
      })) || []
    };

    exportToExcel(visitorData, stats, `statistiques_visiteurs_${new Date().toISOString().split('T')[0]}`);
  };

  const handlePDFExport = () => {
    exportToPDF('dashboard-content', `rapport_statistiques_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="flex space-x-2">
      <Button
        onClick={handleExcelExport}
        variant="outline"
        size="sm"
        className="flex items-center space-x-2"
        disabled={!visitorData || visitorData.length === 0}
      >
        <FileSpreadsheet className="h-4 w-4" />
        <span>Excel</span>
      </Button>
      
      <Button
        onClick={handlePDFExport}
        variant="outline"
        size="sm"
        className="flex items-center space-x-2"
      >
        <FileText className="h-4 w-4" />
        <span>PDF</span>
      </Button>
    </div>
  );
};

export default ExportButtons;