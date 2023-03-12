import React from 'react';
import PropTypes from 'prop-types';
import { MyButton } from '../components/MyButton';
import { GetCertainListing } from '../helper';
import { useNavigate } from 'react-router-dom';
// import { editBtn } from './EditListing';
// import { useContext, Context } from '../context';

// let listings = [];
const fetchedMyListings = [];
const listingsTitles = [];
const titleIdPair = {};

const MyListings = (props) => {
  // const [listings, setListings] = React.useState([]);
  const [mylistings, setMylistings] = React.useState([]);
  const [listingsPublished, setListingsPublished] = React.useState({});
  const navigate = useNavigate();
  // const { getters } = useContext(Context);
  // const [randomNumber, setRandomNumber] = React.useState(0);

  const editBtn = (houseId) => {
    navigate(`/mylisting/edit/${houseId}`);
    // console.log('editBtn');
  }

  const deleteBtn = async (houseId) => {
    // console.log('deleteBtn');
    const res = await fetch(`http://localhost:5005/listings/${houseId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${props.token}`
      }
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert('Listing successfully deleted');
      navigate('/mylistings');
    }
  }

  const GetMyListingsAction = async () => {
    const res = await fetch('http://localhost:5005/listings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${props.token}`
      }
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      const newMyListings = [...mylistings];
      const newlistingsPublished = { ...listingsPublished };
      // from all the listings, get my listings(when email matches)
      data.listings.forEach(function (listing, index) {
        if (listing.owner === localStorage.getItem('email')) {
          titleIdPair[listing.title] = listing.id;
          newMyListings.push(listing);

          if (listing.published) {
            newlistingsPublished[listing.title] = true;
          } else {
            newlistingsPublished[listing.title] = false;
          }
        }
      });
      setListingsPublished(newlistingsPublished);
      setMylistings(newMyListings);
    }
  };
  React.useEffect(() => {
    GetMyListingsAction();
    // return () => {
    //   // cleanup
    //   setMylistings([]);
    //   listingsTitles = [];
    // }
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ width: '75%' }}>
      <br />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <MyButton text='Make a new listing' onClick={ () => navigate('/mylisting/new') }></MyButton> <br />
      </div>
      <h2>My Current Listings: </h2>

      {/* for each of mylistings, get its info that we really need, store all of them in fetchedMyListings */}
      {mylistings.forEach(function (item, index) {
        GetCertainListing(item.id, props.token)
          .then((data) => {
            // make sure we don't have duplicate listings
            if (!listingsTitles.includes(data.listing.title)) {
              listingsTitles.push(data.listing.title);
              fetchedMyListings.push(data.listing);
            }
          });
      })}

      {fetchedMyListings.map((listing, index) => {
        return (
          <div key={index}>
            <h3>Title: {listing.title}</h3>
            <p>PropertyType: {listing.metadata.propertyType}</p>
            <p>Number of beds: {listing.metadata.beds}</p>
            <p>Number of bathrooms: {listing.metadata.bathrooms}</p>
            <img src={listing.thumbnail} alt="Thumbnail of the listing house" style={{ width: '20%', height: '20%' }} />
            <p>SVG rating of the listing: </p>
            <p>Number of total reviews: </p>
            <p>Price (per night): {listing.price}</p>
            <p><MyButton text='Publish' disabled={listingsPublished[listing.title]} onClick={ () => navigate(`/mylisting/publish/${listing.title}`) }></MyButton>
              <MyButton text='Unpublish' disabled={!listingsPublished[listing.title]} onClick={ () => console.log('unpublish') }></MyButton>
              <MyButton text='Edit' onClick={ () => editBtn(titleIdPair[listing.title]) }></MyButton>
              <MyButton text='Delete' onClick={ () => deleteBtn(titleIdPair[listing.title]) }></MyButton>
            </p>
          </div>
        );
      })}

    </div>
    </div>
  );
}
MyListings.propTypes = {
  token: PropTypes.string
};
export default MyListings;
