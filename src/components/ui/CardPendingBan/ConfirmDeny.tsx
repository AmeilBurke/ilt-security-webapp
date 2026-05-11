import { Button, CloseButton, Dialog, Portal, Text } from "@chakra-ui/react";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import deleteBanById from "@/api-requests/ban/deleteBanById";
import { isErrorCheck } from "@/utils";

type ConfirmDenyProps = {
    children: React.ReactNode;
    banId: string;
};

const ConfirmDeny = ({ children, banId }: ConfirmDenyProps) => {
    const router = useRouter();
    const [confirmDenyModalOpen, setConfirmDenyModalOpen] = useState(false);

    const handleBanDeny = async () => {
        const result = await deleteBanById(banId);

        if (isErrorCheck(result)) {
            toast.error("Error while trying to deny ban. Try again later");
            setConfirmDenyModalOpen(false);
            return;
        }

        toast.success("Ban Denied");
        router.invalidate();
    };

    return (
        <Dialog.Root
            lazyMount
            open={confirmDenyModalOpen}
            onOpenChange={(e) => setConfirmDenyModalOpen(e.open)}
            placement="center"
        >
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Confirm Deny?</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Text>Confirm to deny & remove the ban from the system</Text>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button colorPalette="red" onClick={handleBanDeny}>
                                Deny
                            </Button>
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

export default ConfirmDeny;
