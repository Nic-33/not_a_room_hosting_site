import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSpot } from "../../store/spots";
import { createNewSpotImages } from "../../store/spotImages";

const CreateSpotForm = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [lat, setLat] = useState()
    const [lng, setLng] = useState()
    const [name, setName] = useState()
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [previewImage, setPreviewImage] = useState('')
    const [image1, setImage1] = useState([])
    const [image2, setImage2] = useState('')
    const [image3, setImage3] = useState('')
    const [image4, setImage4] = useState('')

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
            let spot = dispatch(createSpot(createSpotInfo))
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
            navigate(`/`)
        }
    }
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
                <textarea
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
                <button type="submit">Create new Spot</button>
            </form>
        </section>
    );
};

export default CreateSpotForm
