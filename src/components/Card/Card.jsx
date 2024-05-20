/* eslint-disable react/prop-types */
const Card = ({ name, description, image, price }) => {
    return (
        <div className="lg:w-80 md:w-48 sm:w-24 cursor-pointer">
            <img src={image} />
            <div className="ml-3 lg:m-0">
                <h1 className="font-medium pt-2">{name}</h1>
                <p className="font-medium text-slate-500">{description}</p>
                <p className="font-medium">MRP: ₹{price}</p>
            </div>
        </div>
    )
}

export default Card