import React from 'react';
import PropTypes from 'prop-types';
import { fileToDataUrl, MenuProps } from '../helper';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemIcon, ListItemText } from '@mui/material';
import { MyButton } from '../components/MyButton';
import { useNavigate } from 'react-router-dom';

const ListingNew = (props) => {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [selectedFile, setSelectedFile] = React.useState();
  const [propertyType, setPropertyType] = React.useState('');
  const [bathrooms, setBathrooms] = React.useState(0);
  const [bedRooms, setBedRooms] = React.useState(0);
  const [beds, setBeds] = React.useState([]);
  const [amenities, setAmenities] = React.useState([]);
  const amenitiesOptions = ['Wi-Fi', 'Kitchen', 'Air conditioning', 'Washing machine'];

  const updateSingleBed = index => e => {
    const oldBeds = [...beds];
    oldBeds[index] = parseInt(e.target.value);
    setBeds(oldBeds);
  };

  const NewListingAction = async () => {
    const res = await fetch('http://localhost:5005/listings/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        title,
        address: { address },
        price,
        thumbnail: selectedFile,
        metadata: {
          propertyType,
          bathrooms,
          bedRooms,
          beds,
          amenities
        }
      })
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      // console.log(data);
      navigate('/mylisting');
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ width: '75%' }}>
      <br /><br />
      Title: <input type="text" onChange={(e) => setTitle(e.target.value)} value={title} /><br /><br />
      Address: <input type="text" onChange={(e) => setAddress(e.target.value)} value={address} /><br /><br />
      Price(per night): <input type="text" onChange={(e) => setPrice(e.target.value)} value={price} /><br /><br />
      Thumbnail: <input
          type="file"
          accept="image/*"
          onChange={ async (e) => {
            // setSelectedFile(URL.createObjectURL(e.target.files[0]));
            // console.log(selectedFile);
            const dataUrl = await fileToDataUrl(e.target.files[0])
            if (dataUrl === 'redflag') {
              alert('Sorry, the provided file is not a png, jpg or jpeg image.');
            }
            setSelectedFile(dataUrl);
          }}/>
      <img src={selectedFile} style={{ width: '15%', height: '15%' }}/><br /><br />

      Type: <Select style={{ width: '25%' }}
        labelId="property-select-label"
        id="type-select"
        value={propertyType}
        label="type"
        onChange={(event) => setPropertyType(event.target.value)}
      >
        <MenuItem value="House">House</MenuItem>
        <MenuItem value="Apartment">Apartment</MenuItem>
        <MenuItem value="Hotel">Hotel</MenuItem>
      </Select> <br /><br />

      Number of bathrooms: <input type="number" value= {bathrooms} onChange={(e) => setBathrooms(e.target.value)}/><br /><br />

      Number of bedrooms: <input type="number" label="Bed Rooms"
        onChange={(event) => {
          setBedRooms(event.target.value);
          const currBeds = [];
          if (currBeds[event.target.value] !== 0) {
            for (let i = 0; i < event.target.value; i++) {
              currBeds[i] = beds[i];
            }
            for (let i = event.target.value; i < currBeds.length; i++) {
              currBeds[i] = 0;
            }
          }
          setBeds(currBeds);
        }}
        value={bedRooms}>
      </input><br /><br />

      <Grid item>
        {bedRooms !== 0 && <>Beds:<br/><br/></>}
        <Grid
          container
          spacing={3}
          justifyContent="center">
          {/* {bedsWithinBedrooms} */}
          {beds.map((bed, i) => {
            return (
              <Grid key={`beds_${i}`} item xs={12} sm={6} md={3}>
                <TextField type="number" label={`Beds in bedroom ${i + 1}`} variant="outlined" name="beds" id={`no_beds_${i + 1}`} onChange={updateSingleBed(i)}/>
              </Grid>
            )
          })}
        </Grid>
      </Grid ><br /><br />

      <Grid item xs={12}>
        {/* <span style={{ display: 'flex', alignItems: 'center' }}><span >Amenities: </span></span> */}
        <span style={{ argin: 'auto' }}>Amenities: </span>
        <FormControl style={{ width: '78%' }}>
          <InputLabel id="mutiple-select-label">amenities</InputLabel>
          <Select
            labelId="mutiple-select-label"
            multiple
            value={amenities}
            onChange={(event) => {
              const value = event.target.value;
              if (value[value.length - 1] === 'all') {
                setAmenities(amenities.length === amenitiesOptions.length ? [] : amenitiesOptions);
                return;
              }
              setAmenities(value);
            }}
            renderValue={(amenities) => amenities.join(', ')}
            MenuProps={MenuProps}
          >
            {amenitiesOptions.map((option) => (
              <MenuItem key={option} value={option}>
                <ListItemIcon>
                  <Checkbox checked={amenities.indexOf(option) > -1} />
                </ListItemIcon>
                <ListItemText primary={option} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid><br /><br />

      {/* {console.log('type:' + propertyType, 'bathrooms:' + bathrooms, 'bedRooms:' + bedRooms, 'beds:' + beds, 'amenities:' + amenities)} */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <MyButton onClick={() => NewListingAction()} text='Create'></MyButton>
      </div>
    </div>
    </div>
  );
}
ListingNew.propTypes = {
  token: PropTypes.string
};

export default ListingNew;
