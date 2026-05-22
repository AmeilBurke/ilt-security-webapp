import {
    CloseButton,
    type ConditionalValue,
    Dialog,
    Portal,
} from "@chakra-ui/react";

type ComponentDialogProps = {
    title: string;
    dialogTrigger: React.ReactNode,
    bodyContent: React.ReactNode;
    footerContent: React.ReactNode;
    isOpen: boolean;
    onOpenSelect: (open: boolean) => void;
    size?: ConditionalValue<"sm" | "xs" | "md" | "lg" | "xl" | "cover">;
};

const ComponentDialog = ({
    title,
    dialogTrigger,
    bodyContent,
    footerContent,
    isOpen,
    onOpenSelect,
    size
}: ComponentDialogProps) => {
    return (
        <Dialog.Root open={isOpen} placement="center" scrollBehavior="inside" onOpenChange={(e) => onOpenSelect(e.open)} size={size ? size : 'md'}>
            <Dialog.Trigger asChild>
                {dialogTrigger}
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{title}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            {bodyContent}
                        </Dialog.Body>
                        <Dialog.Footer>
                            {footerContent}
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default ComponentDialog;
