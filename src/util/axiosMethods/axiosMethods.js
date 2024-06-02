import axiosInstance from "../axios/api";

export const fetchProducts = async () => {
    try {
        const response = await axiosInstance.get("/products/");

        if (response && response.data) {
            const products = response.data;
            const productsWithImages = await Promise.all(products.map(async (product) => {
                try {
                    const imageResponse = await axiosInstance.get(`/files/${product.image_id}`, {
                        responseType: 'blob',
                    });

                    if (imageResponse) {
                        const imageUrl = URL.createObjectURL(imageResponse.data);
                        return { ...product, imageUrl };
                    } else {
                        return product;
                    }
                } catch (error) {
                    console.error(`Error fetching image for product ${product._id}:`, error.message || error);
                    return product;
                }
            }));

            return productsWithImages;
        } else {
            console.error("Invalid response structure:", response);
        }
    } catch (error) {
        console.error("Error fetching data:", error.message || error);
    }
}

export const deleteProductById = async (id, image_id) => {
    try {

        const productResponse = await axiosInstance.delete(`/products/delete/${id}`)

        if (productResponse.status === 200) {
            const imageResponse = await axiosInstance.delete(`/files/delete/${image_id}`)

            if (imageResponse.status === 200) {
                return imageResponse.data.message;
            }
        }
    } catch (error) {
        console.error("Error fetching data:", error.message || error);
    }
}

export const insertProduct = async (selectedFile, productData) => {
    let fileId = null;

    try {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const fileResponse = await axiosInstance.post('/files/upload', formData);
            if (fileResponse.status === 200) {
                fileId = fileResponse.data.fileId;
            } else {
                throw new Error("File upload failed");
            }
        }

        const productDataWithImageId = { ...productData, image_id: fileId };

        const dataResponse = await axiosInstance.post('/products/create', productDataWithImageId);
        if (dataResponse.status === 201) {
            return dataResponse;
        } else {
            throw new Error("Product creation failed");
        }
    } catch (error) {
        if (selectedFile && fileId) {
            try {
                await axiosInstance.delete(`/files/delete/${fileId}`);
            } catch (deleteError) {
                console.error("Error deleting uploaded file:", deleteError);
            }
        }
        throw error;
    }
};

export const updateProduct = async (selectedFile, newName, newDescription, newPrice, image_id, _id) => {



    const handleUpdateProduct = async (imageId) => {
        try {
            const response = await axiosInstance.put(`/products/update/${_id}`, {
                name: newName,
                description: newDescription,
                price: newPrice,
                image_id: imageId == null ? image_id : imageId
            });

            if (response.status === 200) {
                return response;
            }
        } catch (error) {
            throw new error;
        }
    };



    if (selectedFile) {
        // eslint-disable-next-line no-useless-catch
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const fileResponse = await axiosInstance.put(`/files/update/${image_id}`, formData);

            if (fileResponse.status === 200) {
                return await handleUpdateProduct(fileResponse.data.fileId);
            }
        } catch (error) {
            throw error;
        }
    } else {
        return await handleUpdateProduct(null);
    }





}