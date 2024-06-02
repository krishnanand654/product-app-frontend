/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import DragAndDrop from "../Upload/DragAndDrop/DragAndDrop";
import { useDispatch } from "react-redux";
import { setInsertStatus } from "../../redux/actions";
import { message } from 'antd';
import CustomModal from "../Modal/CustomModal";
import axiosInstance from "../../util/axios/api";

export default function NewUpdateModal({ name, description, image, price, _id, image_id }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newName, setNewName] = useState(name);
    const [newDescription, setNewDescription] = useState(description);
    const [newPrice, setNewPrice] = useState(price);
    const [newImageId, setNewImageId] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    const updateSuccess = () => {
        messageApi.open({
            type: 'success',
            content: 'Product Updated successfully',
        });
    };

    useEffect(() => {
        if (newImageId) {
            handleUpdateProduct();
        }
    }, [newImageId]);

    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

    const handleUpdateProduct = async (imageId) => {
        try {
            const response = await axiosInstance.put(`/products/update/${_id}`, {
                name: newName,
                description: newDescription,
                price: newPrice,
                image_id: imageId == null ? image_id : imageId
            });

            if (response.status === 200) {
                updateSuccess();
                setNewImageId(null);
                setLoading(false);
                dispatch(setInsertStatus(true));
                onClose();
            }
        } catch (error) {

            console.error("Error uploading", error);
            setLoading(false);

        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        if (selectedFile) {
            try {
                const formData = new FormData();
                formData.append('file', selectedFile);

                const fileResponse = await axiosInstance.put(`/files/update/${image_id}`, formData);

                if (fileResponse.status === 200) {
                    handleUpdateProduct(fileResponse.data.fileId);
                }
            } catch (error) {
                console.error("Error inserting product:", error);
                setError(error.response.data.error);
                setLoading(false);
            }
        } else {
            handleUpdateProduct();
        }
    };

    return (
        <>
            {contextHolder}
            <div className="flex flex-wrap gap-3">
                <Button
                    variant="flat"
                    onPress={onOpen}
                    className="bg-black text-white"
                    size="sm"
                >
                    Update
                </Button>
            </div>
            <CustomModal
                title="Update Product"
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={handleSubmit}
                submitButtonText="Update"
                isSubmitDisabled={false}
                isSubmitLoading={loading}
                error={error}
            >
                <Input type="text" label="Product Name" name="name" value={newName} onChange={(e) => setNewName(e.target.value)} className="lg:w-96 md:w-full sm:w-full" isRequired />
                <Input type="text" label="Description" name="description" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="lg:w-96 md:w-full sm:w-full" isRequired />
                <Input type="number" label="Price" name="price" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="lg:w-96 md:w-full sm:w-full" isRequired />
                <div className="w-40 h-40">
                    <img className="h-full w-full object-contain" src={image} alt="Product" />
                </div>
                <DragAndDrop onFileSelect={handleFileSelect} token={localStorage.getItem("accessToken")} />
            </CustomModal>
        </>
    );
}
