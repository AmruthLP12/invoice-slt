// components/DatePickers.tsx
import React from "react";
import { DatePicker } from "@/components/ui/date-picker";

interface DatePickersProps {
  today: Date;
  setToday: React.Dispatch<React.SetStateAction<Date>>;
  selectedDate: Date | undefined;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  isDateValid: boolean;
  setIsDateValid: React.Dispatch<React.SetStateAction<boolean>>;
}

const DatePickers: React.FC<DatePickersProps> = ({
  today,
  setToday,
  selectedDate,
  setSelectedDate,
  isDateValid,
  setIsDateValid,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      <div>
        <label className="block mb-1">Today&apos;s Date (editable):</label>
        <DatePicker
          date={today}
          onDateChange={(date) => {
            if (date) {
              setToday(date); // Ensure date is defined before setting
            }
          }}
        />
      </div>
      <div>
        <label className="block mb-1">
          Select Date:<span className="text-red-700">*</span>
        </label>
        <DatePicker
          date={selectedDate}
          onDateChange={(date) => {
            if (date) {
              setSelectedDate(date);
              setIsDateValid(true);
            }
          }}
        />
        {!isDateValid && (
          <p className="text-red-500 text-sm">Please select a date.</p>
        )}
      </div>
    </div>
  );
};

export default DatePickers;
