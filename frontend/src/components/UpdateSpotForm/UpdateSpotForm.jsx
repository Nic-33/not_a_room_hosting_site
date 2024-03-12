import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateSpot } from "../../store/spots";
import { getSpot } from "../../store/spots";
import '../../index.css'


const UpdateSpotForm = () => {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const spot = useSelector((state) => state.spots)
    const [loaded, setLoaded] = useState(false)
    console.log('spot on updateform', spot)

    const [address, setAddress] = useState(spot.address)
    const [city, setCity] = useState(spot.city)
    const [state, setState] = useState(spot.state)
    const [country, setCountry] = useState(spot.country)
    const [lat, setLat] = useState(spot.lat)
    const [lng, setLng] = useState(spot.lng)
    const [name, setName] = useState(spot.name)
    const [description, setDescription] = useState(spot.description)
    const [price, setPrice] = useState(spot.price)
    const [previewImage, setPreviewImage] = useState()
    const [image1, setImage1] = useState()
    const [image2, setImage2] = useState()
    const [image3, setImage3] = useState()
    const [image4, setImage4] = useState()

    const updateAddress = (e) => setAddress(e.target.value)
    const updateCity = (e) => setCity(e.target.value)
    const updateState = (e) => setState(e.target.value)
    const updateCountry = (e) => setCountry(e.target.value)
    const updateLat = (e) => setLat(e.target.value)
    const updateLng = (e) => setLng(e.target.value)
    const updateName = (e) => setName(e.target.value)
    const updateDescription = (e) => setDescription(e.target.value)
    const updatePrice = (e) => setPrice(e.target.value)
    const updateImage1 = (e) => setImage1(e.target.value)
    const updateImage2 = (e) => setImage2(e.target.value)
    const updateImage3 = (e) => setImage3(e.target.value)
    const updateImage4 = (e) => setImage4(e.target.value)
    const updatePreviewImage = (e) => setPreviewImage(e.target.value)

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
            navigate(`/${spotId}`)
        }
    }

    useEffect(() => {
        dispatch(getSpot(spotId))
            .then(() => setLoaded(true))
    }, [dispatch, spotId])


    return (
        <>{loaded && <div>
            <section className="new-form-holder">
                <h1>Update your Spot</h1>
                <h2>Where's your place Located</h2>
                <h3>Guests will only get your exact address once they booked a reservation.</h3>
                <form className="update-spot-form" onSubmit={handleSubmit}>
                    <div id='addressBlock'>
                        <h3>Country</h3>
                        <input
                            type="text"
                            placeholder="Country"
                            required
                            value={country}
                            onChange={updateCountry} />
                        <h3>Street Address</h3>
                        <input
                            type="text"
                            placeholder="Address"
                            required
                            value={address}
                            onChange={updateAddress} />
                        <h3>City</h3>
                        <input
                            type="text"
                            placeholder="City"
                            required
                            value={city}
                            onChange={updateCity} />
                        <h3>State</h3>
                        <input
                            type="text"
                            placeholder="State"
                            required
                            value={state}
                            onChange={updateState} />
                        <h3>Latitude</h3>
                        <input
                            type="number"
                            placeholder="Latitude"
                            value={lat}
                            onChange={updateLat} />
                        <h3>Longitude</h3>
                        <input
                            type="number"
                            placeholder="longitude"
                            value={lng}
                            onChange={updateLng} />
                    </div>
                    <div id='descriptionBlock'>
                        <h2>Describe your place to Guests</h2>
                        <h3>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</h3>
                        <textarea
                            type="text"
                            placeholder="Description"
                            required
                            value={description}
                            onChange={updateDescription} />
                    </div>
                    <div id='spotNameBlock'>
                        <h2>Create a title for your spot</h2>
                        <h3>Catch guests attention with a spot title that highlights what makes your place special</h3>
                        <input
                            type="text"
                            placeholder="Name of Spot"
                            required
                            value={name}
                            onChange={updateName} />
                    </div>
                    <div id='spotPrice'>
                        <h2>Set a base price for your spot</h2>
                        <h3>competitive pricing can help your listing stand out and rank higher in search results</h3>
                        <h4>$</h4>
                        <input
                            type="text"
                            placeholder="price"
                            required
                            value={price}
                            onChange={updatePrice} />
                    </div>
                    <div id='imageBlock'>
                        <h2>Liven up your spot with photos</h2>
                        <h3>Submit a link to at least one photo to publish your spot</h3>
                        <input
                            type="text"
                            placeholder="Preview Image URL"
                            required
                            value={previewImage}
                            onChange={updatePreviewImage} />
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={image1}
                            onChange={updateImage1} />
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={image2}
                            onChange={updateImage2} />
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={image3}
                            onChange={updateImage3} />
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={image4}
                            onChange={updateImage4} />
                    </div>

                    <button type="submit">Update Spot</button>
                </form>
            </section>
        </div>}</>
    );
};

export default UpdateSpotForm
