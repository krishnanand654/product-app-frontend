import { Button } from "@nextui-org/react"

/* eslint-disable react/prop-types */
const Card = ({ name, description, image, price, onDelete, _id }) => {
    return (
        <div className="lg:w-80 md:w-48 sm:w-24 cursor-pointer">
            <div className="lg:w-80 lg:h-80 md:w-48 sm:w-24 ">
                <img className="lg:h-full lg:w-full object-contain" src={image} />
            </div>
            <div className="ml-3 lg:m-0">
                <h1 className="font-medium pt-2">{name}</h1>
                <p className="font-medium text-slate-500">{description}</p>
                <p className="font-medium">MRP: ₹{price}</p>
                <div className="flex justify-end align-middle mt-3 gap-4 "  >

                    <Button className="" color="primary" variant="flat" size="sm">Update</Button>

                    <Button variant="flat" color="danger" size="sm" className="mr-3 lg:mr-1" onClick={() => { onDelete(_id) }}>
                        Delete
                    </Button>
                </div>
            </div>
        </div >
    )
}

export default Card