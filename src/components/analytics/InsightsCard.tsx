import React from 'react';
import { AlertCircle, Info, TrendingUp, Users, DollarSign, Package } from 'lucide-react';

interface InsightsCardProps {
  insight: {
    type: string;
    title: string;
    description: string;
    severity?: string;
    action_required?: string;
  };
}

const InsightsCard: React.FC<InsightsCardProps> = ({ insight }) => {
  const getIcon = () => {
    switch (insight.type) {
      case 'revenue':
        return <DollarSign className="w-5 h-5" />;
      case 'customer':
        return <Users className="w-5 h-5" />;
      case 'product':
        return <Package className="w-5 h-5" />;
      case 'operational':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColorClasses = () => {
    switch (insight.severity) {
      case 'critical':
        return {
          border: 'border-red-200',
          bg: 'bg-red-50',
          icon: 'text-red-600',
          title: 'text-red-900',
          text: 'text-red-700'
        };
      case 'warning':
        return {
          border: 'border-yellow-200',
          bg: 'bg-yellow-50',
          icon: 'text-yellow-600',
          title: 'text-yellow-900',
          text: 'text-yellow-700'
        };
      default:
        return {
          border: 'border-blue-200',
          bg: 'bg-blue-50',
          icon: 'text-blue-600',
          title: 'text-blue-900',
          text: 'text-blue-700'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className={`border ${colors.border} ${colors.bg} rounded-lg p-4 transition-all hover:shadow-md`}>
      <div className="flex items-start gap-3">
        <div className={`${colors.icon} mt-0.5`}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`font-semibold ${colors.title}`}>{insight.title}</h3>
            {insight.severity && insight.severity !== 'info' && (
              <AlertCircle className={`w-4 h-4 ${colors.icon}`} />
            )}
          </div>
          <p className={`text-sm ${colors.text} mb-3`}>{insight.description}</p>
          {insight.action_required && (
            <div className={`text-xs font-medium ${colors.text} bg-white bg-opacity-50 rounded px-3 py-2`}>
              <span className="font-semibold">Action: </span>
              {insight.action_required}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightsCard;
