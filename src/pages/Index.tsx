import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Clock, TrendingUp, Building, Award } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import StatsCard from '../components/dashboard/StatsCard';
import VisitorsChart from '../components/dashboard/VisitorsChart';
import EmployeeTable from '../components/dashboard/EmployeeTable';
import DepartmentChart from '../components/dashboard/DepartmentChart';
import ExportButtons from '../components/dashboard/ExportButtons';
import DateRangePicker from '../components/dashboard/DateRangePicker';
import { DateRange } from '../types/dashboard';
import { formatDuration, formatNumber } from '../utils/exportUtils';

const Index = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2025, 7, 1), 
    to: new Date(2025, 7, 21),  
  });

  const [dashboardStats, setDashboardStats] = useState<any>(null); 
  const [hourlyStats, setHourlyStats] = useState([]);
  const [employeeStats, setEmployeeStats] = useState([]);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [visitorData, setVisitorData] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // ✅ nouvel état

  useEffect(() => {
    const fetchData = async () => {
      const formattedDateRange = {
        from: dateRange.from.toLocaleDateString("en-CA", { timeZone: "Europe/Paris" }),
        to: dateRange.to.toLocaleDateString("en-CA", { timeZone: "Europe/Paris" })
      };

      console.log("Sending dateRange:", formattedDateRange);

      setLoading(true); // ✅ on démarre le chargement

      try {
        const response = await fetch('http://localhost:3000/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dateRange: formattedDateRange }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", JSON.stringify(data, null, 2));

      
        setVisitorData(data.visitorData || []);
        setHourlyStats(data.hourlyStats || []);
        setEmployeeStats(data.employeeStats || []);
        setDepartmentStats(data.departmentStats || []);
        setDashboardStats(data.dashboardStats || null);
        setError(null);

      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, [dateRange]);

  if (error) return <div>Error: {error}</div>;
  if (!dashboardStats) return <div>Chargement initial...</div>; 

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Tableau de Bord Visiteurs
              </h1>
              <p className="text-gray-600 mt-1">
                Statistiques et analyse des visites en temps réel
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <DateRangePicker 
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
              <ExportButtons visitorData={visitorData} dashboardStats={dashboardStats} />
            </div>
          </div>
        </div>
      </header>


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="dashboard-content">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="xl:col-span-2">
            <StatsCard
              title="Total Visiteurs"
              value={formatNumber(dashboardStats.totalVisitors)}
              icon={Users}
              description="Ce mois-ci"
              trend={{ value: dashboardStats.visitorTrend || 0, isPositive: (dashboardStats.visitorTrend || 0) >= 0 }}
            />
          </div>
          
          <div className="xl:col-span-2">
            <StatsCard
              title="Visiteurs Actifs"
              value={dashboardStats.activeVisitors || 0}
              icon={UserCheck}
              description="Actuellement sur site"
            />
          </div>
          
          <div className="xl:col-span-2">
            <StatsCard
              title="Heure de Pointe"
              value={dashboardStats.peakHour || 'N/A'}
              icon={Clock}
              description="Plus forte affluence"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Durée Moyenne"
            value={formatDuration(dashboardStats.averageDuration || 0)}
            icon={TrendingUp}
            description="Temps de visite moyen"
            trend={{ value: dashboardStats.durationTrend || 0, isPositive: (dashboardStats.durationTrend || 0) >= 0 }}
          />
          
          <StatsCard
            title="Top Employé"
            value={dashboardStats.topEmployee || 'N/A'}
            icon={Award}
            description="Plus de visiteurs reçus"
          />
          
          <StatsCard
            title="Top Département"
            value={dashboardStats.topDepartment || 'N/A'}
            icon={Building}
            description="Plus visité ce mois"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <VisitorsChart data={hourlyStats} />
          <DepartmentChart data={departmentStats} />
        </div>

        {/* Employee Stats */}
        <div className="mb-8">
          <EmployeeTable data={employeeStats} />
        </div>

        {/* Footer Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="border-r border-gray-200 last:border-r-0">
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(dashboardStats.totalVisitors || 0)}
              </div>
              <div className="text-sm text-gray-600">Visiteurs totaux</div>
            </div>
            <div className="border-r border-gray-200 last:border-r-0">
              <div className="text-2xl font-bold text-green-600">
                {formatDuration(dashboardStats.averageDuration || 0)}
              </div>
              <div className="text-sm text-gray-600">Durée moyenne</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {departmentStats.length}
              </div>
              <div className="text-sm text-gray-600">Départements actifs</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
