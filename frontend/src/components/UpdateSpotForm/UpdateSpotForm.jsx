import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateSpot } from "../../store/spots";
import { getSpot } from "../../store/spots";

const UpdateSpotForm = () => {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const spot = useSelector((state) => state.spots)
    const [address, setAddress] = useState(spot.address)
    const [city, setCity] = useState(spot.city)
    const [state, setState] = useState(spot.state)
    const [country, setCountry] = useState(spot.country)
    const [lat, setLat] = useState(spot.lat)
    const [lng, setLng] = useState(spot.lng)
    const [name, setName] = useState(spot.name)
    const [description, setDescription] = useState(spot.description)
    const [price, setPrice] = useState(spot.price)

    const updateAddress = (e) => setAddress(e.target.value)
    const updateCity = (e) => setCity(e.target.value)
    const updateState = (e) => setState(e.target.value)
    const updateCountry = (e) => setCountry(e.target.value)
    const updateLat = (e) => setLat(e.target.value)
    const updateLng = (e) => setLng(e.target.value)
    const updateName = (e) => setName(e.target.value)
    const updateDescription = (e) => setDescription(e.target.value)
    const updatePrice = (e) => setPrice(e.target.value)

    const handleSubmit = async (e) => {
        e.preventDefault()
        let createSpotInfo = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        }

        if (createSpotInfo) {
            dispatch(updateSpot(createSpotInfo, spotId))
            navigate(`/spots/current`)
        }
    }

    useEffect(() => {
        dispatch(getSpot(spotId))
    }, [dispatch, spotId])

    return (
        <section className="new-form-holder centered middled">
            <form className="create-spot-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Address"
                    required
                    value={address}
                    onChange={updateAddress} />
                <input
                    type="text"
                    placeholder="City"
                    required
                    value={city}
                    onChange={updateCity} />
                <input
                    type="text"
                    placeholder="State"
                    required
                    value={state}
                    onChange={updateState} />
                <input
                    type="text"
                    placeholder="Country"
                    required
                    value={country}
                    onChange={updateCountry} />
                <input
                    type="number"
                    placeholder="Latitude"
                    value={lat}
                    onChange={updateLat} />
                <input
                    type="number"
                    placeholder="longitude"
                    value={lng}
                    onChange={updateLng} />
                <input
                    type="text"
                    placeholder="Name of Spot"
                    required
                    value={name}
                    onChange={updateName} />
                <input
                    type="text"
                    placeholder="Description"
                    required
                    value={description}
                    onChange={updateDescription} />
                <input
                    type="text"
                    placeholder="price"
                    required
                    value={price}
                    onChange={updatePrice} />

                <button type="submit">Update Spot</button>
                <button>Cancel</button>
            </form>
        </section>
    );
};

export default UpdateSpotForm
