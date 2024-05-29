/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import DragAndDrop from "../Upload/DragAndDrop/DragAndDrop";
import { Button, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import { Input } from "@nextui-org/react";
import { useDispatch } from 'react-redux';
import { setInsertStatus } from '../../redux/actions';
import RefreshTokenHandler from "../../util/RefreshTokenHandler";
import CustomModal from "../Modal/CustomModal";

export default function NewAppModal() {
    const dispatch = useDispatch();
    const token = localStorage.getItem("accessToken");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [productData, setProductData] = useState({ name: '', price: '', description: '', image_id: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [valid, setValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [retry, setRetry] = useState(false);

    useEffect(() => {
        if (retry) {
            onSubmit();
            setRetry(false);
        }
    }, [retry]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

    useEffect(() => {
        if (productData.name === '' || productData.price === '' || productData.description === '' || selectedFile === null) {
            setValid(false);
        } else {
            setValid(true);
        }
    }, [productData, selectedFile]);

    const onSubmit = async () => {
        setLoading(true);
        try {
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                try {
                    const fileResponse = await axios.post('http://localhost:3000/files/upload', formData, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        }
                    });

                    if (fileResponse.status === 200) {
                        productData.image_id = fileResponse.data.fileId;
                    }
                } catch (error) {
                    if (error.response.status === 403) {
                        try {
                            const refreshed = await RefreshTokenHandler();
                            if (refreshed) {
                                setRetry(true);
                            } else {
                                console.error("Error refreshing token:", error);
                            }
                        } catch (refreshError) {
                            console.error("Error refreshing token:", refreshError);
                            setError(refreshError.response.data.error);
                        }
                    } else {
                        console.error("Error uploading file:", error);
                        setError(error.response.data.error);
                        setLoading(false);
                        return;
                    }
                }
            }
            try {
                const dataResponse = await axios.post('http://localhost:3000/products/create', productData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (dataResponse.status === 201) {
                    console.log("Inserted");
                    setLoading(false);
                    dispatch(setInsertStatus(true));
                    setValid(false);
                    setProductData({ name: '', price: '', description: '', image_id: '' });
                    setSelectedFile(null);
                    onClose();
                } else {
                    console.log("Not inserted");
                    setLoading(false);
                }
            } catch (error) {
                if (error.response.status === 403) {
                    console.log("Try refreshing token");
                    try {
                        const refreshed = RefreshTokenHandler();
                        if (refreshed) {
                            setRetry(true);
                        } else {
                            console.error("Error refreshing token:", error);
                        }
                    } catch (refreshError) {
                        console.error("Error refreshing token:", refreshError);
                        setError(refreshError.response.data.error);
                    }
                } else {
                    console.error("Error inserting product:", error);
                    setError(error.response.data.error);
                }
            }
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-wrap gap-3">
                <Button
                    variant="flat"
                    color="warning"
                    onPress={onOpen}
                    className="capitalize mr-3 lg:mr-0"
                >
                    <img src="https://img.icons8.com/?size=19&id=db3aaXZdalCP&format=png&color=D1A052" alt="Add Product" /> Add Product
                </Button>
            </div>
            <CustomModal
                title="Insert Product"
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={onSubmit}
                submitButtonText="Add"
                isSubmitDisabled={!valid}
                isSubmitLoading={loading}
                error={error}
            >
                <div className="flex flex-wrap gap-6">
                    <Input type="text" label="Product Name" name="name" onChange={handleChange} className="lg:w-96 md:w-full sm:w-full" isRequired />
                    <Input type="text" label="Description" name="description" onChange={handleChange} className="lg:w-96 md:w-full sm:w-full" isRequired />
                    <Input type="number" label="Price" name="price" onChange={handleChange} className="lg:w-96 md:w-full sm:w-full" isRequired />
                </div>
                <DragAndDrop onFileSelect={handleFileSelect} token={token} />
            </CustomModal>
        </>
    );
}
