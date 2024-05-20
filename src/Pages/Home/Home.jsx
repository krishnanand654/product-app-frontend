import axios from 'axios';
import { useEffect, useState } from 'react';
import Card from '../../components/Card/Card';
import AppNavbar from '../../components/AppNavbar/AppNavbar';
import AppModal from '../../components/AppModal/AppModal';

const Home = () => {
    const [data, setData] = useState([]);
    const [insertStatus, setInsertStatus] = useState(false);
    useEffect(() => {
        fetchData();

        // setData([
        //     {
        //         _id: '6648c3939f2a7ebefe7d63bd',
        //         name: "Nike Air Force 1'07",
        //         description: "Women's Shoes",
        //         price: 9564,
        //         imageUrl: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/7a9a6091-8477-4e40-93fc-5ecb91e0231d/air-force-1-lv8-4-older-shoes-d24H2D.png',
        //         __v: 0
        //     },
        //     {
        //         _id: '6648c3939f2a7ebefe7d63be',
        //         name: "Adidas Ultraboost",
        //         description: "Men's Running Shoes",
        //         price: 7999,
        //         imageUrl: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/842700c8-51c8-4a4a-86fe-9f1ecb7b0984/air-force-1-low-evo-shoes-QcbnHZ.png',
        //         __v: 0
        //     },
        //     {
        //         _id: '6648c3939f2a7ebefe7d63bf',
        //         name: "Converse Chuck Taylor All Star",
        //         description: "Unisex High-Top Sneakers",
        //         price: 6499,
        //         imageUrl: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/4f37fca8-6bce-43e7-ad07-f57ae3c13142/air-force-1-07-shoes-WrLlWX.png',
        //         __v: 0
        //     },
        //     {
        //         _id: '6648c3939f2a7ebefe7d63c0',
        //         name: "Vans Old Skool",
        //         description: "Skate Shoes",
        //         price: 5999,
        //         imageUrl: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/4f5f6717-8099-48a3-beff-d2eacfbecb5c/air-force-1-07-lv8-shoes-g2c8Rd.png',
        //         __v: 0
        //     },
        //     {
        //         _id: '6648c3939f2a7ebefe7d63c1',
        //         name: "Puma Suede Classic",
        //         description: "Men's Casual Shoes",
        //         price: 6999,
        //         imageUrl: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/27828200-f962-4fa5-b14d-8058d58ab5f5/air-force-1-07-shoes-b0f549.png',
        //         __v: 0
        //     },
        //     // Add more fake data objects as needed
        // ])

    }, [insertStatus]);

    const handleStatus = (status) => {
        setInsertStatus(status);
    }

    const fetchData = async () => {
        const token = localStorage.getItem("accessToken");
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



    return (
        <div>
            <AppNavbar />

            <div className=' lg:pt-6 lg:mt-0 lg:m-[250px]  rounded-lg'>
                <AppModal status={handleStatus} />
                <div className='flex flex-wrap gap-6 justify-center '>
                    {data.length > 0 ? data.map((e) => (
                        <div key={e._id}>
                            <Card name={e.name} description={e.description} price={e.price} image={e.imageUrl && e.imageUrl} />
                        </div>
                    )) : <p>No products available.</p>}
                </div>
            </div>
        </div>



    );
};

export default Home;
