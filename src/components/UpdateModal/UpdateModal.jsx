import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import DragAndDrop from "../Upload/DragAndDrop/DragAndDrop";
import { useDispatch } from "react-redux";
import { setInsertStatus } from "../../redux/actions";
import RefreshTokenHandler from "../../util/RefreshTokenHandler";
import { message } from 'antd';


export default function UpdateModal({ name, description, image, price, _id, image_id }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [backdrop, setBackdrop] = React.useState('blur')
    const [newName, setNewName] = useState(name);
    const [newDescription, setNewDescription] = useState(description);
    const [newPrice, setNewPrice] = useState(price);
    const [newImageId, setNewImageId] = useState(null);
    const [retry, setRetry] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const updateSuccess = () => {
        messageApi.open({
            type: 'success',
            content: 'Product Updated successfully',
        });
    };

    const dispatch = useDispatch();


    useEffect(() => {
        if (retry) {
            handleSubmit();
            setRetry(false);
        }
    }, [retry])

    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

    useEffect(() => {
        if (newImageId) {
            handleUpdateProduct();
        }
    }, [newImageId]);

    const handleUpdateProduct = async () => {
        try {
            const response = await axios.put(`http://localhost:3000/products/update/${_id}`, {
                name: newName,
                description: newDescription,
                price: newPrice,
                image_id: newImageId == null ? image_id : newImageId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            updateSuccess();


            setLoading(false);
            dispatch(setInsertStatus(true));
            onClose();
        } catch (error) {
            if (error.response.status === 403) {
                try {
                    RefreshTokenHandler();

                } catch (refreshError) {
                    console.error("Error refreshing token:", refreshError);

                }
            } else {
                console.error("Error uploading", error);
                setLoading(false);
            }
        }
    }


    const token = localStorage.getItem("accessToken");
    const handleSubmit = async () => {
        setLoading(true);
        if (selectedFile) {
            try {
                const imageResponse = await axios.delete(`http://localhost:3000/files/delete/${image_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (imageResponse.status === 200) {
                    console.log(imageResponse.data.message);

                    dispatch(setInsertStatus(true));
                }
            } catch (error) {
                console.log(error)
            }

            try {

                if (selectedFile) {
                    const formData = new FormData();
                    formData.append('file', selectedFile);
                    try {
                        console.log("re-uploading")
                        const fileResponse = await axios.post('http://localhost:3000/files/upload', formData, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data',
                            }
                        });


                        if (fileResponse.status === 200) {
                            setNewImageId(fileResponse.data.fileId);

                        }
                    } catch (error) {
                        if (error.response.status === 403) {
                            try {
                                RefreshTokenHandler();

                            } catch (refreshError) {
                                console.error("Error refreshing token:", refreshError);

                            }
                        } else {
                            console.error("Error uploading", error);

                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            handleUpdateProduct();
        }
    }




    const handleOpen = (backdrop) => {
        setBackdrop(backdrop)
        onOpen();
    }

    return (
        <>
            {contextHolder}

            <div className="flex flex-wrap gap-3">

                <Button
                    variant="flat"
                    onPress={() => handleOpen('blur')}
                    className="bg-black text-white"
                    size="sm"
                >
                    Update
                </Button>

            </div>
            <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                            <ModalBody>
                                <Input type="text" label="Product Name" name="name" value={newName} onChange={(e) => { setNewName(e.target.value) }} className=" lg:w-96 md:w-full sm:w-full" isRequired />
                                <Input type="text" label="Description" name="description" value={newDescription} onChange={(e) => { setNewDescription(e.target.value) }} className=" lg:w-96 md:w-full sm:w-full" isRequired />
                                <Input type="number" label="Price" name="price" value={newPrice} onChange={(e) => { setNewPrice(e.target.value) }} className=" lg:w-96 md:w-full sm:w-full" isRequired />
                                <div className="w-40 h-40">
                                    <img className="h-full w-full object-contain" src={image} />
                                </div>
                                <DragAndDrop onFileSelect={handleFileSelect} token={token} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" className="bg-black text-white" onPress={handleSubmit} isLoading={loading}>
                                    Update
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
