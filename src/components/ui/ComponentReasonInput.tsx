import { Field, Input } from "@chakra-ui/react"

export type ComponentReasonInputProps = {
    onSetReason: (reason: string) => void;
}

const ComponentReasonInput = ({ onSetReason }: ComponentReasonInputProps) => {
    return (
        <Field.Root required>
            <Field.Label>
                Reason <Field.RequiredIndicator />
            </Field.Label>
            <Input
                onChange={(event) => onSetReason(event.target.value)}
                placeholder="Enter reason for alert"
                variant="flushed"
            />
        </Field.Root>
    )
}

export default ComponentReasonInput