import { CloseButton, FileUpload, Input, InputGroup, Text } from "@chakra-ui/react";
import { LuFileUp } from "react-icons/lu";

export type ComponentImageUploadProps = {
  onSetImage: (file: File) => void;
};

const ComponentImageUpload = ({ onSetImage }: ComponentImageUploadProps) => {
  return (
    <FileUpload.Root onFileChange={(e) => onSetImage(e.acceptedFiles[0])} gap="1">
      <FileUpload.HiddenInput />
      <FileUpload.Label>Image Of Person</FileUpload.Label>
      <InputGroup
        startElement={<LuFileUp />}
        endElement={
          <FileUpload.ClearTrigger asChild>
            <CloseButton
              me="-1"
              size="xs"
              variant="plain"
              focusVisibleRing="inside"
              focusRingWidth="2px"
              pointerEvents="auto"
            />
          </FileUpload.ClearTrigger>
        }
      >
        <Input asChild>
          <FileUpload.Trigger>
            <FileUpload.Context>
              {({ acceptedFiles }) => (
                <Text lineClamp={1}>
                  {acceptedFiles.length > 0
                    ? acceptedFiles[0].name
                    : "Upload an image of the person"}
                </Text>
              )}
            </FileUpload.Context>
          </FileUpload.Trigger>
        </Input>
      </InputGroup>
    </FileUpload.Root>
  );
};

export default ComponentImageUpload;
