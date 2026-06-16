import { VStack } from "@chakra-ui/react";


export type VStackGapMidProps = {
    children: React.ReactNode;
}

const VStackGapMid = ({ children }: VStackGapMidProps) => {
    return (
        <VStack gap={8} >
            {children}
        </VStack>
    )
}

export default VStackGapMid