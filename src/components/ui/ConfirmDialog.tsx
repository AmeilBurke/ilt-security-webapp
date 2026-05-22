import {
    CloseButton,
    type ConditionalValue,
    Dialog,
    Portal,
} from "@chakra-ui/react";

type ConfirmDialogProps = {
    trigger: React.ReactNode;
    title: string;
    body: React.ReactNode;
    footer: React.ReactNode;
    size: ConditionalValue<
        "sm" | "md" | "lg" | "xl" | "cover" | "xs" | "full" | undefined
    >;
};

const ConfirmDialog = ({
    trigger,
    title,
    body,
    footer,
    size
}: ConfirmDialogProps) => {
    return (
        <Dialog.Root
            role="alertdialog"
            size={size}
            placement="center"
            scrollBehavior="inside"
        >
            <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{title}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>{body}</Dialog.Body>
                        <Dialog.Footer>{footer}</Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default ConfirmDialog;
