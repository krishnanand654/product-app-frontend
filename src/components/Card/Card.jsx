import { Button } from "@nextui-org/react"
// import UpdateModal from "../UpdateModal/UpdateModal"
import NewUpdateModal from "../NewUpdateModal/NewUpdateModal";

/* eslint-disable react/prop-types */
const Card = ({ name, description, image, price, onDelete, _id, image_id, }) => {

    const updateModalProps = {
        name,
        description,
        image,
        price,
        _id,
        image_id
    };
    return (
        <div className="lg:w-80 md:w-48 sm:w-24 cursor-pointer ">
            <div className="">
                <img className="lg:h-full lg:w-full object-contain" src={image} />
            </div>
            <div className="ml-3 lg:m-0 leading-7 flex justify-between h-full" style={{ alignItems: 'end' }}>
                <div >
                    <h1 className="text-lg font-medium pt-2">{name}</h1>
                    <p className="text-md font-[500] text-gray-500">{description}</p>
                    <p className="font-medium">MRP: ₹{price}</p>
                </div>
                <div className="flex justify-end align-middle mt-3 gap-4 "  >


                    <NewUpdateModal {...updateModalProps} />

                    <Button variant="flat" color="danger" size="sm" className="mr-3 lg:mr-1" onClick={() => { onDelete(_id, image_id) }}>
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Card