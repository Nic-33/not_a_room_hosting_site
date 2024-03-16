import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSpot } from "../../store/spots";
import { createNewSpotImages } from "../../store/spotImages";
import './CreateSpotForm.css'
import '../../index.css'

const CreateSpotForm = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [lat, setLat] = useState()
    const [lng, setLng] = useState()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [previewImage, setPreviewImage] = useState('')
    const [image1, setImage1] = useState('')
    const [image2, setImage2] = useState('')
    const [image3, setImage3] = useState('')
    const [image4, setImage4] = useState('')
    const [addressError, setAddressError] = useState("hidden")
    const [countryError, setCountryError] = useState("hidden")
    const [cityError, setCityError] = useState("hidden")
    const [stateError, setStateError] = useState("hidden")
    const [descriptionError, setDescriptionError] = useState("hidden")
    const [nameError, setNameError] = useState("hidden")
    const [priceError, setPriceError] = useState("hidden")
    const [previewError, setPreviewError] = useState("hidden")

    console.log(addressError)

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

        setAddressError("hidden")
        setCityError("hidden")
        setCountryError("hidden")
        setDescriptionError("hidden")
        setStateError("hidden")
        setNameError("hidden")
        setPriceError("hidden")
        setPreviewError("hidden")

        let error = true
        if (address.length === 0) {
            setAddressError('visible')
            error = false
        }
        if (!(city)) {
            setCityError('visible')
            error = false
        }
        if (!(state)) {
            setStateError('visible')
            error = false
        }
        if (!(country) || country.length === 0) {
            setCountryError('visible')
            error = false
        }
        if (description.length < 1) {
            setDescriptionError('visible')
            error = false
        }
        if (!(name)) {
            setNameError('visible')
            error = false
        }
        if (!(price) || price < 1) {
            setPriceError('visible')
            error = false
        }
        if (!(previewImage) || previewImage.length === 0) {
            setPreviewError('visible')
            error = false
        }


        if (error) {
            let spot = await dispatch(createSpot(createSpotInfo))
            console.log('spot inside createspot:', spot)
            if (previewImage.length) {
                dispatch(createNewSpotImages({ url: previewImage, preview: true }, spot.id))
            }
            if (image1.length) {
                dispatch(createNewSpotImages({ url: image1, preview: false }, spot.id))
            }
            if (image2.length) {
                dispatch(createNewSpotImages({ url: image2, preview: false }, spot.id))
            }
            if (image3.length) {
                dispatch(createNewSpotImages({ url: image3, preview: false }, spot.id))
            }
            if (image4.length) {
                dispatch(createNewSpotImages({ url: image4, preview: false }, spot.id))
            }
            navigate(`/${spot.id}`)
        } else {
            return
        }
    }

    return (
        <section className="new-Spot-Form">
            <form className="create-spot-form" onSubmit={handleSubmit}>
                <div id='addressBlock'>
                    <h1>Create a new Spot</h1>
                    <h2>Where is your place Located</h2>
                    <h3>Guests will only get your exact address once they booked a reservation.</h3>
                    <div id="title">
                        <div>Country</div>
                        <div className="error" style={{ visibility: countryError }}>Country is required</div>
                    </div>
                    <input
                        type="text"
                        placeholder="Country"
                        value={country}
                        onChange={updateCountry} />
                    <div id="title">
                        <div>Street Address</div>
                        <div className="error" style={{ visibility: addressError }}>Street Address is required</div>
                    </div>
                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={updateAddress} />
                    <div id="title">
                        <div>City</div>
                        <div className="error" style={{ visibility: cityError }}>City is required</div>
                    </div>
                    <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={updateCity} />
                    <div id="title">
                        <div>State</div>
                        <div className="error" style={{ visibility: stateError }}>State is required</div>
                    </div>
                    <input
                        type="text"
                        placeholder="State"
                        value={state}
                        onChange={updateState} />
                    <div id='latLng'>
                        <div id="title">
                            <div>Latitude</div>
                        </div>
                        <input
                            type="number"
                            placeholder="Latitude"
                            value={lat}
                            onChange={updateLat} />
                        <div id="title">
                            <div>Longitude</div>
                        </div>
                        <input
                            type="number"
                            placeholder="longitude"
                            value={lng}
                            onChange={updateLng} />
                    </div>
                </div>
                <div id='descriptionBlock'>
                    <h2>Describe your place to Guests</h2>
                    <h3>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</h3>
                    <textarea
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={updateDescription} />
                    <div className="error" style={{ visibility: descriptionError }}>Description needs a minimum of 30 characters</div>

                </div>
                <div id='spotNameBlock'>
                    <h2>Create a title for your spot</h2>
                    <h3>Catch guests attention with a spot title that highlights what makes your place special</h3>
                    <input
                        type="text"
                        placeholder="Name of Spot"
                        value={name}
                        onChange={updateName} />
                    <div className="error" style={{ visibility: nameError }}>Name is required</div>

                </div>
                <div id='spotPrice'>
                    <h2>Set a base price for your spot</h2>
                    <h3>Competitive pricing can help your listing stand out and rank higher in search results</h3>
                    <div id="price">
                        <h4>$</h4>
                        <input
                            type="text"
                            placeholder="price"
                            value={price}
                            onChange={updatePrice} />
                        <div className="error" style={{ visibility: priceError }}>Price is required.</div>
                    </div>
                </div>
                <div id='imageBlock'>
                    <h2>Liven up your spot with photos</h2>
                    <h3>Submit a link to at least one photo to publish your spot</h3>
                    <input
                        type="text"
                        placeholder="Preview Image URL"
                        value={previewImage}
                        onChange={updatePreviewImage} />
                    <div className="error" style={{ visibility: previewError }}>Preview Image is required.</div>
                    <div id="image">
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={image1}
                            onChange={updateImage1} />
                        <div className="error" hidden={true}>Image URL must end in .png, .jpg, or .jpeg</div>
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={image2}
                            onChange={updateImage2} />
                        <div className="error" hidden={true}>Image URL must end in .png, .jpg, or .jpeg</div>
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={image3}
                            onChange={updateImage3} />
                        <div className="error" hidden={true}>Image URL must end in .png, .jpg, or .jpeg</div>
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={image4}
                            onChange={updateImage4} />
                    </div>
                </div>
                <div id="button">
                    <button type="submit">Create New Spot</button>
                </div>
            </form>
        </section >
    );
};

export default CreateSpotForm
