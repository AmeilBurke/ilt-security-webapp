import { CloseButton, Dialog, Portal } from "@chakra-ui/react";

export type BanDetailsDialogProps = {
    isOpen: boolean;
    onCloseDialog: () => void;
    title: string;
    body: React.ReactNode;
    footer?: React.ReactNode;
    onCloseFinish?: () => void;
};

const ComponentDialog = ({ isOpen, onCloseDialog, title, body, footer, onCloseFinish }: BanDetailsDialogProps) => {
    return (
        <Dialog.Root
            size="xl"
            placement="center"
            role="alertdialog"
            closeOnInteractOutside
            open={isOpen}
            onOpenChange={(e) => {
                if (!e.open) onCloseDialog();
            }}
            onExitComplete={() => {
                if (onCloseFinish) {
                    onCloseFinish()
                }
            }}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton />
                        </Dialog.CloseTrigger>
                        <Dialog.Header>
                            <Dialog.Title>{title}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            {body}
                        </Dialog.Body>
                        <Dialog.Footer>
                            {footer}
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default ComponentDialog;
