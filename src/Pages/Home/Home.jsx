import { useEffect, useState } from 'react';
import Card from '../../components/Card/Card';
import AppNavbar from '../../components/AppNavbar/AppNavbar';
import { useSelector, useDispatch } from 'react-redux';
import { setDataStatus } from '../../redux/actions';
import { message } from 'antd';
import NewAppModal from '../../components/NewAppModal/NewAppModal';
import { deleteProductById, fetchProducts } from '../../util/axiosMethods/axiosMethods';

const Home = () => {
    const [data, setData] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Product deleted successfully',
        });
    };

    const dataStatus = useSelector(state => state.dataStatus);
    const dispatch = useDispatch();


    useEffect(() => {
        fetchData();
        dispatch(setDataStatus(false));
    }, [dataStatus,]);



    const fetchData = async () => {
        console.log();
        const data = await fetchProducts();
        setData(data);
    };


    const handleDelete = async (id, image_id) => {

        const deleteStatus = await deleteProductById(id, image_id);

        if (deleteStatus) {
            success();
            dispatch(setDataStatus(true));

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
                    {data.length > 0 ? data.slice().reverse().map((e) => (
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
