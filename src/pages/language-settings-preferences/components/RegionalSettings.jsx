import React from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const RegionalSettings = ({
  dateFormat,
  onDateFormatChange,
  numberFormat,
  onNumberFormatChange,
  timeFormat,
  onTimeFormatChange,
  culturalContext,
  onCulturalContextChange
}) => {
  const dateFormatOptions = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', description: 'US format (12/31/2024)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', description: 'European format (31/12/2024)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD', description: 'ISO format (2024-12-31)' },
    { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY', description: 'German format (31.12.2024)' },
  ];

  const numberFormatOptions = [
    { value: 'US', label: '1,234.56', description: 'US/UK format' },
    { value: 'EU', label: '1.234,56', description: 'European format' },
    { value: 'IN', label: '1,23,456.78', description: 'Indian format' },
    { value: 'CH', label: "1\'234.56", description: 'Swiss format' },
  ];

  const timeFormatOptions = [
    { value: '12', label: '12-hour (AM/PM)', description: '2:30 PM' },
    { value: '24', label: '24-hour', description: '14:30' },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Globe" size={16} className="text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Regional Settings</h3>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Date Format"
            description="How dates are displayed"
            options={dateFormatOptions}
            value={dateFormat}
            onChange={onDateFormatChange}
          />

          <Select
            label="Time Format"
            description="12-hour or 24-hour format"
            options={timeFormatOptions}
            value={timeFormat}
            onChange={onTimeFormatChange}
          />
        </div>

        <div>
          <Select
            label="Number Format"
            description="How numbers and decimals are displayed"
            options={numberFormatOptions}
            value={numberFormat}
            onChange={onNumberFormatChange}
          />
        </div>

        <div>
          <Checkbox
            label="Use cultural context in AI responses"
            description="AI will consider cultural nuances and local customs when generating responses"
            checked={culturalContext}
            onChange={(e) => onCulturalContextChange(e?.target?.checked)}
          />
        </div>

        <div className="p-4 bg-accent rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Calendar" size={16} className="text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Preview:</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Date: {dateFormat?.replace('YYYY', '2024')?.replace('MM', '08')?.replace('DD', '07')}</p>
                <p>Time: {timeFormat === '12' ? '7:18 AM' : '07:18'}</p>
                <p>Number: {numberFormat === 'US' ? '1,234.56' : numberFormat === 'EU' ? '1.234,56' : numberFormat === 'IN' ? '1,23,456.78' : "1'234.56"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalSettings;