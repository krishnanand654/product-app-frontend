/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import DragAndDrop from "../Upload/DragAndDrop/DragAndDrop";
import { useDispatch } from "react-redux";
import { setDataStatus } from "../../redux/actions";
import { message } from 'antd';
import CustomModal from "../Modal/CustomModal";
import { updateProduct } from "../../util/axiosMethods/axiosMethods";

export default function NewUpdateModal({ name, description, image, price, _id, image_id }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newName, setNewName] = useState(name);
    const [newDescription, setNewDescription] = useState(description);
    const [newPrice, setNewPrice] = useState(price);
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



    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };


    const handleSubmit = async () => {
        setLoading(true);
        try {
            const updateStatus = await updateProduct(selectedFile, newName, newDescription, newPrice, image_id, _id,);
            if (updateStatus) {
                updateSuccess();
                setLoading(false);
                dispatch(setDataStatus(true));
                onClose();
            }

        } catch (e) {
            setError(e.response?.data?.error);
        } finally {
            setLoading(false);
        }

    }

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
                <div className="w-40 h-40">
                    <img className="h-full w-full object-contain rounded-md" src={image} alt="Product" />
                </div>
                <Input type="text" label="Product Name" name="name" value={newName} onChange={(e) => setNewName(e.target.value)} className="lg:w-96 md:w-full sm:w-full" isRequired />
                <Input type="text" label="Description" name="description" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="lg:w-96 md:w-full sm:w-full" isRequired />
                <Input type="number" label="Price" name="price" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="lg:w-96 md:w-full sm:w-full" isRequired />

                <DragAndDrop onFileSelect={handleFileSelect} token={localStorage.getItem("accessToken")} />
            </CustomModal>
        </>
    );
}
