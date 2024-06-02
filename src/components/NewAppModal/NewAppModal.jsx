/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import DragAndDrop from "../Upload/DragAndDrop/DragAndDrop";
import { Button, useDisclosure } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { useDispatch } from 'react-redux';
import { setDataStatus } from '../../redux/actions';
import CustomModal from "../Modal/CustomModal";
import { insertProduct } from "../../util/axiosMethods/axiosMethods";

export default function NewAppModal() {
    const dispatch = useDispatch();
    const token = localStorage.getItem("accessToken");
    const { isOpen, onOpen, onClose } = useDisclosure();
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
            const insertStatus = await insertProduct(selectedFile, productData);
            if (insertStatus) {
                dispatch(setDataStatus(true));
                setLoading(false);
                setValid(false);
                setProductData({ name: '', price: '', description: '', image_id: '' });
                setSelectedFile(null);
                onClose();
            }
        } catch (e) {
            setError(e.response?.data?.error || "An error occurred while inserting the product.");
        } finally {
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
