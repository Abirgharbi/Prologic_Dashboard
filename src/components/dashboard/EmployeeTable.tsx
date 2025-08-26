
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmployeeStats } from '../../types/dashboard';

interface EmployeeTableProps {
  data: EmployeeStats[];
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => b.visits - a.visits);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top employés par nombre de visiteurs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedData.slice(0, 8).map((employee, index) => (
            <div key={employee.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{employee.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {employee.department}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600">{employee.visits}</p>
                <p className="text-xs text-gray-500">visiteurs</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeTable;
