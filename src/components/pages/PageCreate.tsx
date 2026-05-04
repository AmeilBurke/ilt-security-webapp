import { HStack, Image, Text, VStack } from "@chakra-ui/react";

type ComponentCreateProps = {
  heading: string;
  subText: string;
  inputs: React.ReactNode;
  button: React.ReactNode;
  imagePath?: string;
};
const PageCreate = ({
  heading,
  subText,
  inputs,
  button,
  imagePath,
}: ComponentCreateProps) => {
  return (
    <HStack
      // pt={100}
      // w="full"
      // h="full"
      // minH="dvh"
      paddingTop={[
        "calc(env(safe-area-inset-top) + 2rem)",
        undefined,
        "calc(env(safe-area-inset-top))",
      ]}
      paddingBottom={[
        "calc(env(safe-area-inset-bottom) + 2rem)",
        undefined,
        "calc(env(safe-area-inset-bottom))",
      ]}
      paddingLeft={[
        "calc(env(safe-area-inset-left) + 2rem)",
        undefined,
        "calc(env(safe-area-inset-left) + 4rem)",
      ]}
      paddingRight={[
        "calc(env(safe-area-inset-right) + 2rem)",
        undefined,
        "calc(env(safe-area-inset-right))",
      ]}
    >
      <VStack w="full" alignItems="start" gap={10}>
        <VStack w="full" gap={[undefined, undefined, 4]}>
          <Text textStyle="title">{heading}</Text>
          <Text textStyle="muted">{subText}</Text>
        </VStack>
        <VStack
          w={["full", undefined, "full"]}
          paddingRight={[
            undefined,
            undefined,
            "calc(env(safe-area-inset-right) +  4rem)",
          ]}
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
