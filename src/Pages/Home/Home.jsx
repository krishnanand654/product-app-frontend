import axios from 'axios';
import { useEffect, useState } from 'react';
import Card from '../../components/Card/Card';
import AppNavbar from '../../components/AppNavbar/AppNavbar';
import { useSelector, useDispatch } from 'react-redux';
import { setInsertStatus } from '../../redux/actions';
import { message } from 'antd';
import RefreshTokenHandler from '../../util/RefreshTokenHandler';
import NewAppModal from '../../components/NewAppModal/NewAppModal';
// import useRefreshToken from '../../util/RefreshTokenHandler';

const Home = () => {
    const [data, setData] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Product deleted successfully',
        });
    };

    const insertStatus = useSelector(state => state.insertStatus);
    const newtoken = useSelector(state => state.token);
    const dispatch = useDispatch();
    const token = localStorage.getItem("accessToken") || newtoken;



    useEffect(() => {
        fetchData();
        dispatch(setInsertStatus(false));

    }, [insertStatus,]);



    const fetchData = async () => {

        try {
            const response = await axios.get("http://localhost:3000/products/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response && response.data) {
                const products = response.data;
                const productsWithImages = await Promise.all(products.map(async (product) => {
                    try {
                        const imageResponse = await axios.get(`http://localhost:3000/files/${product.image_id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
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

                setData(productsWithImages);
            } else {
                console.error("Invalid response structure:", response);
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                const refreshed = await RefreshTokenHandler();
                if (refreshed) {
                    dispatch(setInsertStatus(true));
                }
            } else {
                console.error("Error fetching data:", error.message || error);
            }
        }

    };


    const handleDelete = async (id, image_id) => {
        try {
            const token = localStorage.getItem("accessToken");
            const productResponse = await axios.delete(`http://localhost:3000/products/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (productResponse.status === 200) {
                const imageResponse = await axios.delete(`http://localhost:3000/files/delete/${image_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (imageResponse.status === 200) {
                    console.log(imageResponse.data.message);
                    success();
                    dispatch(setInsertStatus(true));
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                const refreshed = await RefreshTokenHandler();
                if (refreshed) {
                    handleDelete(id, image_id); // Retry the delete operation
                }
            } else {
                console.error("Error deleting product:", error);
            }
        }
    };

    return (
        <div>
            {contextHolder}
            <AppNavbar />
            <div className='lg:mt-2 mb-36 lg:m-[250px] rounded-lg'>
                <div className='w-full flex justify-end mb-3 mt-3 sm:mr-2'>
                    {/* <AppModal />
                     */}
                    <NewAppModal />
                </div>
                <div className='flex flex-wrap gap-6 justify-start '>
                    {data.length > 0 ? data.map((e) => (
                        <div key={e._id}>
                            <Card
                                name={e.name}
                                description={e.description}
                                price={e.price}
                                image={e.imageUrl && e.imageUrl}
                                _id={e._id}
                                image_id={e.image_id}
                                onDelete={handleDelete}
                            />
                        </div>
                    )) : <p className="text-center w-full">No products available.</p>}
                </div>
            </div>
        </div>
    );
};

export default Home;
