import axios from 'axios';
import { useEffect, useState } from 'react';
import Card from '../../components/Card/Card';
import AppNavbar from '../../components/AppNavbar/AppNavbar';
import AppModal from '../../components/AppModal/AppModal';
import { useSelector, useDispatch } from 'react-redux';
import { setInsertStatus } from '../../redux/actions'

const Home = () => {
    const [data, setData] = useState([]);

    const insertStatus = useSelector(state => state.insertStatus);
    const dispatch = useDispatch();
    const token = localStorage.getItem("accessToken");


    useEffect(() => {
        fetchData();


        dispatch(setInsertStatus(false));
    }, [insertStatus]);


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
                        console.error(`Error fetching image for product ${product._id}:`, error);
                        return product;
                    }
                }));

                setData(productsWithImages);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:3000/products/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.status == 200) {
                console.log(response.data.message);
                dispatch(setInsertStatus(true));
            }
        })
    }



    return (
        <div>
            <AppNavbar />

            <div className=' lg:mt-2 mb-36   lg:m-[250px]  rounded-lg'>
                <div className='w-full flex justify-end mb-3 mt-3 sm:mr-2'>
                    <AppModal />
                </div>
                <div className='flex flex-wrap gap-6 justify-start '>
                    {data.length > 0 ? data.map((e) => (
                        <div key={e._id}>

                            <Card name={e.name} description={e.description} price={e.price} image={e.imageUrl && e.imageUrl} _id={e._id} onDelete={handleDelete} />
                        </div>
                    )) : <p>No products available.</p>}
                </div>
            </div>

        </div>



    );
};

export default Home;
