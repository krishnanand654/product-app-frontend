import { useEffect, useState } from "react";
import DragAndDrop from "../Upload/DragAndDrop/DragAndDrop";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import { Input } from "@nextui-org/react";

export default function AppModal({ status }) {
    const token = localStorage.getItem("accessToken");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [backdrop, setBackdrop] = useState('opaque');
    const [productData, setProductData] = useState({ name: '', price: '', description: '', image_id: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [valid, setValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleOpen = (backdrop) => {
        setBackdrop(backdrop);
        onOpen();
    };

    const handleClose = () => {
        productData.name = ''
        productData.price = ''
        productData.description = ''
        setSelectedFile(null)
        onClose()
    }

    const handleFileSelect = (file) => {
        setSelectedFile(file); // Update state with the selected file
    };



    useEffect(() => {

        if (productData.name == '' || productData.price == '' || productData.description == '' || selectedFile == null) {
            setValid(false);
            console.log("not valid");
        } else {
            setValid(true);
            console.log("valid");
        }
    }, [productData, selectedFile])

    const onSubmit = async () => {
        setLoading(true);
        try {

            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);

                const fileResponse = await axios.post('http://localhost:3000/files/upload', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                });


                if (fileResponse.status == 200) {
                    productData.image_id = fileResponse.data.fileId;
                }
                setLoading(false);
            }


            const dataResponse = await axios.post('http://localhost:3000/products/create', productData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (dataResponse.status === 201) {
                console.log("Inserted");
                setLoading(false);
                if (status) {
                    status(true);
                }
                setValid(false);
                productData.name = ''
                productData.price = ''
                productData.description = ''
                setSelectedFile(null)

                onClose();
            } else {
                console.log("Not inserted");

                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.error("Error inserting product:", error);
            setError(error.response.data.error)
        }
    }



    return (
        <>
            <div className="flex flex-wrap gap-3">
                <Button
                    variant="flat"
                    color="warning"
                    onPress={() => handleOpen("blur")}
                    className="capitalize"
                >
                    Open
                </Button>
            </div>
            <Modal backdrop={backdrop} isOpen={isOpen} onClose={handleClose}>
                <ModalContent>
                    {(handleClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Insert Product</ModalHeader>
                            <ModalBody>
                                <div className="flex flex-wrap gap-6">
                                    <Input type="text" label="Product Name" name="name" onChange={handleChange} className=" lg:w-96 md:w-full sm:w-full" isRequired />
                                    <Input type="text" label="Description" name="description" onChange={handleChange} className=" lg:w-96 md:w-full sm:w-full" isRequired />
                                    <Input type="number" label="Price" name="price" onChange={handleChange} className=" lg:w-96 md:w-full sm:w-full" isRequired />
                                </div>

                                <DragAndDrop onFileSelect={handleFileSelect} token={token} />
                                {error && <p className="text-danger">{error}</p>}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={handleClose}>
                                    Close
                                </Button>
                                <Button className="bg-black text-white" onPress={onSubmit} isDisabled={!valid} isLoading={loading}>
                                    Add
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
