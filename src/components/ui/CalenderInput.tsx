import { DatePicker, type DateValue, Field, Portal } from "@chakra-ui/react";

export type CalenderInputProps = {
    selectedDate: DatePicker.DateValue[],
    onDateSelect: (dateValue: DateValue[]) => void,
    labelText: string,
    helperText?: string,
    isDisabled?: boolean
}

const formatDate = (date: DateValue) => {
    const day = date.day.toString().padStart(2, "0");
    const month = date.month.toString().padStart(2, "0");
    const year = date.year.toString();
    return `${day}/${month}/${year}`;
};

const CalenderInput = ({ selectedDate, onDateSelect, labelText, helperText, isDisabled }: CalenderInputProps) => {
    return (
        <Field.Root>
            <DatePicker.Root
                required
                format={formatDate}
                variant="flushed"
                placeholder="dd/mm/yyyy"
                openOnClick
                value={selectedDate}
                onValueChange={(e) => onDateSelect(e.value)}
                disabled={isDisabled === undefined ? false : isDisabled}
            >
                <DatePicker.Label asChild>
                    <Field.Label>
                        {labelText} <Field.RequiredIndicator />
                    </Field.Label>
                </DatePicker.Label>
                <DatePicker.Control>
                    <DatePicker.Input />
                    <DatePicker.IndicatorGroup />
                </DatePicker.Control>
                {
                    helperText
                        ? <Field.HelperText>{helperText}</Field.HelperText>
                        : null
                }
                <Portal>
                    <DatePicker.Positioner>
                        <DatePicker.Content>
                            <DatePicker.View view="day">
                                <DatePicker.Header />
                                <DatePicker.DayTable />
                            </DatePicker.View>
                            <DatePicker.View view="month">
                                <DatePicker.Header />
                                <DatePicker.MonthTable />
                            </DatePicker.View>
                            <DatePicker.View view="year">
                                <DatePicker.Header />
                                <DatePicker.YearTable />
                            </DatePicker.View>
                        </DatePicker.Content>
                    </DatePicker.Positioner>
                </Portal>
            </DatePicker.Root>
        </Field.Root>
    );
};

export default CalenderInput;
