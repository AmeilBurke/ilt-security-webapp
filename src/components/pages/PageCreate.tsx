import { Box, HStack, Image, VStack } from "@chakra-ui/react";
import ComponentPageHeading from "../ui/ComponentPageHeading";
import ComponentReturnArrow from "../ui/ComponentReturnArrow";

type ComponentCreateProps = {
  heading: string;
  subHeading: string;
  inputs: React.ReactNode;
  button: React.ReactNode;
  imagePath?: string;
  returnArrow?: boolean;
};
const PageCreate = ({
  heading,
  subHeading,
  inputs,
  button,
  imagePath,
  returnArrow
}: ComponentCreateProps) => {
  return (
    <HStack>
      <VStack w="full" gap={[undefined, undefined, 10]}>
        {
          returnArrow && (
            <Box w="full">
              <ComponentReturnArrow navigateTo="/" />
            </Box>
          )
        }
        <ComponentPageHeading heading={heading} subHeading={subHeading} />
        <VStack
          w={["full", undefined, "full"]}
          gap={10}
        >
          {inputs}
        </VStack>
        {button}
      </VStack>
      {
        imagePath
          ? <Image hideBelow="md" h="dvh" src={imagePath} />
          : null
      }
    </HStack>
  );
};

export default PageCreate;
