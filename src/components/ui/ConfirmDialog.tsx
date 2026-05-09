import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { useRouter } from "@tanstack/react-router";
import toast from "react-hot-toast";
import deleteBanById from "@/api-requests/ban/deleteBanById";
import { isErrorCheck } from "@/utils";
import type { Ban } from "@/utils/interfaces";

export type ConfirmDialogProps = {
    children: React.ReactNode;
    ban: Ban;
    open: boolean;
    onSelectOpen: (open: boolean) => void;
};

const ConfirmDialog = ({
    children,
    ban,
    open,
    onSelectOpen,
}: ConfirmDialogProps) => {
    const router = useRouter();

    const deleteBanHandler = async (banId: string) => {
        onSelectOpen(false);

        await new Promise((resolve) => setTimeout(resolve, 150));

        const result = await deleteBanById(banId);

        if (isErrorCheck(result)) {
            toast.error("Error deleting ban, try again later");
            return;
        }

        toast.success(`Ban for ${ban.person?.name} deleted successfully`);
        await router.invalidate();
    };

    return (
        <>
            {children}
            <Dialog.Root
                lazyMount
                open={open}
                onOpenChange={(e) => onSelectOpen(e.open)}
                placement="center"
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Delete Ban?</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                Are you sure you want to delete this item? This action cannot be
                                undone.
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                </Dialog.ActionTrigger>
                                <Button colorPalette="red" onClick={() => deleteBanHandler(ban.id)}>
                                    Delete
                                </Button>
                            </Dialog.Footer>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    );
};

export default ConfirmDialog;
