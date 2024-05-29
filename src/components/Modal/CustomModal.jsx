/* eslint-disable no-unused-vars */
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

const CustomModal = ({
    title,
    isOpen,
    onClose,
    children,
    onSubmit,
    submitButtonText = 'Submit',
    isSubmitDisabled = false,
    isSubmitLoading = false,
    error
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                {(handleClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                        <ModalBody>
                            {children}
                            {error && <p className="text-danger">{error}</p>}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button className="bg-black text-white" onPress={onSubmit} isDisabled={isSubmitDisabled} isLoading={isSubmitLoading}>
                                {submitButtonText}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default CustomModal;
